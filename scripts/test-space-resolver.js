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

async function resolveSpaceIdAsync(workspaceOrSeat) {
  if (!workspaceOrSeat) {
    const { data } = await supabase.from("spaces").select("id").limit(1).single();
    return data?.id || "cfe43269-f4a7-4f89-95d8-c3ed18f9ff0a";
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(workspaceOrSeat)) {
    const { data: exactSpace } = await supabase.from("spaces").select("id").eq("id", workspaceOrSeat).maybeSingle();
    if (exactSpace?.id) return exactSpace.id;
  }

  const { data: allSpaces } = await supabase.from("spaces").select("id, name, type");
  if (!allSpaces || allSpaces.length === 0) return "cfe43269-f4a7-4f89-95d8-c3ed18f9ff0a";

  const lower = workspaceOrSeat.toLowerCase();

  // 1. Direct name match
  const exactMatch = allSpaces.find(s => s.name.toLowerCase() === lower);
  if (exactMatch) return exactMatch.id;

  // 2. Partial name match
  const partialNameMatch = allSpaces.find(s => lower.includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(lower));
  if (partialNameMatch) return partialNameMatch.id;

  // 3. Type keywords match
  if (lower.includes("meeting") || lower.includes("conference") || lower.includes("room")) {
    const meetingSpace = allSpaces.find(s => s.type === "meeting" || s.name.toLowerCase().includes("meeting"));
    if (meetingSpace) return meetingSpace.id;
  }

  if (lower.includes("study") || lower.includes("desk") || lower.includes("workstation") || lower.includes("quiet")) {
    const studySpace = allSpaces.find(s => s.type === "study" || s.name.toLowerCase().includes("study"));
    if (studySpace) return studySpace.id;
  }

  if (lower.includes("seat") || lower.includes("window") || lower.includes("cafe")) {
    const seatSpace = allSpaces.find(s => s.type === "seat" || s.name.toLowerCase().includes("window"));
    if (seatSpace) return seatSpace.id;
  }

  return allSpaces[0].id;
}

async function run() {
  console.log("=== TESTING DYNAMIC SPACE RESOLVER ===");
  console.log("Window Seat 01 ->", await resolveSpaceIdAsync("Window Seat 01"));
  console.log("Study Desk 01  ->", await resolveSpaceIdAsync("Study Desk 01"));
  console.log("Meeting Room   ->", await resolveSpaceIdAsync("Meeting Room"));
  console.log("Desk T-2S-5    ->", await resolveSpaceIdAsync("Desk T-2S-5"));
}

run();
