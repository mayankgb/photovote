import {prisma} from "@/client"
import { Instrument_Serif } from "next/font/google"
import Link from "next/link"

const instrument = Instrument_Serif({
    subsets: ["latin"],
    weight: ['400']
})

export default async function Leaderboard() {
    const allInstitute = await prisma.institute.findMany({})

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className={`${instrument.className} text-4xl md:text-6xl font-bold text-gray-800 mb-8 text-center`}>
                Select Your Institute
            </h1>
            
            {allInstitute.length > 0 ? (
                <div className="space-y-4">
                    {allInstitute.map((institute) => (
                        <Link 
                            key={institute.id} 
                            href={`/leaderboard/${institute.id}`} 
                            className="block bg-white shadow-md rounded-lg  hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                        >
                            <div className="px-6 py-4 flex items-center justify-between">
                                <span className="text-xl hover:text-yellow-300 transition-all duration-300 ease-in-out font-semibold text-gray-700">
                                    {institute.name}
                                </span>
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="h-6 w-6 text-gray-500 hover:text-yellow-500" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M9 5l7 7-7 7" 
                                    />
                                </svg>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500 text-xl py-8">
                    No Institutes Found
                </div>
            )}
        </div>
    )
}