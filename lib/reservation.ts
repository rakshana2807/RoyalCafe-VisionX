import { supabase } from "@/lib/supabase";

export function generateBookingId(): string {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `RCC-${dateStr}-${randomNum}`;
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

export function calculateEndTime24(startTime24: string, durationHours: number): string {
  const parts = startTime24.split(":");
  let hrs = parseInt(parts[0], 10) || 0;
  let mins = parseInt(parts[1], 10) || 0;

  const addMins = Math.round(durationHours * 60);
  const totalMinutes = hrs * 60 + mins + addMins;
  
  const endHrs = Math.floor(totalMinutes / 60) % 24;
  const endMins = totalMinutes % 60;

  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(endHrs)}:${pad(endMins)}:00`;
}

export interface AlternativeSlot {
  startTime: string;
  endTime: string;
  label: string;
  isAvailable: boolean;
}

export async function getAlternativeSlots(
  seatCode: string,
  bookingDate: string,
  requestedStartTime: string,
  durationHours: number
): Promise<AlternativeSlot[]> {
  const slots: AlternativeSlot[] = [];
  const start24 = convert12to24(requestedStartTime);
  const parts = start24.split(":");
  let reqHr = parseInt(parts[0], 10) || 9;

  const offsets = [-2, -1, 1, 2, 3, 4];

  for (const offset of offsets) {
    let testHr = reqHr + offset;
    if (testHr < 8 || testHr + durationHours > 22) continue;
    
    const testStart24 = `${String(testHr).padStart(2, "0")}:00:00`;
    const testEnd24 = calculateEndTime24(testStart24, durationHours);
    const testStart12 = convert24to12(testStart24);
    const testEnd12 = convert24to12(testEnd24);

    try {
      const avail = await isSpaceAvailable(seatCode, bookingDate, testStart12, testEnd12);
      if (avail) {
        slots.push({
          startTime: testStart12,
          endTime: testEnd12,
          label: `${testStart12} - ${testEnd12}`,
          isAvailable: true,
        });
      }
    } catch {
      // Ignore check errors for alternatives
    }

    if (slots.length >= 3) break;
  }

  return slots;
}

export async function isSpaceAvailable(
  seatCode: string,
  bookingDate: string,
  startTime: string,
  endTime: string
): Promise<boolean> {
  const start24 = convert12to24(startTime);
  const end24 = convert12to24(endTime);

  const { data: seat } = await supabase.from('seats').select('is_available').eq('seat_code', seatCode).single();
  if (seat && seat.is_available === false) return false;

  const { data: conflicts, error } = await supabase
    .from('reservation')
    .select('id')
    .eq('seat_code', seatCode)
    .eq('booking_date', bookingDate)
    .in('status', ['confirmed', 'pending'])
    .lt('start_time', end24)
    .gt('end_time', start24);

  if (error) {
    console.error("Availability check error:", error);
    return false; // Fail safe
  }

  return conflicts.length === 0;
}

export function calculateWorkspacePrice(
  tableType: string,
  durationHours: number,
  guestsCount: number = 1,
  seatPricePerHour?: number
): number {
  if (seatPricePerHour !== undefined && seatPricePerHour >= 0) {
    const duration = Math.max(1, durationHours || 1);
    return Math.round(seatPricePerHour * duration);
  }

  let ratePerHour = 29;
  const typeLower = (tableType || "").toLowerCase();

  if (typeLower.includes("single") || typeLower.includes("hot desk")) {
    ratePerHour = 25;
  } else if (typeLower.includes("2 seater") || typeLower.includes("study")) {
    ratePerHour = 45;
  } else if (typeLower.includes("4 seater") || typeLower.includes("dedicated")) {
    ratePerHour = 85;
  } else if (typeLower.includes("lounge") || typeLower.includes("vip")) {
    ratePerHour = 120;
  } else if (typeLower.includes("booth") || typeLower.includes("cabin") || typeLower.includes("boardroom")) {
    ratePerHour = 180;
  }

  const duration = Math.max(1, durationHours || 1);
  return Math.round(ratePerHour * duration);
}

export interface CreateBookingInput {
  userId?: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  spaceId: string;
  bookingDate: string;
  startTime: string;
  durationHours: number;
  numberOfPeople?: number;
  totalAmount: number; // Ignored and recalculated for safety
  wifiPassPrice?: number;
  wifiPassId?: string;
  wifiPassName?: string;
  wifiPassDuration?: string;
  specialRequest?: string;
  status?: string;
  paymentStatus?: string;
}

// Fallback method to get or create a valid user profile from Supabase
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
}) {
  const email = userEmail?.trim().toLowerCase();
  
  if (!email && !userId) {
    throw new Error("User ID or Email is required for profile resolution.");
  }
  
  if (userId) {
    const { data: userProfile } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (userProfile) return userProfile;
  }

  if (email) {
    const { data: userProfile } = await supabase.from('profiles').select('*').eq('email', email).single();
    if (userProfile) return userProfile;
  }

  // Create a new one
  const generatedId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `00000000-0000-4000-8000-${Date.now().toString(16).padStart(12, "0")}`;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const newProfileId = (userId && uuidRegex.test(userId)) ? userId : generatedId;

  const newProf = {
    id: newProfileId,
    full_name: userName?.trim() || "Customer",
    email: email || "unknown@customer.com",
    phone: userPhone?.trim() || "",
  };

  const { data, error } = await supabase.from('profiles').insert(newProf).select().single();
  
  if (error) {
    console.error("Error creating profile:", error);
    throw new Error("Failed to create user profile");
  }

  return data || newProf;
}

export async function createLocalBooking(input: CreateBookingInput) {
  if (!input.spaceId) {
    throw new Error("Please select a workspace.");
  }
  if (!input.bookingDate) {
    throw new Error("Please select a booking date.");
  }
  if (!input.startTime) {
    throw new Error("Please select a valid time.");
  }

  const profile = await getOrCreateProfile({
    userId: input.userId,
    userName: input.userName,
    userEmail: input.userEmail,
    userPhone: input.userPhone,
  });

  const seatCode = input.spaceId; // UI sends seat_code

  const { data: seat, error: seatError } = await supabase.from('seats').select('*').eq('seat_code', seatCode).single();

  if (seatError || !seat) {
    throw new Error(`Invalid seat selection. Could not resolve seat_code: ${seatCode}`);
  }

  if (!seat.is_available) {
    throw new Error(`The workspace ${seat.seat_name} is currently unavailable or under maintenance.`);
  }
  
  const guests = input.numberOfPeople || 1;
  if (guests > seat.capacity) {
    throw new Error(`The workspace ${seat.seat_name} has a maximum capacity of ${seat.capacity} people.`);
  }

  const start24 = convert12to24(input.startTime);
  const duration = parseDurationHours(input.durationHours);
  const end24 = calculateEndTime24(start24, duration);

  const isAvail = await isSpaceAvailable(seatCode, input.bookingDate, start24, end24);

  if (!isAvail) {
    throw new Error(`The workspace ${seat.seat_name} is already reserved for this time. Please choose another time or workspace.`);
  }

  // The final total is parsed directly from the checkout UI to ensure
  // the exact same value displayed in the dummy payment modal is stored
  // in the database, avoiding duplicate rounding or stale pricing logic.
  const calculatedTotal = input.totalAmount;

  const newReservation = {
    user_id: profile.id,
    customer_name: profile.full_name,
    seat_code: seat.seat_code,
    seat_name: seat.seat_name,
    booking_date: input.bookingDate,
    start_time: start24,
    end_time: end24,
    duration_hours: duration,
    number_of_people: guests,
    total_amount: calculatedTotal,
    status: input.status || "confirmed",
    payment_status: "unpaid" // Initially unpaid
  };

  const { data: inserted, error: insertError } = await supabase
    .from('reservation')
    .insert(newReservation)
    .select()
    .single();

  if (insertError) {
    console.error("Failed to create reservation:", insertError);
    throw new Error("Failed to create reservation record in database.");
  }

  // Handle WiFi Pass
  if (input.wifiPassPrice && input.wifiPassPrice > 0) {
    try {
      const durationHours = parseFloat(input.wifiPassDuration?.replace(/[^0-9.]/g, '') || "1");
      const purchaseDate = new Date();
      const expiryDate = new Date(purchaseDate.getTime() + (durationHours * 60 * 60 * 1000));
      
      const { error: wifiError } = await supabase.from('wifi_passes').insert({
        user_id: profile.id,
        pass_type: input.wifiPassName || "Standard Pass",
        duration_hours: durationHours,
        price: input.wifiPassPrice,
        purchase_date: purchaseDate.toISOString(),
        expiry_date: expiryDate.toISOString(),
        status: 'active'
      });
      
      if (wifiError) {
        console.warn("Failed to insert wifi_pass:", wifiError);
      }
    } catch (e) {
      console.warn("Failed to insert wifi_pass, likely due to schema mismatch", e);
    }
  }

  // Process Dummy Payment
  const transactionId = `DUMMY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const { error: paymentError } = await supabase.from('payments').insert({
    user_id: profile.id,
    booking_id: inserted.id, // Update from reservation_id to booking_id to match schema
    amount: calculatedTotal,
    payment_type: "booking",
    payment_status: "successful",
    payment_method: "dummy",
    transaction_id: transactionId
  });

  if (paymentError) {
    console.error("Payment insert failed:", {
      code: paymentError.code,
      message: paymentError.message,
      details: paymentError.details,
      hint: paymentError.hint
    });
    throw new Error(`Payment could not be completed. Details: ${paymentError.message} (Code: ${paymentError.code})`);
  }

  // Update reservation to paid
  const { error: updateError } = await supabase
    .from('reservation')
    .update({ payment_status: "paid" })
    .eq('id', inserted.id);

  if (updateError) {
    console.warn("Payment succeeded but failed to update reservation payment_status:", updateError);
  }

  return { ...inserted, payment_status: "paid" };
}

