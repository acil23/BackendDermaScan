import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = 'https://oarokmjfnxjpzymctvzf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hcm9rbWpmbnhqcHp5bWN0dnpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MTIyNDgsImV4cCI6MjA2NTI4ODI0OH0.9Y-22AdhZrOLVZUeNX3sxW6iCJ1haRCekiXQlBu1l3g';
export const supabase = createClient(supabaseUrl, supabaseKey);
