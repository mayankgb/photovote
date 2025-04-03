"use client"

import { getContest } from "@/app/actions/getInfo"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { $Enums } from "@prisma/client"
import { LeaderBoard } from "@/app/_components/leaderboard"
import { Instrument_Serif } from "next/font/google"

const instrument = Instrument_Serif({
    subsets: ['latin'],
    weight: ['400']
})

type Message = string

type DbData = {
    id: string,
    name: string,
    category: $Enums.Category
}

export default function Institute({ params }: { params: Promise<{ instituteid: string }> }) {
    const [data, setData] = useState<DbData[] | Message>("Loading")
    const [isLoading, setIsLoading] = useState(true)
    const [state , setState] = useState(false)
    const [selectedId, setSelectedId] = useState("")

    useEffect(() => {
        const fetchContests = async () => {
            try {
                setIsLoading(true)
                const id = (await params).instituteid
                const allContest = await getContest(id)
                console.log(allContest)
                setData(allContest)
            } catch (e) {
                console.error(e)
                setData("Something went wrong. Please try again later.")
            } finally {
                setIsLoading(false)
            }
        }

        fetchContests()
    }, [])

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                </div>
            )
        }

        if (typeof data === "string") {
            return (
                <div className="text-center text-red-500 p-4">
                    {data}
                </div>
            )
        }

        if (data.length === 0) {
            return (
                <div className="text-center text-gray-500 p-4">
                    No contests found for this institute.
                </div>
            )
        }

        return (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {data.map((contest) => (
                    <div 
                        key={contest.id} 
                        className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-all duration-300 ease-in-out"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {contest.name}
                            </h2>
                            <span className="text-sm text-gray-500">
                                Category: {contest.category === "MALE" ? "MALE" : "FEMALE"}
                            </span>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button 
                                className="bg-yellow-300 font-bold px-4 py-2 rounded-md hover:bg-yellow-500 transition-colors"
                                onClick={() => {
                                    // Add navigation or action for the contest
                                    setSelectedId(contest.id)
                                    setState(true)
                                    console.log(`Navigate to contest ${contest.id}`)
                                }}
                            >
                                View LeaderBoard
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className={`text-4xl font-bold text-gray-800 mb-8 text-center ${instrument.className}`}>
                 {state ?"LeaderBoard":"Contests"}
            </h1>
            {state ? <LeaderBoard contestId={selectedId}/> : renderContent()}
        </div>
    )
}