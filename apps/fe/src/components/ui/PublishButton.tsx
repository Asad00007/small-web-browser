import React from "react";

const PublishButton = () => {
  return (
    <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90 h-9 px-4 py-2 shadow dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 font-sans tracking-tight">
      Publish
    </button>
  );
};

export default PublishButton;
