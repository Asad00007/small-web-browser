"use client";
import { useState } from "react";
import { ArrowLeft, ArrowRight, History, ChevronDown } from "lucide-react";

const SearchInput = () => {
  // State for the user selection dropdown
  const [selectedUser, setSelectedUser] = useState("Select User");
  const [isOpen, setIsOpen] = useState(false);

  // Mock list of users
  const users = ["All Users", "John Doe", "Jane Smith", "Alex Johnson"];

  return (
    <div className="flex items-center justify-between gap-4 border border-gray-300 rounded-full px-4 py-2 bg-white shadow-sm w-full max-w-3xl mx-auto">
      {/* LEFT SECTION: Navigation & History Icons */}
      <div className="flex items-center gap-3 text-gray-500">
        <button
          className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </button>
        <button
          className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Go forward"
        >
          <ArrowRight size={18} />
        </button>
        <button
          className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="View history"
        >
          <History size={18} />
        </button>
      </div>

      {/* MIDDLE SECTION: Search Bar */}
      <div className="flex-1 min-w-0">
        <input
          type="text"
          placeholder="Search ..."
          className="w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 text-sm py-1"
        />
      </div>

      {/* RIGHT SECTION: User Dropdown */}
      <div className="relative border-l border-gray-200 pl-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors focus:outline-none"
        >
          <span className="truncate max-w-[100px]">{selectedUser}</span>
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-10">
            {users.map((user) => (
              <button
                key={user}
                onClick={() => {
                  setSelectedUser(user);
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl"
              >
                {user}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchInput;
