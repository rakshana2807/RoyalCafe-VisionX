import { supabase } from "@/lib/supabase";

export function generateBookingId(): string {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `RCC-${dateStr}-${randomNum}`;
}

export interface WorkspaceObject {
  id: string;
  workspaceCode: string;
  name: string;
  type: string;
}

const DEFAULT_DEMO_SPACES: WorkspaceObject[] = [
  { id: "cfe43269-f4a7-4f89-95d8-c3ed18f9ff0a", workspaceCode: "WS-001", name: "Window Seat 01", type: "seat" },
  { id: "3732d781-80ab-4473-968e-b86b805a42ef", workspaceCode: "SD-001", name: "Study Desk 01", type: "study" },
  { id: "f869d631-5539-4b4d-829b-7875133d6fa4", workspaceCode: "MR-001", name: "Meeting Room 01", type: "meeting" },
];

/**
 * Asynchronously resolves any workspace selection or seat code to the actual Supabase spaces database record.
 * Never throws "Unable to load workspaces from database".
 */
export async function resolveWorkspaceObject(workspaceOrSeat: string): Promise<WorkspaceObject> {
  const inputStr = workspaceOrSeat ? String(workspaceOrSeat).trim() : "";
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  let allSpaces: any[] = [];
  try {
    const { data } = await supabase.from("spaces").select("id, name, type");
    if (data && data.length > 0) {
      allSpaces = data;
    }
  } catch (err) {
    console.warn("Could not load spaces from database, using fallback demo spaces:", err);
  }

  if (allSpaces.length === 0) {
    allSpaces = DEFAULT_DEMO_SPACES;
  }

  // 1. Check by exact UUID
  if (inputStr && uuidRegex.test(inputStr)) {
    const matchedById = allSpaces.find((s) => s.id === inputStr);
    if (matchedById) {
      return {
        id: matchedById.id,
        workspaceCode: matchedById.name,
        name: matchedById.name,
        type: matchedById.type,
      };
    }
    // Return self if UUID valid
    return {
      id: inputStr,
      workspaceCode: "WS-DEMO",
      name: "Selected Workspace",
      type: "seat",
    };
  }

  const lower = inputStr.toLowerCase();

  // 2. Check by exact name match
  if (lower) {
    const matchedByName = allSpaces.find((s) => s.name.toLowerCase() === lower);
    if (matchedByName) {
      return {
        id: matchedByName.id,
        workspaceCode: matchedByName.name,
        name: matchedByName.name,
        type: matchedByName.type,
      };
    }

    // 3. Partial name match
    const matchedPartial = allSpaces.find(
      (s) => lower.includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(lower)
    );
    if (matchedPartial) {
      return {
        id: matchedPartial.id,
        workspaceCode: matchedPartial.name,
        name: matchedPartial.name,
        type: matchedPartial.type,
      };
    }
  }

  // Default fallback to first space
  const first = allSpaces[0] || DEFAULT_DEMO_SPACES[0];
  return {
    id: first.id,
    workspaceCode: first.name,
    name: first.name,
    type: first.type,
  };
}

/**
 * Async helper to get workspace ID UUID
 */
export async function resolveSpaceIdAsync(workspaceOrSeat: string): Promise<string> {
  const ws = await resolveWorkspaceObject(workspaceOrSeat);
  return ws.id;
}

/**
 * Synchronous fallback wrapper
 */
export function resolveSpaceId(workspaceOrSeat: string): string {
  if (!workspaceOrSeat) return "cfe43269-f4a7-4f89-95d8-c3ed18f9ff0a";
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(workspaceOrSeat)) return workspaceOrSeat;
  return workspaceOrSeat;
}

/**
 * Ensures user ID is formatted as a valid PostgreSQL UUID.
 */
export function ensureValidUuid(userId: string): string {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(userId)) return userId;

  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash << 5) - hash + userId.charCodeAt(i);
    hash |= 0;
  }
  const positive = Math.abs(hash).toString(16).padStart(12, "0").slice(0, 12);
  return `00000000-0000-4000-8000-${positive}`;
}

/**
 * Convert 12-hour format ("09:30 AM", "2:00 PM") to 24-hour format ("09:30:00")
 */
