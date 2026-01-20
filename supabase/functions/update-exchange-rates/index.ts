import { createClient } from 'npm:@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const BASE_CURRENCY = 'AED';
    const targetCurrencies = ['TJS', 'USD'];

    const response = await fetch(
      `https://open.er-api.com/v6/latest/AED`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Currency API error: ${response.status}`);
    }

    const data = await response.json();
    const rates = data.rates;

    console.log('Fetched rates from ExchangeRate-API:', rates);

    const updates = [];
    for (const currency of targetCurrencies) {
      const rate = rates[currency];

      if (rate) {
        const { error } = await supabase
          .from('exchange_rates')
          .upsert(
            {
              currency_from: BASE_CURRENCY,
              currency_to: currency,
              rate: rate,
              updated_at: new Date().toISOString(),
            },
            {
              onConflict: 'currency_from,currency_to',
            }
          );

        if (error) {
          console.error(`Error updating ${currency}:`, error);
        } else {
          updates.push({ currency, rate });
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Exchange rates updated successfully',
        rates: updates,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});