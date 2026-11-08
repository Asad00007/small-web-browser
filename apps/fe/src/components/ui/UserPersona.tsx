"use client";

import React, { useState, useEffect } from "react";
import { User, ArrowRight, ShieldAlert } from "lucide-react";

interface UserPersona {
  _id: string;
  name: string;
}

export default function PersonaSelector({
  onUserSelected,
}: {
  onUserSelected: (user: UserPersona) => void;
}) {
  const [users, setUsers] = useState<UserPersona[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch your seeded users on load
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error("Failed to load users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError("Could not retrieve system personas.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4 font-sans selection:bg-zinc-900 selection:text-zinc-50">
      <div className="w-full max-w-md space-y-6">
        {/* Context Header */}
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Who is browsing?
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Select a profile to load their historical timeline, visits, and
            personal search configurations.
          </p>
        </div>

        {/* Loading / Error States */}
        {isLoading && (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-14 w-full bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded-xl"
              />
            ))}
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2.5 rounded-lg border border-red-200/40 bg-red-50/50 p-3 text-sm text-red-600 dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400">
            <ShieldAlert size={16} className="mt-0.5 shrink-0" />
            <p className="leading-normal">{error}</p>
          </div>
        )}

        {/* User Card Feed */}
        {!isLoading && !error && (
          <div className="space-y-2.5">
            {users.map((user) => (
              <button
                key={user._id}
                onClick={() => onUserSelected(user)}
                className="group w-full flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-zinc-400 dark:hover:border-zinc-600 shadow-sm transition-all duration-150 text-left outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-400 group-hover:bg-zinc-900 group-hover:text-zinc-50 group-hover:border-zinc-900 dark:group-hover:bg-zinc-50 dark:group-hover:text-zinc-900 transition-colors">
                    <User size={14} />
                  </div>
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {user.name}
                  </span>
                </div>
                <ArrowRight
                  size={16}
                  className="text-zinc-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shrink-0"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
