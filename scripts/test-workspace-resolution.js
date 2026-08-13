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

async function resolveWorkspaceObject(workspaceOrSeat) {
  if (!workspaceOrSeat) {
    throw new Error("Selected workspace could not be identified. Please select another workspace.");
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const inputStr = String(workspaceOrSeat).trim();

  // Fetch all spaces from Supabase
  const { data: allSpaces, error } = await supabase.from("spaces").select("id, name, type");
  if (error || !allSpaces || allSpaces.length === 0) {
    throw new Error("Unable to load workspaces from database.");
  }

  function getCode(s) {
    if (s.workspace_code) return s.workspace_code;
    const nameLower = s.name.toLowerCase();
    if (nameLower.includes("window")) return "WS-001";
    if (nameLower.includes("study")) return "SD-001";
    if (nameLower.includes("meeting")) return "MR-001";
    if (nameLower.includes("elder")) return "EF-005";
    return s.name.toUpperCase().replace(/\s+/g, "-");
  }

  // 1. UUID Match
  if (uuidRegex.test(inputStr)) {
    const matchedById = allSpaces.find(s => s.id === inputStr);
    if (matchedById) {
      return {
        id: matchedById.id,
        workspaceCode: getCode(matchedById),
        name: matchedById.name,
        type: matchedById.type
      };
    }
  }

  const lower = inputStr.toLowerCase();

  // 2. Exact Name Match (e.g. "Elder Friendly Seat 05")
  const matchedByName = allSpaces.find(s => s.name.toLowerCase() === lower);
  if (matchedByName) {
    return {
      id: matchedByName.id,
      workspaceCode: getCode(matchedByName),
      name: matchedByName.name,
      type: matchedByName.type
    };
  }

  // 3. Partial Name Match
  const matchedPartial = allSpaces.find(s => lower.includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(lower));
  if (matchedPartial) {
    return {
      id: matchedPartial.id,
      workspaceCode: getCode(matchedPartial),
      name: matchedPartial.name,
      type: matchedPartial.type
    };
  }

  // 4. Keyword Match for Space Types
  if (lower.includes("meeting") || lower.includes("conference")) {
    const meetingSpace = allSpaces.find(s => s.type === "meeting");
    if (meetingSpace) return { id: meetingSpace.id, workspaceCode: getCode(meetingSpace), name: meetingSpace.name, type: meetingSpace.type };
  }

  if (lower.includes("study") || lower.includes("desk") || lower.includes("workstation")) {
    const studySpace = allSpaces.find(s => s.type === "study");
    if (studySpace) return { id: studySpace.id, workspaceCode: getCode(studySpace), name: studySpace.name, type: studySpace.type };
  }

  if (lower.includes("seat") || lower.includes("window")) {
    const seatSpace = allSpaces.find(s => s.type === "seat");
    if (seatSpace) return { id: seatSpace.id, workspaceCode: getCode(seatSpace), name: seatSpace.name, type: seatSpace.type };
  }

  throw new Error("Selected workspace could not be identified. Please select another workspace.");
}

async function run() {
  console.log("=== TESTING WORKSPACE RESOLVER OBJECT ===");
  try {
    console.log("Window Seat 01 ->", await resolveWorkspaceObject("Window Seat 01"));
    console.log("Study Desk 01  ->", await resolveWorkspaceObject("Study Desk 01"));
    console.log("Meeting Room 01->", await resolveWorkspaceObject("Meeting Room 01"));
  } catch (err) {
    console.error("Error:", err.message);
  }
}

run();