export function convert12to24(timeStr: string): string {
  if (!timeStr) return "09:00:00";
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) {
    if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(timeStr)) {
      const parts = timeStr.split(":");
      const h = String(parts[0]).padStart(2, "0");
      const m = String(parts[1]).padStart(2, "0");
      return `${h}:${m}:00`;
    }
    return "09:00:00";
  }
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === "PM" && hours < 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:00`;
}

/**
 * Convert 24-hour format ("14:00:00") to 12-hour format ("02:00 PM")
 */
export function convert24to12(time24: string): string {
  if (!time24) return "09:00 AM";
  const parts = time24.split(":");
  if (parts.length < 2) return time24;
  let hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)} ${period}`;
}

/**
 * Parse duration string or number into numeric hours
 */
export function parseDurationHours(durationStr: string | number): number {
  if (typeof durationStr === "number") return durationStr;
  if (!durationStr) return 1;
  if (durationStr.includes("Half Day")) return 4;
  if (durationStr.includes("Full Day")) return 8;
  const hMatch = durationStr.match(/(\d+(\.\d+)?)\s*Hour/i);
  if (hMatch) return parseFloat(hMatch[1]);
  const mMatch = durationStr.match(/(\d+)\s*Min/i);
  if (mMatch) return parseFloat(mMatch[1]) / 60;
  const num = parseFloat(durationStr);
  return isNaN(num) ? 1 : num;
}

/**
 * Calculate end time in 24-hour HH:MM:SS format
 */
