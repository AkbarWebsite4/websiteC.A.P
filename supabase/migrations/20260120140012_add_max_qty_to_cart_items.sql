/*
  # Add max_qty field to cart_items

  1. Changes
    - Add `max_qty` column to cart_items table to store maximum available quantity
    - This allows cart to validate quantity against stock availability

  2. Notes
    - Default value is '999999' for unlimited stock
    - Stored as text to match the format in catalog_parts
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cart_items' AND column_name = 'max_qty'
  ) THEN
    ALTER TABLE cart_items ADD COLUMN max_qty text DEFAULT '999999';
  END IF;
END $$;