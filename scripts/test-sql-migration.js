const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [k, v] = line.trim().split('=');
  if (k && v) env[k] = v;
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("=== TEST SUPABASE RPC / SQL EXECUTION ===");
  const sql = `
    ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
    ALTER TABLE public.profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();
  `;

  // Test calling rpc 'exec_sql' or 'exec' if available
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
  console.log("RPC exec_sql result:", data, "| Error:", error);
}

run();
