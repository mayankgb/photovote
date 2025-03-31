import { Instrument_Serif } from "next/font/google"
import { authOptions } from "@/app/lib/auth"
import { getServerSession } from "next-auth"
import Link from "next/link"
import ActiveContest from "@/app/_components/HomePage/ActiveContest"
import YourEntries from "@/app/_components/HomePage/YourEntries"
import ViewAchievements from "@/app/_components/HomePage/ViewAchievements"
import FeaturedContest from "@/app/_components/HomePage/FeaturedContest"

const instrument = Instrument_Serif({
    subsets: ['latin'],
    weight: ["400"]
})

export default async function Home() {
    const session = await getServerSession(authOptions)
    
    // Time-based greeting
    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return "Good morning"
        if (hour < 18) return "Good afternoon"
        return "Good evening"
    }
    
    return (
        <div className="grow w-full max-w-7xl mx-auto px-4 py-8">
            {/* Hero section */}
            <section className="mb-16">
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-lg">
                    <div className="max-w-3xl">
                        <h1 className={`${instrument.className} text-4xl md:text-5xl mb-4`}>
                            {getGreeting()}, {session?.user.name || "Guest"}
                        </h1>
                        <p className="text-gray-300 text-lg mb-8">
                            Track contests, participate in competitions, and connect with your institute community.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/participate" className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 px-6 rounded-lg transition-colors">
                                Explore Contests
                            </Link>
                            <Link href="/liveleaderboard" className="bg-transparent hover:bg-white/10 border border-white text-white font-medium py-3 px-6 rounded-lg transition-colors">
                                View Leaderboard
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Quick stats */}
            <section className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
               <ActiveContest/>
               <YourEntries/>
               <ViewAchievements/>
            </section>
            
            {/* Featured contests */}
            <section className="mb-16">
                <div className="flex justify-between items-center mb-6">
                    <h2 className={`${instrument.className} text-2xl`}>Featured Contests</h2>
                    <Link href="/participate" className="text-yellow-600 hover:text-yellow-700 font-medium">
                        View all →
                    </Link>
                </div>
                <FeaturedContest/>
                
            </section>
            
            {/* Call to action */}
            <section>
                <div className="bg-black rounded-2xl p-8 text-white text-center">
                    <h2 className={`${instrument.className} text-3xl mb-4`}>Ready to showcase your Hotness?</h2>
                    <p className="text-gray-300 max-w-2xl mx-auto mb-8">
                        Join the contest and invite participants from your institute to join and compete.
                    </p>
                    <Link href="/participate" className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg transition-colors inline-block">
                        Join Contest
                    </Link>
                </div>
            </section>
        </div>
    )
}