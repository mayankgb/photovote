import dynamic from "next/dynamic";
const Navbar  = dynamic(() => import ("./_components/Navbar"))
const Hero  = dynamic(() => import ("./_components/HeroSection"))
const FoundingMembers  = dynamic(() => import ("./_components/FoundingMembers"))

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
