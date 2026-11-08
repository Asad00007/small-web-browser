"use client";
import { ChevronDown } from "lucide-react";
import React, { useState } from "react";

const BrowsingDropdown = () => {
  // States for user selection and dropdown toggle
  const [selectedUser, setSelectedUser] = useState("Select User");
  const [isOpen, setIsOpen] = useState(false);

  // Mock list of users
  const users = ["All Users", "John Doe", "Jane Smith", "Alex Johnson"];

  return (
    <div className="relative border-gray-200 pl-4 flex items-center gap-2 ">
      <h1 className="text-sm font-medium text-gray-500">Browsing as:</h1>

      {/* Dropdown Trigger Button */}
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
        <div className="absolute left-4 top-full mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-10">
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
  );
};

export default BrowsingDropdown;
