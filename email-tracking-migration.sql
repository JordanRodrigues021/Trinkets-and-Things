-- ============================================================================
-- EMAIL TRACKING MIGRATION FOR ORDERS TABLE
-- ============================================================================
-- 
-- INSTRUCTIONS FOR EXECUTION:
-- 1. Copy the SQL commands below
-- 2. Go to Supabase Dashboard > SQL Editor
-- 3. Paste and run this script to add email tracking fields
-- 
-- DESCRIPTION:
-- This migration adds email tracking fields to the orders table to track
-- which emails have been sent for each order. This enables the admin panel
-- to show which emails have been sent and prevents duplicate sends.
-- 
-- FIELDS ADDED:
-- - email_sent_placed: tracks if "Order Placed" email was sent
-- - email_sent_confirmed: tracks if "Order Confirmed" email was sent
-- ============================================================================

-- Add email tracking columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS email_sent_placed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_sent_confirmed BOOLEAN DEFAULT FALSE;

-- Add comments for documentation
COMMENT ON COLUMN orders.email_sent_placed IS 'Tracks if the "Order Placed" confirmation email was sent to customer';
COMMENT ON COLUMN orders.email_sent_confirmed IS 'Tracks if the "Order Confirmed" status email was sent to customer';

-- Optional: Update existing orders to set email_sent_placed = true if they were created before this migration
-- This assumes that orders placed before this migration had their initial emails sent
-- Uncomment the line below if you want to mark existing orders as having their initial emails sent:
-- UPDATE orders SET email_sent_placed = TRUE WHERE created_at < NOW();

SELECT 'Email tracking fields added successfully!' as result;