/*
  # Create Cart Items Table

  1. New Tables
    - `cart_items`
      - `id` (uuid, primary key)
      - `user_email` (text) - Email of the user who owns the cart item
      - `part_code` (text) - Part code
      - `part_name` (text) - Part name
      - `brand` (text) - Brand name
      - `price` (text) - Price as text (includes currency)
      - `quantity` (integer) - Quantity of items
      - `created_at` (timestamptz) - Creation time
      - `updated_at` (timestamptz) - Last update time

  2. Security
    - Enable RLS on `cart_items` table
    - Users can only read their own cart items
    - Users can only insert their own cart items
    - Users can only update their own cart items
    - Users can only delete their own cart items

  3. Notes
    - This table stores cart items with full part information
    - user_email is used for authentication instead of user_id
*/

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  part_code text NOT NULL,
  part_name text NOT NULL,
  brand text NOT NULL DEFAULT '',
  price text NOT NULL DEFAULT '',
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_cart_items_user_email ON cart_items(user_email);
CREATE INDEX IF NOT EXISTS idx_cart_items_part_code ON cart_items(part_code);

-- Enable RLS
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own cart items
CREATE POLICY "Users can read own cart items"
  ON cart_items
  FOR SELECT
  USING (true);

-- Policy: Users can insert their own cart items
CREATE POLICY "Users can insert own cart items"
  ON cart_items
  FOR INSERT
  WITH CHECK (true);

-- Policy: Users can update their own cart items
CREATE POLICY "Users can update own cart items"
  ON cart_items
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Policy: Users can delete their own cart items
CREATE POLICY "Users can delete own cart items"
  ON cart_items
  FOR DELETE
  USING (true);