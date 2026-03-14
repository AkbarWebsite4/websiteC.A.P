/*
  # Fix catalog_parts table schema

  ## Problem
  The catalog_parts table was recreated with wrong column names (part_number, name_en, name_ru)
  by a later migration, but the application code uses columns: code, name, brand, price, weight,
  category, description, availability, qty.

  ## Solution
  Drop the current catalog_parts table and recreate it with the correct schema matching the
  application code. Also add all necessary indexes, RLS policies, and the qty column.

  ## New Table: catalog_parts
  - id: UUID primary key
  - code: text (unique part number/code) 
  - name: text (part name/description)
  - brand: text (brand, default C.A.P)
  - price: text (price as string, e.g. "25.50 AED")
  - weight: text
  - category: text (source file name)
  - description: text
  - availability: text (В наличии / Нет в наличии)
  - qty: text (quantity)
  - created_at, updated_at: timestamps

  ## Security
  - RLS enabled
  - Open read/write policies for anon and authenticated (custom auth system)
*/

-- Drop old catalog_parts table entirely and recreate with correct schema
DROP TABLE IF EXISTS catalog_parts CASCADE;

CREATE TABLE catalog_parts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL,
  name text NOT NULL DEFAULT '',
  brand text DEFAULT 'C.A.P',
  price text DEFAULT 'Цена по запросу',
  weight text DEFAULT '',
  category text DEFAULT 'Автозапчасти',
  description text DEFAULT '',
  availability text DEFAULT 'В наличии',
  qty text DEFAULT '999',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Unique constraint on code to prevent duplicates
CREATE UNIQUE INDEX catalog_parts_code_unique ON catalog_parts(code);

-- Indexes for fast searching
CREATE INDEX catalog_parts_code_idx ON catalog_parts(code);
CREATE INDEX catalog_parts_name_idx ON catalog_parts(name);
CREATE INDEX catalog_parts_brand_idx ON catalog_parts(brand);

-- Enable RLS
ALTER TABLE catalog_parts ENABLE ROW LEVEL SECURITY;

-- Allow all reads (anon and authenticated)
CREATE POLICY "Anyone can read catalog"
  ON catalog_parts
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow inserts (custom auth system handles authorization at app level)
CREATE POLICY "Allow insert catalog"
  ON catalog_parts
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow updates
CREATE POLICY "Allow update catalog"
  ON catalog_parts
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Allow deletes
CREATE POLICY "Allow delete catalog"
  ON catalog_parts
  FOR DELETE
  TO anon, authenticated
  USING (true);
