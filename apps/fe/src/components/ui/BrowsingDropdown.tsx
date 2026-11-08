"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, LogOut, User } from "lucide-react";
import { useBrowserStore, UserPersona } from "@/src/store/UserStore";

export default function BrowsingDropdown() {
  const currentUser = useBrowserStore((state) => state.currentUser);
  const setCurrentUser = useBrowserStore((state) => state.setCurrentUser);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex items-center gap-1.5 font-sans pl-2">
      <span className="text-xs font-medium text-zinc-400 select-none">
        Browsing as:
      </span>

      {/* Styled Dropdown Head Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs font-semibold text-zinc-800 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 transition-all focus:outline-none shadow-sm"
      >
        <span className="truncate max-w-[110px]">
          {currentUser?.name || "Select Persona"}
        </span>
        <ChevronDown
          size={14}
          className={`text-zinc-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Interactive Dropdown Flyout Panel overlay grid */}
      {isOpen && (
        <>
          {/* Backdrop screen shield to close menu gracefully when clicking outside */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute left-2 top-full mt-1.5 w-44 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg py-1 z-20 animate-in fade-in slide-in-from-top-1 duration-150">
            {/* Logout/Exit Identity Return action link */}
            <button
              onClick={() => {
                setCurrentUser(null);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-left font-semibold rounded-b-xl"
            >
              <LogOut size={12} />
              <span>Change Identity</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
