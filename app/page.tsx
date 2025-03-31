import { FoundingMembers } from "./_components/FoundingMembers";
import { Hero } from "./_components/HeroSection";
import { Navbar } from "./_components/Navbar";

export default function Home() {

  return (
    <div className="">
      <div className="flex flex-col h-screen">
      <Navbar/>
      <Hero/>
      </div>
      <FoundingMembers/>
    </div>
  );
}
