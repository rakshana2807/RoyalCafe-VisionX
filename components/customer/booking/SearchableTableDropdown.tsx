"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check, Utensils, Users, Heart, Baby, Shield, Armchair } from "lucide-react";

export const TABLE_OPTIONS = [
  { name: "Single Seater", desc: "Perfect for solo focus & deep work", capacity: "1 Person", icon: Users },
  { name: "2 Seater", desc: "Cozy pair table for coffee or meetings", capacity: "2 People", icon: Users },
  { name: "4 Seater", desc: "Standard dining & collaboration table", capacity: "4 People", icon: Users },
  { name: "Lounge", desc: "Comfortable sofa seating in relaxed lounge area", capacity: "Lounge", icon: Armchair },
  { name: "Private Booths (6 Seater)", desc: "Enclosed acoustic booth for team sessions", capacity: "6 People", icon: Shield },
  { name: "Booths (10 Seater)", desc: "Large private lounge for celebrations", capacity: "10 People", icon: Utensils },
  { name: "Kids Zone", desc: "Family friendly area with play access", capacity: "Family", icon: Baby },
  { name: "Elder Friendly", desc: "Accessible ground level with extra comfort", capacity: "Accessible", icon: Heart },
];

interface SearchableTableDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchableTableDropdown({
  value,
  onChange,
}: SearchableTableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = TABLE_OPTIONS.filter(
    (opt) =>
      opt.name.toLowerCase().includes(search.toLowerCase()) ||
      opt.desc.toLowerCase().includes(search.toLowerCase())
  );

  // Outside click listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === "ArrowDown") {
        setIsOpen(true);
        setFocusedIndex(0);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev + 1) % filteredOptions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev - 1 + filteredOptions.length) % filteredOptions.length);
    } else if (e.key === "Enter" && focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
      e.preventDefault();
      onChange(filteredOptions[focusedIndex].name);
      setIsOpen(false);
      setSearch("");
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const selectedOption = TABLE_OPTIONS.find((t) => t.name === value) || TABLE_OPTIONS[1];

  return (
    <div ref={dropdownRef} className="relative w-full text-left font-sans" onKeyDown={handleKeyDown}>
      <label className="block text-[10px] font-bold text-foreground/50 uppercase mb-1">
        Table Type * (Searchable)
      </label>

      {/* Dropdown Toggle Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="w-full px-3.5 py-3 rounded-[14px] border border-primary/15 bg-[#FAF6F0]/60 hover:bg-white text-[#2A1506] font-semibold text-xs flex items-center justify-between outline-none focus:border-[#EA5A0C] focus:ring-2 focus:ring-[#EA5A0C]/10 transition-all cursor-pointer shadow-xs"
      >
        <div className="flex items-center gap-2 truncate">
          <span className="h-2 w-2 rounded-full bg-[#EA5A0C]" />
          <span className="truncate">{value || "Select Table Type"}</span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-[#2A1506]/60 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-[#EA5A0C]" : ""
          }`}
        />
      </button>

      {/* Animated Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full bg-white rounded-[18px] border border-primary/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          
          {/* Search Header */}
          <div className="p-2.5 bg-[#FAF6F0] border-b border-primary/10">
            <div className="relative">
              <Search className="h-3.5 w-3.5 text-foreground/40 absolute left-3 top-3 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setFocusedIndex(0);
                }}
                placeholder="Search seating options..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-primary/15 bg-white text-[#2A1506] placeholder:text-foreground/40 outline-none focus:border-[#EA5A0C]"
              />
            </div>
          </div>

          {/* Options List */}
          <ul
            role="listbox"
            className="max-h-60 overflow-y-auto divide-y divide-primary/5 p-1 custom-scrollbar"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, idx) => {
                const isSelected = opt.name === value;
                const isFocused = idx === focusedIndex;
                const IconComponent = opt.icon;

                return (
                  <li
                    key={opt.name}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(opt.name);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    onMouseEnter={() => setFocusedIndex(idx)}
                    className={`px-3 py-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between text-xs ${
                      isSelected
                        ? "bg-[#FAF6F0] text-[#EA5A0C] font-extrabold"
                        : isFocused
                        ? "bg-[#FAF6F0]/80 text-[#2A1506]"
                        : "text-[#2A1506] hover:bg-[#FAF6F0]/50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`p-1.5 rounded-lg ${isSelected ? "bg-[#EA5A0C]/10 text-[#EA5A0C]" : "bg-primary/5 text-foreground/50"}`}>
                        <IconComponent className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold truncate">{opt.name}</p>
                        <p className="text-[10px] text-foreground/50 truncate font-normal">
                          {opt.desc}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-primary/5 text-foreground/60">
                        {opt.capacity}
                      </span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-[#EA5A0C]" />}
                    </div>
                  </li>
                );
              })
            ) : (
              <li className="px-4 py-6 text-center text-xs text-foreground/45">
                No seating matching &ldquo;{search}&rdquo;
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
