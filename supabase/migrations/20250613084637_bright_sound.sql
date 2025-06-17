/*
  # Create wishlist system

  1. New Tables
    - `wishlist_items`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `product_id` (text)
      - `product_name` (text)
      - `product_price` (numeric)
      - `product_image` (text)
      - `product_category` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `wishlist_items` table
    - Add policies for users to manage their own wishlist items
*/

CREATE TABLE IF NOT EXISTS wishlist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id text NOT NULL,
  product_name text NOT NULL,
  product_price numeric NOT NULL,
  product_image text NOT NULL,
  product_category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

-- Users can only access their own wishlist items
CREATE POLICY "Users can view own wishlist items"
  ON wishlist_items
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wishlist items"
  ON wishlist_items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own wishlist items"
  ON wishlist_items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS wishlist_items_user_id_idx ON wishlist_items(user_id);
CREATE INDEX IF NOT EXISTS wishlist_items_product_id_idx ON wishlist_items(product_id);
CREATE INDEX IF NOT EXISTS wishlist_items_created_at_idx ON wishlist_items(created_at);

-- Prevent duplicate wishlist items for same user and product
CREATE UNIQUE INDEX IF NOT EXISTS wishlist_items_user_product_unique 
  ON wishlist_items(user_id, product_id);