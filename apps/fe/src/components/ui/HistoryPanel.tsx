"use client";

import React, { useState, useEffect } from "react";
import { Clock, Globe, Search } from "lucide-react";
import { useBrowserStore } from "@/src/store/UserStore";

interface LogEntry {
  _id: string;
  action: "visit" | "search";
  query?: string;
  siteId?: {
    title: string;
    url: string;
  };
  timestamp: string;
}

export default function HistoryPanel() {
  const currentUser = useBrowserStore((state) => state.currentUser);
  const navigateTo = useBrowserStore((state) => state.navigateTo);
  const performSearch = useBrowserStore((state) => state.performSearch);

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      if (!currentUser) return;
      try {
        const res = await fetch(
          `http://localhost:3001/api/history/user/${currentUser._id}`,
        );
        if (res.ok) {
          const data = await res.json();
          setLogs(data);
        }
      } catch (err) {
        console.error("Timeline retrieval sync error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadLogs();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="p-8 text-center text-xs font-medium text-zinc-400 animate-pulse">
        Parsing history timeline entries...
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 space-y-4 overflow-y-auto font-sans text-left">
      <div className="flex items-center gap-2 pb-2 border-b border-zinc-100 dark:border-zinc-800">
        <Clock size={14} className="text-zinc-400" />
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
          Chronological Retrace Path Log
        </h3>
      </div>

      {logs.length === 0 ? (
        <p className="text-xs text-zinc-400">
          This persona profile hasn&apos;t logged any browsing steps yet.
        </p>
      ) : (
        <div className="space-y-3.5 relative border-l border-zinc-100 dark:border-zinc-800 pl-4 ml-2.5">
          {logs.map((log) => {
            const date = new Date(log.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={log._id}
                className="relative group flex items-start justify-between gap-4"
              >
                {/* Visual Bullet Connector */}
                <div className="absolute -left-[21px] mt-1.5 h-2 w-2 rounded-full border bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-600 group-hover:border-zinc-900 transition-colors" />

                <div className="space-y-0.5 min-w-0">
                  {log.action === "visit" ? (
                    <button
                      onClick={() => log.siteId && navigateTo(log.siteId.url)}
                      className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 hover:underline text-left block truncate"
                    >
                      Visited: {log.siteId?.title || "Unknown Page Entry"}
                    </button>
                  ) : (
                    <button
                      onClick={() => log.query && performSearch(log.query)}
                      className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 hover:underline text-left block truncate"
                    >
                      Searched index for:{" "}
                      <span className="italic font-mono bg-zinc-50 px-1 py-0.5 rounded border">
                        &quot;{log.query}&quot;
                      </span>
                    </button>
                  )}

                  {log.siteId && (
                    <span className="block text-[11px] font-mono text-emerald-600 truncate">
                      {log.siteId.url}
                    </span>
                  )}
                </div>

                <span className="text-[10px] font-mono text-zinc-400 tracking-tight whitespace-nowrap pt-0.5">
                  {date}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
