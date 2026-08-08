"use client";

import React, { useRef } from "react";
import { Clock } from "lucide-react";

interface NativeTimePickerProps {
  value: string; // 12-hour formatted string e.g. "09:30 AM" or "02:15 PM"
  onChange: (formatted12h: string) => void;
}

// Convert "09:30 AM" -> "09:30" or "02:15 PM" -> "14:15"
function convert12To24(time12: string): string {
  if (!time12) return "";
  const cleaned = time12.trim();
  if (!cleaned.includes("AM") && !cleaned.includes("PM")) {
    return cleaned; // assume already 24h format
  }
  const [timePart, period] = cleaned.split(" ");
  if (!timePart) return "";
  const parts = timePart.split(":");
  let h = parseInt(parts[0], 10);
  const mStr = parts[1] || "00";
  if (isNaN(h)) return "";
  if (period === "PM" && h < 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  const hh = h < 10 ? `0${h}` : `${h}`;
  return `${hh}:${mStr}`;
}

// Convert "14:15" -> "02:15 PM" or "09:30" -> "09:30 AM"
function convert24To12(time24: string): string {
  if (!time24) return "";
  if (time24.includes("AM") || time24.includes("PM")) return time24;
  const parts = time24.split(":");
  let h = parseInt(parts[0], 10);
  const mStr = parts[1] || "00";
  if (isNaN(h)) return time24;
  const period = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  const hh = h < 10 ? `0${h}` : `${h}`;
  return `${hh}:${mStr} ${period}`;
}

export default function NativeTimePicker({ value, onChange }: NativeTimePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const time24Value = convert12To24(value);

  const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value; // e.g. "14:15"
    if (!rawVal) {
      onChange("");
      return;
    }
    const formatted12h = convert24To12(rawVal); // e.g. "02:15 PM"
    onChange(formatted12h);
  };

  const triggerPicker = () => {
    if (inputRef.current) {
      if (typeof inputRef.current.showPicker === "function") {
        try {
          inputRef.current.showPicker();
        } catch {
          inputRef.current.focus();
        }
      } else {
        inputRef.current.focus();
      }
    }
  };

  return (
    <div className="relative font-sans text-left">
      <label className="block text-[10px] font-bold text-foreground/50 uppercase mb-1">
        Arrival Time * (Native Time Picker)
      </label>

      <div
        className="relative group cursor-pointer flex items-center"
        onClick={triggerPicker}
      >
        {/* Native time input */}
        <input
          ref={inputRef}
          type="time"
          required
          value={time24Value}
          onChange={handleNativeChange}
          className="w-full pl-3.5 pr-10 py-3 rounded-[14px] border border-primary/15 text-xs bg-[#FAF6F0]/60 hover:bg-white focus:bg-white text-[#2A1506] font-semibold outline-none focus:border-[#EA5A0C] focus:ring-2 focus:ring-[#EA5A0C]/10 transition-all cursor-pointer shadow-xs [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
        />

        {/* 12-Hour Formatted Display Tag (e.g. 09:30 AM) */}
        {value && (
          <div className="absolute left-3 pointer-events-none flex items-center gap-1.5 bg-[#FAF6F0] px-2 py-0.5 rounded-lg border border-primary/10 shadow-2xs">
            <span className="text-xs font-extrabold text-[#EA5A0C]">
              {value}
            </span>
          </div>
        )}

        {/* Clock icon aligned on the right */}
        <Clock
          onClick={(e) => {
            e.stopPropagation();
            triggerPicker();
          }}
          className="h-4 w-4 text-[#EA5A0C] absolute right-3.5 top-3.5 cursor-pointer hover:scale-110 active:scale-95 transition-transform"
        />
      </div>
    </div>
  );
}
