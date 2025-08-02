import { createClient } from '@supabase/supabase-js';

// Use the DATABASE_URL from environment or fall back to Supabase URL
const databaseUrl = import.meta.env.DATABASE_URL || 'postgresql://postgres:LpWvyPBUc6o3SrBG@db.qvjxwkttohjhlhvimoqf.supabase.co:5432/postgres';

// For direct PostgreSQL connection via Supabase, we'll create a simple client
const supabaseUrl = 'https://qvjxwkttohjhlhvimoqf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2anh3a3R0b2hqaGxodmltb3FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNzI0MTUsImV4cCI6MjA2OTY0ODQxNX0.WiVKALXqVE71hSzlROGJSYhuYxLOPCKgmDLVn1ryurE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);