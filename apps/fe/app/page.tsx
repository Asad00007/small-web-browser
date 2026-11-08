"use client";

import React from "react";
import Container from "@/src/components/common/Container";
import BrowsingDropdown from "@/src/components/ui/BrowsingDropdown";
import PublishButton from "@/src/components/ui/PublishButton";
import SearchInput from "@/src/components/ui/SearchInput";
import PersonaSelector from "@/src/components/ui/UserPersona";
import WelcomeSetup from "@/src/components/ui/WelcomeSetup";
import { useBrowserStore } from "@/src/store/UserStore";
import { useState } from "react";
import HistoryPanel from "@/src/components/ui/HistoryPanel";

export default function Home() {
  const [isSeeded, setIsSeeded] = useState(false);
  const { view, currentSite, searchResults, error, isLoading, navigateTo } =
    useBrowserStore();

  const handleIframeMessage = (event: MessageEvent) => {
    if (event.data && event.data.type === "SMALLWEB_NAVIGATE") {
      const targetLinkUrl = event.data.url;
      // Pipe the site directory location directly into your live Zustand stack router
      navigateTo(targetLinkUrl);
    }
  };
  const currentUser = useBrowserStore((state) => state.currentUser);
  const setCurrentUser = useBrowserStore((state) => state.setCurrentUser);

  if (!isSeeded)
    return <WelcomeSetup onSetupComplete={() => setIsSeeded(true)} />;
  if (!currentUser) return <PersonaSelector onUserSelected={setCurrentUser} />;

  return (
    <main className="min-h-screen w-full bg-zinc-50 dark:bg-zinc-950 py-10 font-sans">
      <Container maxW="3xl">
        {/* Top Control Chrome Header */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm font-bold tracking-tight text-zinc-400 select-none uppercase">
              Web Browser Workspace Container
            </h2>
            <div className="flex items-center gap-2">
              <PublishButton />
              <BrowsingDropdown />
            </div>
          </div>
          <SearchInput />
        </div>

        {/* Dynamic Display Rendering Matrix */}
        <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl min-h-[450px] shadow-sm overflow-hidden p-1 flex flex-col relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/70 dark:bg-zinc-900/70 z-30 flex items-center justify-center text-sm font-medium text-zinc-500 animate-pulse">
              Connecting network pipeline...
            </div>
          )}

          {/* VIEW: NEW TAB DASHBOARD */}
          {view === "newtab" && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-2">
              <div className="text-3xl font-extrabold tracking-tighter text-zinc-300 select-none">
                Ø
              </div>
              <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
                The Decentralized Network
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm">
                Type a site address prefix directly or query text variables
                using the indexing shell above.
              </p>
            </div>
          )}

          {/* VIEW: FULL TEXT SEARCH ENGINE OUTPUT */}
          {view === "search" && (
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Search Results
              </h3>
              {searchResults.length === 0 ? (
                <p className="text-sm text-zinc-500">
                  No matching nodes indexed across the registry landscape.
                </p>
              ) : (
                <div className="space-y-4">
                  {searchResults.map((site) => (
                    <div
                      key={site._id}
                      className="border-b border-zinc-100 dark:border-zinc-800 pb-3 last:border-none"
                    >
                      <button
                        onClick={() =>
                          useBrowserStore.getState().navigateTo(site.url)
                        }
                        className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 hover:underline text-left block"
                      >
                        {site.title}
                      </button>
                      <span className="text-xs text-emerald-600 block font-mono mt-0.5">
                        {site.url}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {view === "site" && (
            <div className="flex-1 flex flex-col min-h-[700px]">
              {error ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-red-500 font-medium text-sm">
                  {error}
                </div>
              ) : (
                <iframe
                  // INJECTED BRIDGE SCRIPT: Intercepts clicks inside the iframe content and relays them out to React
                  srcDoc={`
                  ${currentSite?.rawHtml}
                  <script>
                    document.addEventListener('click', function(e) {
                      const anchor = e.target.closest('a');
                      if (anchor) {
                        const href = anchor.getAttribute('href');
                        if (href) {
                          e.preventDefault(); // Stop the iframe from breaking or trying to navigate locally
                          // Post a communication payload bubble straight up to our parent React window container
                          window.parent.postMessage({ type: 'SMALLWEB_NAVIGATE', url: href }, '*');
                        }
                      }
                    });
                  </script>
              `}
                  sandbox="allow-scripts" // Grants permission for our injected interception relay script to execute
                  className="w-full flex-1 border-none bg-white rounded-xl"
                  title={currentSite?.title || "Browser View Container"}
                  ref={(iframeElement) => {
                    if (!iframeElement) return;

                    // Remove any old event boundary listeners to keep memory clean
                    window.removeEventListener("message", handleIframeMessage);

                    // Re-listen for communication message bubbles popping out of the sandbox frame
                    window.addEventListener("message", handleIframeMessage);
                  }}
                />
              )}
            </div>
          )}

          {/* VIEW: HISTORY LOGS TIMELINE PANEL */}
          {view === "history" && <HistoryPanel />}
        </div>
      </Container>
    </main>
  );
}
