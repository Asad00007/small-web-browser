"use client";

import React, { useState, useEffect } from "react";
import { Terminal, RefreshCw, AlertCircle } from "lucide-react";

export default function WelcomeSetup({
  onSetupComplete,
}: {
  onSetupComplete: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to ping your API and check if seed data exists
  const checkDatabase = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Replace with your actual user or site verification endpoint
      const res = await fetch("http://localhost:3001/api/users");
      const data = await res.json();

      if (data && data.length > 0) {
        onSetupComplete(); // Let parent layout know we can boot the app
      } else {
        setError("Database is still empty. Did you run the command?");
      }
    } catch (err) {
      setError("Could not connect to the backend server.");
    } finally {
      setIsLoading(false);
    }
  };

  // Check once immediately on load
  useEffect(() => {
    checkDatabase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4 font-sans selection:bg-zinc-900 selection:text-zinc-50">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm p-6 space-y-6">
        {/* Header */}
        <div className="space-y-1.5">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
            <Terminal size={18} />
          </div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">
            The Small Web
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Welcome! Before you can browse or search the ecosystem, you need to
            populate your environment.
          </p>
        </div>

        {/* Step Box */}
        <div className="rounded-lg bg-zinc-900 p-4 font-mono text-xs text-zinc-50 space-y-2 dark:bg-zinc-950">
          <div className="text-zinc-500">
            {/* // 1. Run the deterministic seed script */}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">$</span>
            <code className="select-all">npm run seed</code>
          </div>
        </div>

        {/* Dynamic State Alert */}
        {error && (
          <div className="flex items-start gap-2.5 rounded-lg border border-red-200/40 bg-red-50/50 p-3 text-sm text-red-600 dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <p className="leading-normal">{error}</p>
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={checkDatabase}
          disabled={isLoading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 disabled:opacity-50 bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90 h-10 px-4 shadow dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90"
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          {isLoading ? "Verifying..." : "Verify & Launch Browser"}
        </button>
      </div>
    </div>
  );
}
