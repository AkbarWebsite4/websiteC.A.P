import { createClient } from 'npm:@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

async function fetchRatesFromGoogle(baseCurrency: string, targetCurrencies: string[]): Promise<Record<string, number> | null> {
  try {
    const rates: Record<string, number> = {};
    for (const target of targetCurrencies) {
      const url = `https://www.google.com/finance/quote/${baseCurrency}-${target}`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
          'Accept': 'text/html',
        },
      });
      if (!res.ok) continue;
      const html = await res.text();
      const match = html.match(/data-last-price="([0-9.]+)"/);
      if (match && match[1]) {
        rates[target] = parseFloat(match[1]);
      }
    }
    return Object.keys(rates).length > 0 ? rates : null;
  } catch {
    return null;
  }
}

async function fetchRatesFromOpenER(baseCurrency: string): Promise<Record<string, number> | null> {
  try {
    const response = await fetch(`https://open.er-api.com/v6/latest/${baseCurrency}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.rates || null;
  } catch {
    return null;
  }
}

async function fetchRatesFromFixer(baseCurrency: string): Promise<Record<string, number> | null> {
  try {
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.rates || null;
  } catch {
    return null;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const BASE_CURRENCY = 'AED';
    const targetCurrencies = ['TJS', 'USD'];

    const { data: existingRates } = await supabase
      .from('exchange_rates')
      .select('updated_at')
      .eq('currency_from', BASE_CURRENCY)
      .limit(1)
      .maybeSingle();

    if (existingRates?.updated_at) {
      const lastUpdate = new Date(existingRates.updated_at);
      const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
      if (lastUpdate > hourAgo) {
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Rates are up to date (updated less than 1 hour ago)',
            last_updated: existingRates.updated_at,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    let rates: Record<string, number> | null = null;
    let source = '';

    rates = await fetchRatesFromGoogle(BASE_CURRENCY, targetCurrencies);
    if (rates && Object.keys(rates).length === targetCurrencies.length) {
      source = 'Google Finance';
    }

    if (!rates || Object.keys(rates).length < targetCurrencies.length) {
      const openERRates = await fetchRatesFromOpenER(BASE_CURRENCY);
      if (openERRates) {
        rates = rates || {};
        for (const currency of targetCurrencies) {
          if (!rates[currency] && openERRates[currency]) {
            rates[currency] = openERRates[currency];
          }
        }
        source = source ? `${source} + open.er-api.com` : 'open.er-api.com';
      }
    }

    if (!rates || Object.keys(rates).length < targetCurrencies.length) {
      const fixerRates = await fetchRatesFromFixer(BASE_CURRENCY);
      if (fixerRates) {
        rates = rates || {};
        for (const currency of targetCurrencies) {
          if (!rates[currency] && fixerRates[currency]) {
            rates[currency] = fixerRates[currency];
          }
        }
        source = source ? `${source} + exchangerate-api.com` : 'exchangerate-api.com';
      }
    }

    if (!rates || Object.keys(rates).length === 0) {
      throw new Error('All currency API sources failed');
    }

    const updates = [];
    for (const currency of targetCurrencies) {
      const rate = rates[currency];
      if (!rate) continue;

      const { error } = await supabase
        .from('exchange_rates')
        .upsert(
          {
            currency_from: BASE_CURRENCY,
            currency_to: currency,
            rate: rate,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'currency_from,currency_to' }
        );

      if (error) {
        console.error(`Error updating ${currency}:`, error);
      } else {
        updates.push({ currency, rate });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Exchange rates updated successfully',
        source,
        rates: updates,
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
