"use client";

import React, { useState } from "react";
import { Plus, X, Globe } from "lucide-react";
import { useBrowserStore } from "@/src/store/UserStore";

export default function PublishButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [rawHtml, setRawHtml] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !title || !rawHtml) return;

    setIsSubmitting(true);
    setMessage(null);

    // Normalize protocol string matching patterns
    const trimmedUrl = url.trim();
    let formattedUrl = trimmedUrl.replaceAll(" ", "-");
    if (!formattedUrl.startsWith("smallweb://")) {
      formattedUrl = `smallweb://${formattedUrl}`;
    }

    try {
      const res = await fetch("http://localhost:3001/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: formattedUrl, title, rawHtml }),
      });

      if (!res.ok) throw new Error("Failed to register node layout address.");

      setMessage({
        type: "success",
        text: "Site deployed successfully to the small web network!",
      });
      setUrl("");
      setTitle("");
      setRawHtml("");

      // Auto close after brief interval delay
      setTimeout(() => {
        setIsOpen(false);
        setMessage(null);
        // Force the browser to jump directly to the newly registered page path instantly
        useBrowserStore.getState().navigateTo(formattedUrl);
      }, 1500);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "An unexpected publishing error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 justify-center rounded-lg text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 disabled:opacity-50 disabled:pointer-events-none bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90 h-8.5 px-3 py-1.5 shadow dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 font-sans tracking-tight"
      >
        <Plus size={14} />
        <span>Publish</span>
      </button>

      {/* Floating Modal Backdrop and Container Overlay Matrix */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans animate-in fade-in duration-200">
          {/* Dark Glass Backdrop Panel */}
          <div
            className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xs"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Content Box Frame */}
          <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl p-6 space-y-4 z-10 animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between pb-1 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
                <Globe size={16} className="text-zinc-400" />
                <h3 className="font-semibold text-sm tracking-tight">
                  Deploy Custom HTML Page
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-1 rounded-md"
              >
                <X size={16} />
              </button>
            </div>

            {/* Input Form Fields */}
            <form onSubmit={handlePublish} className="space-y-3.5 text-left">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Web Node URL
                </label>
                <input
                  type="text"
                  required
                  placeholder="my-blog.home"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full text-xs font-medium px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none focus:border-zinc-400 dark:bg-zinc-950 dark:text-zinc-100 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Index Header Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="Welcome to My Sandbox Corner"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs font-medium px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none focus:border-zinc-400 dark:bg-zinc-950 dark:text-zinc-100 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Raw HTML Content
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="<div style='color: blue;'><h1>Hello Ecosystem</h1></div>"
                  value={rawHtml}
                  onChange={(e) => setRawHtml(e.target.value)}
                  className="w-full text-xs font-mono p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none focus:border-zinc-400 dark:bg-zinc-950 dark:text-zinc-100 transition-colors resize-none"
                />
              </div>

              {/* Status Alert Panels */}
              {message && (
                <div
                  className={`p-2.5 rounded-lg text-xs font-medium ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30" : "bg-red-50 text-red-600 border border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30"}`}
                >
                  {message.text}
                </div>
              )}

              {/* Form Action Controls */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-3 py-1.5 bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 rounded-lg text-xs font-semibold shadow transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Deploying..." : "Launch Site"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
