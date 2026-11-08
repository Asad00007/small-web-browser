import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserPersona {
  _id: string;
  name: string;
}

export interface SiteContent {
  _id: string;
  url: string;
  title: string;
  rawHtml: string;
}

interface BrowserState {
  // Session Persona Identity
  currentUser: UserPersona | null;
  setCurrentUser: (user: UserPersona | null) => void;

  // Browser Core Navigation Layout Controls
  view: "newtab" | "site" | "search" | "history";
  currentUrl: string;
  currentSite: SiteContent | null;
  searchQuery: string;
  searchResults: SiteContent[];
  isLoading: boolean;
  error: string | null;

  // The History Retrace Retainer Engine (Back / Forward arrays)
  historyStack: string[];
  forwardStack: string[];

  // Action Triggers
  navigateTo: (url: string) => Promise<void>;
  performSearch: (query: string) => Promise<void>;
  goBack: () => void;
  goForward: () => void;
  setViewState: (view: "newtab" | "history") => void;
}

export const useBrowserStore = create<BrowserState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      setCurrentUser: (user) =>
        set({
          currentUser: user,
          view: "newtab",
          historyStack: [],
          forwardStack: [],
        }),

      view: "newtab",
      currentUrl: "",
      currentSite: null,
      searchQuery: "",
      searchResults: [],
      isLoading: false,
      error: null,
      historyStack: [],
      forwardStack: [],

      setViewState: (view) =>
        set({
          view,
          currentUrl: view === "history" ? "smallweb://history" : "",
        }),

      navigateTo: async (url) => {
        if (!url.trim()) return;

        // Normalize string protocol matching rules
        let targetUrl = url.trim();
        if (!targetUrl.startsWith("smallweb://")) {
          targetUrl = `smallweb://${targetUrl}`;
        }

        set({ isLoading: true, error: null, currentUrl: targetUrl });
        const { currentUser, historyStack, currentUrl } = get();

        try {
          const res = await fetch(
            `http://localhost:3001/sites/browse?url=${encodeURIComponent(targetUrl)}`,
          );

          if (!res.ok) {
            throw new Error(
              "Nowhere: Address location matching index lookup failed",
            );
          }

          const siteData: SiteContent = await res.json();

          // Append old tracking history to enable sequential back routing clicks
          const updatedHistory = currentUrl
            ? [...historyStack, currentUrl]
            : historyStack;

          set({
            view: "site",
            currentSite: siteData,
            historyStack: updatedHistory,
            forwardStack: [], // Reset forwards navigation path on fresh hyperlink load executions
            isLoading: false,
          });

          // Fire asynchronous background logging update out to your Nest DB history collection
          if (currentUser) {
            await fetch("http://localhost:3001/history", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId: currentUser._id,
                siteId: siteData._id,
                action: "visit",
              }),
            });
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          set({
            error: err.message || "Failed to load page",
            view: "site",
            currentSite: null,
            isLoading: false,
          });
        }
      },

      performSearch: async (query) => {
        if (!query.trim()) return;

        set({
          isLoading: true,
          error: null,
          searchQuery: query,
          currentUrl: `smallweb://search?q=${encodeURIComponent(query)}`,
        });
        const { currentUser, historyStack, currentUrl } = get();

        try {
          const res = await fetch(
            `http://localhost:3001/sites/search?q=${encodeURIComponent(query)}`,
          );
          const searchData = await res.json();

          const updatedHistory = currentUrl
            ? [...historyStack, currentUrl]
            : historyStack;

          set({
            view: "search",
            searchResults: searchData,
            historyStack: updatedHistory,
            forwardStack: [],
            isLoading: false,
          });

          // Push structural logging metric to your Nest History Logs table
          if (currentUser) {
            await fetch("http://localhost:3001/history", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId: currentUser._id,
                action: "search",
                query: query,
              }),
            });
          }
        } catch (err) {
          set({
            error: "Search database operation could not resolve",
            isLoading: false,
          });
        }
      },

      goBack: () => {
        const { historyStack, forwardStack, currentUrl } = get();
        if (historyStack.length === 0) return;

        const previousUrl = historyStack[historyStack.length - 1];
        const updatedHistory = historyStack.slice(0, -1);
        const updatedForward = currentUrl
          ? [...forwardStack, currentUrl]
          : forwardStack;

        set({ historyStack: updatedHistory, forwardStack: updatedForward });

        // Safely re-route rendering view windows based on back target parameter paths
        if (previousUrl.includes("smallweb://search?q=")) {
          const query = decodeURIComponent(previousUrl.split("?q=")[1] || "");
          get().performSearch(query);
        } else if (previousUrl === "smallweb://history") {
          set({ view: "history", currentUrl: previousUrl });
        } else if (!previousUrl) {
          set({ view: "newtab", currentUrl: "" });
        } else {
          get().navigateTo(previousUrl);
        }
      },

      goForward: () => {
        const { forwardStack, historyStack, currentUrl } = get();
        if (forwardStack.length === 0) return;

        const nextUrl = forwardStack[forwardStack.length - 1];
        const updatedForward = forwardStack.slice(0, -1);
        const updatedHistory = currentUrl
          ? [...historyStack, currentUrl]
          : historyStack;

        set({ historyStack: updatedHistory, forwardStack: updatedForward });

        if (nextUrl.includes("smallweb://search?q=")) {
          const query = decodeURIComponent(nextUrl.split("?q=")[1] || "");
          get().performSearch(query);
        } else if (nextUrl === "smallweb://history") {
          set({ view: "history", currentUrl: nextUrl });
        } else {
          get().navigateTo(nextUrl);
        }
      },
    }),
    {
      name: "small-web-browser-storage",
      partialize: (state) => ({ currentUser: state.currentUser }),
    },
  ),
);
