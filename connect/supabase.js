import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = 'https://oarokmjfnxjpzymctvzf.supabase.co'
const supabaseKey = process.env.SUPABASE_ANON_KEY
export const supabase = createClient(supabaseUrl, supabaseKey);