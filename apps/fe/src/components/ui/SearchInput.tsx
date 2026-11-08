"use client";
import { ArrowLeft, ArrowRight, History } from "lucide-react";

const SearchInput = () => {
  return (
    <div className="flex items-center justify-between gap-4 border border-gray-300 rounded-full px-4 py-2 bg-white shadow-sm w-full mb-5 mx-auto">
      {/* LEFT SECTION: Navigation & History Icons */}
      <div className="flex items-center gap-3 text-gray-500">
        <button
          className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Go back"
          title="Go back"
        >
          <ArrowLeft size={18} />
        </button>
        <button
          className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Go forward"
          title="Go forward"
        >
          <ArrowRight size={18} />
        </button>
        <button
          className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="View history"
          title="View history"
        >
          <History size={18} />
        </button>
      </div>

      {/* MIDDLE SECTION: Search Bar */}
      <div className="flex-1 min-w-0">
        <input
          type="text"
          placeholder="Type a URL"
          className="w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 text-sm py-1"
        />
      </div>
    </div>
  );
};

export default SearchInput;
