"use client";
import Container from "@/src/components/common/Container";
import BrowsingDropdown from "@/src/components/ui/BrowsingDropdown";
import PublishButton from "@/src/components/ui/PublishButton";
import SearchInput from "@/src/components/ui/SearchInput";
import PersonaSelector from "@/src/components/ui/UserPersona";
import WelcomeSetup from "@/src/components/ui/WelcomeSetup";
import { useBrowserStore } from "@/src/store/UserStore";
import { useState } from "react";

export default function Home() {
  const [isSeeded, setIsSeeded] = useState(false);
  const currentUser = useBrowserStore((state) => state.currentUser);
  const setCurrentUser = useBrowserStore((state) => state.setCurrentUser);

  // Step 1: Verify data exists
  if (!isSeeded) {
    return <WelcomeSetup onSetupComplete={() => setIsSeeded(true)} />;
  }

  // Step 2: Establish identity
  if (!currentUser) {
    return <PersonaSelector onUserSelected={setCurrentUser} />;
  }
  return (
    <main className="min-h-screen w-full py-16">
      <Container>
        <SearchInput />
        <div className="flex gap-2">
          <PublishButton />
          <BrowsingDropdown />
        </div>
        {/* Site content goes here */}
      </Container>
    </main>
  );
}
