"use client";

import React, { useState, useEffect } from "react";
import { Users, Search, Trash2, Ban, Wifi, CheckCircle2, ShieldCheck, Mail, Phone, Calendar } from "lucide-react";

interface Customer {
  _id: string;
  fullName: string;
  email: string;
  mobile?: string;
  role: string;
  createdAt?: string;
  status?: "active" | "suspended" | "blocked";
  visitsCount?: number;
  totalSpent?: number;
  lastVisit?: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const INITIAL_CUSTOMERS: Customer[] = [
    { _id: "cust-1", fullName: "Aarav Sharma", email: "aarav@gmail.com", mobile: "+91 98765 43210", role: "customer", visitsCount: 14, totalSpent: 4250, lastVisit: "06/08/2026", status: "active" },
    { _id: "cust-2", fullName: "Neha Gupta", email: "neha@gmail.com", mobile: "+91 98123 45678", role: "customer", visitsCount: 8, totalSpent: 2890, lastVisit: "06/08/2026", status: "active" },
    { _id: "cust-3", fullName: "Devansh Roy", email: "devansh@gmail.com", mobile: "+91 97654 32109", role: "customer", visitsCount: 22, totalSpent: 7800, lastVisit: "04/08/2026", status: "active" },
    { _id: "cust-4", fullName: "Priya Patel", email: "priya@gmail.com", mobile: "+91 96543 21098", role: "customer", visitsCount: 5, totalSpent: 1450, lastVisit: "01/08/2026", status: "active" },
  ];

  const fetchCustomers = () => {
    setIsLoading(true);
    setCustomers(INITIAL_CUSTOMERS);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleAction = (id: string, action: string) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c._id === id) {
          if (action === "block") return { ...c, status: "blocked" };
          if (action === "unblock") return { ...c, status: "active" };
        }
        return c;
      })
    );
    setSelectedCustomer(null);
  };

  const filtered = customers.filter(
    (c) =>
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.mobile && c.mobile.includes(search))
  );

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-serif text-[#2A1506] dark:text-amber-100 tracking-tight">
            Customer Directory &amp; User Profiles
          </h1>
          <p className="text-xs text-foreground/60 dark:text-amber-200/60 font-sans">
            Manage registered accounts, view booking history, suspend accounts &amp; grant WiFi passes
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white dark:bg-[#1C120C] p-4 rounded-3xl border border-primary/10 flex gap-4 items-center shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
          <input
            type="text"
            placeholder="Search by Name, Email, or Mobile Number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-primary/15 text-xs bg-[#FAF6F0] dark:bg-[#2A1D16] text-primary dark:text-amber-100 focus:outline-none focus:border-[#EA5A0C]"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white dark:bg-[#1C120C] rounded-3xl border border-primary/10 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF6F0] dark:bg-[#2A1D16] border-b border-primary/10 text-primary dark:text-amber-200 font-extrabold uppercase tracking-wider">
              <tr>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Mobile Number</th>
                <th className="p-4">Role</th>
                <th className="p-4">Account Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {filtered.length > 0 ? (
                filtered.map((c) => (
                  <tr key={c._id} className="hover:bg-[#FAF6F0]/50 dark:hover:bg-[#2A1D16]/50 transition-colors">
                    <td className="p-4 font-bold text-primary dark:text-amber-100 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient from-[#EA5A0C] to-[#D06B1C] text-white flex items-center justify-center font-bold text-xs">
                        {c.fullName.substring(0, 2).toUpperCase()}
                      </div>
                      <span>{c.fullName}</span>
                    </td>
                    <td className="p-4 text-foreground/80">{c.email}</td>
                    <td className="p-4 font-mono font-semibold">{c.mobile || "N/A"}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-900">
                        {c.role || "customer"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          c.status === "suspended" ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {c.status || "active"}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1">
                      <button
                        onClick={() => setSelectedCustomer(c)}
                        className="px-3 py-1.5 rounded-xl bg-[#2A1506] text-white font-bold text-xs hover:bg-[#EA5A0C] transition-colors cursor-pointer"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => handleAction(c._id, "grant_wifi")}
                        className="p-1.5 rounded-xl bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors cursor-pointer"
                        title="Grant Complimentary WiFi Pass"
                      >
                        <Wifi className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleAction(c._id, "suspend")}
                        className="p-1.5 rounded-xl bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors cursor-pointer"
                        title="Suspend Account"
                      >
                        <Ban className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleAction(c._id, "delete")}
                        className="p-1.5 rounded-xl bg-rose-100 text-rose-700 hover:bg-rose-200 transition-colors cursor-pointer"
                        title="Delete Account"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-foreground/50">
                    No customers found matching search query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1C120C] p-6 sm:p-8 rounded-3xl max-w-lg w-full space-y-6 shadow-2xl border border-primary/20">
            <div className="flex items-center justify-between border-b border-primary/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient from-[#EA5A0C] to-[#D06B1C] text-white font-bold flex items-center justify-center text-lg">
                  {selectedCustomer.fullName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold font-serif text-primary dark:text-amber-100">{selectedCustomer.fullName}</h3>
                  <span className="text-xs text-foreground/50">{selectedCustomer.email}</span>
                </div>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="p-2 rounded-2xl bg-primary/5 cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-primary/5">
                <span className="text-foreground/50 font-bold">Mobile</span>
                <span className="font-mono font-bold">{selectedCustomer.mobile || "N/A"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-primary/5">
                <span className="text-foreground/50 font-bold">Role</span>
                <span className="font-bold uppercase text-accent">{selectedCustomer.role || "customer"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-primary/5">
                <span className="text-foreground/50 font-bold">Joined</span>
                <span>{selectedCustomer.createdAt ? new Date(selectedCustomer.createdAt).toLocaleDateString() : "Recently"}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => handleAction(selectedCustomer._id, "grant_wifi")}
                className="w-full py-3 rounded-2xl bg-gradient from-emerald-600 to-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Wifi className="h-4 w-4" />
                <span>Grant Complimentary VIP WiFi Pass</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
