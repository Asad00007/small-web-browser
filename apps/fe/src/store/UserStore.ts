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
  currentUser: UserPersona | null;
  setCurrentUser: (user: UserPersona | null) => Promise<void>; // Updated to a Promise
  view: "newtab" | "site" | "search" | "history";
  currentUrl: string;
  currentSite: SiteContent | null;
  searchQuery: string;
  searchResults: SiteContent[];
  isLoading: boolean;
  error: string | null;
  historyStack: string[];
  forwardStack: string[];

  navigateTo: (url: string, pushToHistory?: boolean) => Promise<void>;
  performSearch: (query: string, pushToHistory?: boolean) => Promise<void>;
  goBack: () => void;
  goForward: () => void;
  setViewState: (view: "newtab" | "history") => void;
}

export const useBrowserStore = create<BrowserState>()(
  persist(
    (set, get) => ({
      currentUser: null,

      // FIXED: Changing users now explicitly adds an empty string entry as Step 0
      setCurrentUser: async (user) => {
        if (!user) {
          set({
            currentUser: null,
            view: "newtab",
            historyStack: [],
            forwardStack: [],
            currentUrl: "",
            currentSite: null,
          });
          return;
        }

        set({ isLoading: true });

        try {
          const res = await fetch(
            `http://localhost:3001/api/history/user/${user._id}`,
          );
          if (!res.ok) throw new Error("Could not fetch user history profile");

          const logs = await res.json();

          // Step 0 anchor: Start every single back-stack with a pristine blank state
          const reconstructedStack: string[] = [""];

          logs.reverse().forEach((log: any) => {
            if (log.action === "visit" && log.siteId) {
              reconstructedStack.push(log.siteId.url);
            } else if (log.action === "search" && log.query) {
              reconstructedStack.push(
                `smallweb://search?q=${encodeURIComponent(log.query)}`,
              );
            }
          });

          // Get the last interactive event to drop them straight into it
          const lastVisitedUrl =
            reconstructedStack.length > 1 ? reconstructedStack.pop() : "";

          set({
            currentUser: user,
            historyStack: reconstructedStack, // Holds [""] as the bottom item or additional history
            forwardStack: [],
            isLoading: false,
          });

          if (lastVisitedUrl) {
            if (lastVisitedUrl.startsWith("smallweb://search?q=")) {
              const query = decodeURIComponent(
                lastVisitedUrl.replace("smallweb://search?q=", ""),
              );
              get().performSearch(query, false);
            } else {
              get().navigateTo(lastVisitedUrl, false);
            }
          } else {
            set({ view: "newtab", currentUrl: "", currentSite: null });
          }
        } catch (err) {
          console.error(
            "Failed to restore persona navigation profile history lines",
            err,
          );
          // Fallback if database error occurs
          set({
            currentUser: user,
            view: "newtab",
            historyStack: [""],
            forwardStack: [],
            currentUrl: "",
            currentSite: null,
            isLoading: false,
          });
        }
      },

      view: "newtab",
      currentUrl: "",
      currentSite: null,
      searchQuery: "",
      searchResults: [],
      isLoading: false,
      error: null,
      historyStack: [],
      forwardStack: [],

      setViewState: (view) => {
        const { currentUrl, historyStack } = get();
        let updatedHistory = [...historyStack];

        if (
          currentUrl &&
          historyStack[historyStack.length - 1] !== currentUrl
        ) {
          updatedHistory.push(currentUrl);
        }

        if (view === "history") {
          set({
            view,
            currentUrl: "smallweb://history",
            historyStack: updatedHistory,
            forwardStack: [],
          });
        } else {
          set({
            view,
            currentUrl: "",
            historyStack: updatedHistory,
            forwardStack: [],
          });
        }
      },

      navigateTo: async (url, pushToHistory = true) => {
        if (!url.trim()) return;

        let targetUrl = url.trim();
        if (!targetUrl.startsWith("smallweb://")) {
          targetUrl = `smallweb://${targetUrl}`;
        }

        const { currentUrl, historyStack, currentUser } = get();
        set({ isLoading: true, error: null });

        try {
          const res = await fetch(
            `http://localhost:3001/api/sites/browse?url=${encodeURIComponent(targetUrl)}`,
          );
          if (!res.ok)
            throw new Error(
              "Nowhere: Address location matching index lookup failed",
            );

          const siteData: SiteContent = await res.json();

          let updatedHistory = [...historyStack];
          if (pushToHistory && currentUrl && currentUrl !== targetUrl) {
            updatedHistory.push(currentUrl);
          }

          set({
            view: "site",
            currentUrl: targetUrl,
            currentSite: siteData,
            historyStack: updatedHistory,
            isLoading: false,
            ...(pushToHistory ? { forwardStack: [] } : {}),
          });

          if (currentUser) {
            await fetch("http://localhost:3001/api/history", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId: currentUser._id,
                siteId: siteData._id,
                action: "visit",
              }),
            });
          }
        } catch (err: any) {
          set({
            error: err.message || "Failed to load page",
            view: "site",
            currentUrl: targetUrl,
            currentSite: null,
            isLoading: false,
          });
        }
      },

      performSearch: async (query, pushToHistory = true) => {
        if (!query.trim()) return;
        const targetSearchUrl = `smallweb://search?q=${encodeURIComponent(query)}`;

        const { currentUrl, historyStack, currentUser } = get();
        set({ isLoading: true, error: null });

        try {
          const res = await fetch(
            `http://localhost:3001/api/sites/search?q=${encodeURIComponent(query)}`,
          );
          const searchData = await res.json();

          let updatedHistory = [...historyStack];
          if (pushToHistory && currentUrl && currentUrl !== targetSearchUrl) {
            updatedHistory.push(currentUrl);
          }

          set({
            view: "search",
            searchQuery: query,
            currentUrl: targetSearchUrl,
            searchResults: searchData,
            historyStack: updatedHistory,
            isLoading: false,
            ...(pushToHistory ? { forwardStack: [] } : {}),
          });

          if (currentUser) {
            await fetch("http://localhost:3001/api/history", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId: currentUser._id,
                action: "search",
                query,
              }),
            });
          }
        } catch (err) {
          set({ error: "Search database operation failed", isLoading: false });
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

        if (previousUrl.startsWith("smallweb://search?q=")) {
          const query = decodeURIComponent(
            previousUrl.replace("smallweb://search?q=", ""),
          );
          get().performSearch(query, false);
        } else if (previousUrl === "smallweb://history") {
          set({ view: "history", currentUrl: previousUrl });
        } else if (previousUrl === "") {
          set({ view: "newtab", currentUrl: "" });
        } else {
          get().navigateTo(previousUrl, false);
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

        if (nextUrl.startsWith("smallweb://search?q=")) {
          const query = decodeURIComponent(
            nextUrl.replace("smallweb://search?q=", ""),
          );
          get().performSearch(query, false);
        } else if (nextUrl === "smallweb://history") {
          set({ view: "history", currentUrl: nextUrl });
        } else if (nextUrl === "") {
          set({ view: "newtab", currentUrl: "" });
        } else {
          get().navigateTo(nextUrl, false);
        }
      },
    }),
    {
      name: "small-web-browser-storage",
      partialize: (state) => ({ currentUser: state.currentUser }),
    },
  ),
);
