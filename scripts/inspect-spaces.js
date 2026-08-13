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

async function inspect() {
  console.log("=== ALL SPACES IN SUPABASE ===");
  const { data: spaces, error } = await supabase.from('spaces').select('*');
  console.log("Spaces count:", spaces?.length, "| Error:", error);
  console.log(JSON.stringify(spaces, null, 2));
}

inspect();