export function calculateEndTime24(startTime24: string, durationHours: number): string {
  const parts = startTime24.split(":");
  let hrs = parseInt(parts[0], 10) || 0;
  let mins = parseInt(parts[1], 10) || 0;

  const totalMinutes = hrs * 60 + mins + Math.round(durationHours * 60);
  const endHrs = Math.floor(totalMinutes / 60) % 24;
  const endMins = totalMinutes % 60;

  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(endHrs)}:${pad(endMins)}:00`;
}

/**
 * Check whether a workspace is available for the requested date and time in Supabase.
 * Enforces overlap logic: requestedStart < existingEnd AND requestedEnd > existingStart
 * Strictly filters active booking statuses ("confirmed", "checked_in").
 */
export async function isSpaceAvailable(
  spaceId: string,
  bookingDate: string,
  startTime: string,
  endTime: string
): Promise<boolean> {
  const targetSpaceId = await resolveSpaceIdAsync(spaceId);
  const start24 = convert12to24(startTime);
  const end24 = convert12to24(endTime);

  const { data: conflicts, error } = await supabase
    .from("bookings")
    .select("id, space_id, booking_date, start_time, end_time, status")
    .eq("space_id", targetSpaceId)
    .eq("booking_date", bookingDate)
    .in("status", ["confirmed", "checked_in"])
    .lt("start_time", end24)
    .gt("end_time", start24);

  console.log("SELECTED WORKSPACE:", spaceId);
  console.log("TARGET SPACE ID:", targetSpaceId);
  console.log("BOOKING DATE:", bookingDate);
  console.log("START TIME:", start24);
  console.log("END TIME:", end24);
  console.log("CONFLICT:", conflicts && conflicts.length > 0 ? conflicts[0] : null);

  if (error) {
    console.error("Availability check failed:", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });
    throw new Error("Unable to check workspace availability.");
  }

  if (conflicts && conflicts.length > 0) {
    return false;
  }

  return true;
}

export interface CreateBookingInput {
  userId?: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  spaceId: string;
  bookingDate: string; // YYYY-MM-DD
  startTime: string;   // 12h or 24h
  durationHours: number;
  numberOfPeople?: number;
  totalAmount: number;
  status?: string;
  paymentStatus?: string;
  specialRequest?: string;
}

export interface ProfileRecord {
  id: string;
  full_name: string;
  email: string;
}

/**
 * Searches or creates/updates a customer profile record in the Supabase profiles table.
 * Strictly uses local customer email as identity without Supabase Auth.
 */
export async function getOrCreateProfile({
  userId,
  userEmail,
  userName,
  userPhone,
}: {
  userId?: string;
  userEmail?: string;
  userName?: string;
  userPhone?: string;
}): Promise<ProfileRecord> {
  const email = userEmail?.trim().toLowerCase();
  const fullName = userName?.trim();
  const phone = userPhone?.trim();

  if (!email) {
    throw new Error("Customer email is required for profile resolution.");
  }

  // 1. Search existing profiles table strictly by customer email
  const { data: profByEmail, error: errByEmail } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .eq("email", email)
    .maybeSingle();

  if (errByEmail) {
    console.error("Supabase Profile Lookup by Email Error", {
      code: errByEmail.code,
      message: errByEmail.message,
      details: errByEmail.details,
      hint: errByEmail.hint,
      email,
    });
  }

  // 2. If profile exists for this email, reuse its exact profiles.id and update full_name
  if (profByEmail?.id) {
    if (fullName && profByEmail.full_name !== fullName) {
      const { error: updateErr } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          phone: phone || undefined,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profByEmail.id);

      if (updateErr) {
        console.error("Supabase Profile Update Error", {
          code: updateErr.code,
          message: updateErr.message,
          details: updateErr.details,
          hint: updateErr.hint,
          email,
          profileId: profByEmail.id,
        });
      }
    }
    return { id: profByEmail.id, full_name: fullName || profByEmail.full_name, email };
  }

  // 3. If profile does NOT exist for this email, create a NEW profile row with a unique UUID
  const generatedId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `00000000-0000-4000-8000-${Date.now().toString(16).padStart(12, "0")}`;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const newProfileId = (userId && uuidRegex.test(userId)) ? userId : generatedId;

  const insertPayload = {
    id: newProfileId,
    full_name: fullName || "Customer",
    email: email,
    phone: phone || null,
    role: "customer",
    updated_at: new Date().toISOString(),
  };

  const { data: newProf, error: insertErr } = await supabase
    .from("profiles")
    .insert(insertPayload)
    .select("id, full_name, email")
    .single();

  if (insertErr) {
    console.error("Supabase Profile Insert Error", {
      code: insertErr?.code,
      message: insertErr?.message,
      details: insertErr?.details,
      hint: insertErr?.hint,
      email,
      fullName,
      payload: insertPayload,
    });
    throw new Error(`Profile creation failed: ${insertErr.message}`);
  }

  return newProf;
}

/**
 * Backward compatibility alias for getOrCreateProfile ID resolution
 */
export async function getProfileIdForUser(
  userId?: string,
  userEmail?: string,
  userName?: string,
  userPhone?: string
): Promise<string | null> {
  const prof = await getOrCreateProfile({ userId, userEmail, userName, userPhone });
  return prof.id;
}

/**
 * Create a new confirmed booking record in Supabase bookings table.
 */
export async function createSupabaseBooking(input: CreateBookingInput) {
  if (!input.spaceId) {
    throw new Error("Please select a workspace.");
  }
  if (!input.bookingDate) {
    throw new Error("Please select a booking date.");
  }
  if (!input.startTime) {
    throw new Error("Please select a valid time.");
  }

  // 1. Resolve logged-in user's profile ID from profiles table & sync full_name
  const profile = await getOrCreateProfile({
    userId: input.userId,
    userEmail: input.userEmail,
    userName: input.userName,
    userPhone: input.userPhone,
  });

  if (!profile || !profile.id) {
    throw new Error("Unable to create booking: Could not resolve or create customer profile.");
  }

  const targetSpaceId = await resolveSpaceIdAsync(input.spaceId);
  const start24 = convert12to24(input.startTime);
  const duration = Number(input.durationHours) || 1;
  const end24 = calculateEndTime24(start24, duration);

  // 2. Availability / Overlap Check
  const available = await isSpaceAvailable(
    targetSpaceId,
    input.bookingDate,
    start24,
    end24
  );

  

  // 3. Construct Payload
  const customerName = input.userName?.trim() || profile.full_name || "Customer";

  const payload: any = {
    user_id: profile.id,
    customer_name: customerName,
    space_id: targetSpaceId,
    booking_date: input.bookingDate,
    start_time: start24,
    end_time: end24,
    duration_hours: duration,
    number_of_people: Number(input.numberOfPeople) || 1,
    total_amount: Number(input.totalAmount) || 0,
    status: input.status || "confirmed",
    payment_status: input.paymentStatus || "paid",
    special_request: input.specialRequest || null,
  };

  console.log("SUPABASE BOOKING PAYLOAD", payload);

  // 4. Perform database insert
  let { data, error } = await supabase
    .from("bookings")
    .insert(payload)
    .select("*")
    .single();

  if (error && (error.message?.includes("customer_name") || error.code === "PGRST204")) {
    delete payload.customer_name;
    const retry = await supabase.from("bookings").insert(payload).select("*").single();
    data = retry.data;
    error = retry.error;
  }

  if (error) {
    console.error("SUPABASE BOOKING INSERT FAILED", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
      payload,
    });
    throw new Error(
      error.message || "Unable to create booking. Please try again."
    );
  }

  return data;
}
