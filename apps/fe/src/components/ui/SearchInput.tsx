"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, History, Home as HomeIcon } from "lucide-react";
import { useBrowserStore } from "@/src/store/UserStore";

export default function SearchInput() {
  const {
    view,
    currentUrl,
    historyStack,
    forwardStack,
    navigateTo,
    performSearch,
    goBack,
    goForward,
    setViewState,
  } = useBrowserStore();

  const [inputVal, setInputVal] = useState(currentUrl);

  // Keep the input text synchronized if navigation updates state programmatically
  useEffect(() => {
    setInputVal(currentUrl);
  }, [currentUrl]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const query = inputVal.trim();
      if (!query) return;

      // This regular expression rule correctly detects if input mimics a typical address bar pattern
      if (
        query.startsWith("smallweb://") ||
        query.includes(".") ||
        query.includes("-")
      ) {
        navigateTo(query); // Jumps directly inside the Iframe page without rendering links list layout
      } else {
        performSearch(query); // Pops open the full-text matching search view feed
      }
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 border border-zinc-200 dark:border-zinc-800 rounded-full px-4 py-1.5 bg-white dark:bg-zinc-900 shadow-sm w-full mb-5 mx-auto font-sans">
      {/* LEFT SECTION: Mechanical Navigation Array */}
      <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
        <button
          onClick={goBack}
          disabled={historyStack.length === 0}
          className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors disabled:opacity-30 disabled:pointer-events-none"
          title="Go back"
        >
          <ArrowLeft size={16} />
        </button>
        <button
          onClick={goForward}
          disabled={forwardStack.length === 0}
          className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors disabled:opacity-30 disabled:pointer-events-none"
          title="Go forward"
        >
          <ArrowRight size={16} />
        </button>
        <button
          onClick={() => setViewState("newtab")}
          className={`p-1.5 rounded-full transition-colors ${view === "newtab" ? "bg-zinc-100 text-zinc-900" : "hover:bg-zinc-100"}`}
          title="Home New Tab"
        >
          <HomeIcon size={16} />
        </button>
        <button
          onClick={() => setViewState("history")}
          className={`p-1.5 rounded-full transition-colors ${view === "history" ? "bg-zinc-100 text-zinc-900" : "hover:bg-zinc-100"}`}
          title="View history logs"
        >
          <History size={16} />
        </button>
      </div>

      {/* MIDDLE SECTION: Intelligent Address Bar */}
      <div className="flex-1 min-w-0">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type an address (e.g., smallweb://retro-forge.home) or search terms..."
          className="w-full bg-transparent border-none outline-none text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 text-sm py-1 select-all"
        />
      </div>
    </div>
  );
}
