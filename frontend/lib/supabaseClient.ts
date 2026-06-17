import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log("URL type:", typeof supabaseUrl, "value:", supabaseUrl)
console.log("KEY type:", typeof supabaseKey, "length:", supabaseKey?.length)

export const supabase = createClient(supabaseUrl, supabaseKey)