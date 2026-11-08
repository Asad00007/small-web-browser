"use client";
import Container from "@/src/components/common/Container";
import BrowsingDropdown from "@/src/components/ui/BrowsingDropdown";
import PublishButton from "@/src/components/ui/PublishButton";
import SearchInput from "@/src/components/ui/SearchInput";
import PersonaSelector from "@/src/components/ui/UserPersona";
import WelcomeSetup from "@/src/components/ui/WelcomeSetup";
import { useState } from "react";

interface UserPersona {
  _id: string;
  name: string;
}
export default function Home() {
  const [isSeeded, setIsSeeded] = useState(true);
  // const [currentUser, setCurrentUser] = useState<UserPersona | null>(null);
  const [currentUser, setCurrentUser] = useState<UserPersona | null>({
    _id: "1",
    name: "Bro",
  });

  // Step 1: Verify data exists
  if (!isSeeded) {
    return <WelcomeSetup onSetupComplete={() => setIsSeeded(true)} />;
  }

  // Step 2: Establish identity
  if (!currentUser) {
    return <PersonaSelector onUserSelected={(user) => setCurrentUser(user)} />;
  }
  return (
    <main className="min-h-screen w-full py-16">
      <Container>
        <SearchInput />
        <div className="flex gap-2">
          <PublishButton />
          <BrowsingDropdown />
        </div>
      </Container>
    </main>
  );
}
