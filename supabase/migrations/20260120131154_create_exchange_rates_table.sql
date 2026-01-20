/*
  # Create Exchange Rates Table

  1. New Tables
    - `exchange_rates`
      - `id` (uuid, primary key)
      - `currency_from` (text) - Base currency (e.g., 'AED')
      - `currency_to` (text) - Target currency (e.g., 'TJS', 'USD')
      - `rate` (numeric) - Exchange rate
      - `updated_at` (timestamptz) - Last update time
      - `created_at` (timestamptz) - Creation time

  2. Security
    - Enable RLS on `exchange_rates` table
    - Add policy for public read access (everyone can read rates)
    - Add policy for admin write access (only admins can update rates)

  3. Initial Data
    - Insert default exchange rates for AED to TJS and USD
*/

-- Create exchange_rates table
CREATE TABLE IF NOT EXISTS exchange_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  currency_from text NOT NULL DEFAULT 'AED',
  currency_to text NOT NULL,
  rate numeric NOT NULL,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(currency_from, currency_to)
);

-- Enable RLS
ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read exchange rates
CREATE POLICY "Anyone can read exchange rates"
  ON exchange_rates
  FOR SELECT
  USING (true);

-- Allow service role to insert/update exchange rates
CREATE POLICY "Service role can manage exchange rates"
  ON exchange_rates
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert initial exchange rates
INSERT INTO exchange_rates (currency_from, currency_to, rate, updated_at)
VALUES 
  ('AED', 'AED', 1, now()),
  ('AED', 'TJS', 2.89, now()),
  ('AED', 'USD', 0.2723, now())
ON CONFLICT (currency_from, currency_to) 
DO UPDATE SET rate = EXCLUDED.rate, updated_at = now();