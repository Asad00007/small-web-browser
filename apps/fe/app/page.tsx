import Container from "@/src/components/common/Container";
import SearchInput from "@/src/components/ui/SearchInput";

export default function Home() {
  return (
    <main className="min-h-screen w-full py-16">
      <Container>
        <SearchInput />
      </Container>
    </main>
  );
}
