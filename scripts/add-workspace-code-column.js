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
  console.log("=== CHECKING IF SQL ALTER TABLE CAN BE EXECUTED ===");
  // Test if we can run rpc exec_sql or query information_schema
  const { data: cols, error: cErr } = await supabase.rpc('get_table_columns', { table_name: 'spaces' });
  console.log("RPC get_table_columns:", cols, cErr);
}

run();