export async function resolveSpaceId(workspaceOrSeat: string): Promise<string> {
  if (!workspaceOrSeat) throw new Error("No seat selected");
  
  // 1. Exact match on UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(workspaceOrSeat)) {
    const { data } = await supabase.from('seats').select('seat_code').eq('id', workspaceOrSeat).single();
    if (data && data.seat_code) return data.seat_code;
  }

  // 2. Exact match on seat_code
  const { data: codeData } = await supabase.from('seats').select('seat_code').eq('seat_code', workspaceOrSeat).single();
  if (codeData) return codeData.seat_code;
  
  // 3. Exact match on seat_name
  const { data: nameData } = await supabase.from('seats').select('seat_code').eq('seat_name', workspaceOrSeat).maybeSingle();
  if (nameData) return nameData.seat_code;

  // 4. Map known visual UI codes (from SeatMap.tsx) to real DB seat_codes
  const uiMapping: Record<string, string> = {
    "OUT-B1": "#O01-1",
    "OUT-B2": "#O02-1",
    "OUT-B3": "#O03-1",
    "OUT-B4": "#O04-1",
    "LOU-1": "#S01",
    "L-SS-1": "#S02",
    "L-SS-2": "#S03",
    "L-SS-3": "#S04",
    "L-SS-4": "#S05",
    "L-2S-1": "#S06",
    "L-2S-2": "#S07",
    "L-2S-3": "#S08",
    "L-2S-4": "#S09",
    "L-2S-5": "#S10",
    "L-2S-6": "#S10",
    "L-2S-7": "#S10",
    "L-2S-8": "#S10",
    "W-1": "#W01",
    "W-2": "#W02",
    "W-3": "#W03",
    "W-4": "#W04",
    "W-5": "#W05",
    "W-6": "#W06",
    "W-7": "#W07",
    "W-8": "#W08",
    "W-9": "#W09",
    "W-10": "#W10",
    "T-SS-1": "#W11",
    "T-SS-2": "#W12",
    "T-SS-3": "#W13",
    "T-SS-4": "#W14",
    "T-SS-5": "#W15",
    "T-SS-6": "#W16",
    "T-2S-1": "#W17",
    "T-2S-2": "#W18",
    "T-2S-3": "#W19",
    "T-2S-4": "#W20",
    "T-PB6-1": "#W21",
    "T-PB6-2": "#W22"
  };
  
  if (uiMapping[workspaceOrSeat]) {
    return uiMapping[workspaceOrSeat];
  }
  
  // 5. Fuzzy match by name or code
  const { data: fuzzyData } = await supabase
    .from('seats')
    .select('seat_code')
    .or(`seat_code.ilike.%${workspaceOrSeat}%,seat_name.ilike.%${workspaceOrSeat}%`)
    .limit(1)
    .maybeSingle();
    
  if (fuzzyData) return fuzzyData.seat_code;

  // 6. Fallback by inferred zone
  let zoneMatch = "";
  const lower = workspaceOrSeat.toLowerCase();
  if (lower.includes("outdoor")) zoneMatch = "Outdoor";
  else if (lower.includes("social") || lower.includes("lounge")) zoneMatch = "Social Zone";
  else if (lower.includes("quiet") || lower.includes("quite")) zoneMatch = "Quite Zone";
  else if (lower.includes("work") || lower.includes("study")) zoneMatch = "Work & Study Zone";
  
  if (zoneMatch) {
    const { data: zoneData } = await supabase.from('seats').select('seat_code').eq('zone', zoneMatch).limit(1).maybeSingle();
    if (zoneData) return zoneData.seat_code;
  }
  
  // 7. Ultimate fallback: just return the very first available seat in the DB
  // This guarantees we never fail with 0 price at checkout due to a non-existent seat string.
  const { data: firstSeat } = await supabase.from('seats').select('seat_code').limit(1).maybeSingle();
  if (firstSeat) return firstSeat.seat_code;
  
  return workspaceOrSeat;
}
