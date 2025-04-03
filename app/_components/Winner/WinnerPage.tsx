"use client"

import { getWinners } from "@/app/actions/contest"
import { useEffect, useState } from "react"
import { Trophy, Star, Users, Calendar, ArrowRight, Award } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface WinnerData {
    name: string | null,
    upvote: number | null, 
    contestName: string,
    userImage: string | null
    totalParticipant: number 
}

export function Winner({contestId}: {contestId: string}) {
    const [data, setData] = useState<WinnerData>({
        name: "",
        upvote: null,
        contestName: "",
        userImage: "",
        totalParticipant: 0
    })
    const [isLoading, setIsLoading] = useState(false)
    const [showDummy, setShowDummy] = useState(true) // For testing purposes
    const [error ,setError] = useState("")
    const router = useRouter()

    useEffect(() => {
        async function fetchWinner() {
            
            setIsLoading(true)
            try {
                const winnerData = await getWinners(contestId)
                if (winnerData.status === 200 && winnerData.data) {
                    const newWinner: WinnerData = {
                        name: winnerData.data.user.name,
                        upvote: winnerData.data.participant.upvote,
                        contestName: winnerData.data.contest.name,
                        userImage: winnerData.data.user.image,
                        totalParticipant: winnerData.count.participant
                    }
                    setData(newWinner)
                }else {
                    setError(winnerData.message)
                }
            } catch(e) {
                console.error("Error fetching winner:", e)
            } finally {
                setIsLoading(false)
            }
        }
        
        fetchWinner()
    }, [contestId, showDummy])

    const handleParticipate = () => {
        router.push("/participate")
    }

    if (isLoading) {
        return (
            <div className="w-full p-8 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        )
    }

    if (error) {
        return(
            <div className="w-full h-full flex justify-center items-center text-xl text-gray-400">
                {error}
            </div>
        )
    }

    return (
        <div className="bg-white mt-4 rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto border border-gray-100">
            {/* Header - Adaptive for mobile */}
            <div className="relative bg-gradient-to-r from-slate-700 to-slate-900 text-white p-4 sm:p-6">
                <div className="absolute top-0 right-0 w-24 h-24">
                    <div className="absolute transform rotate-45 bg-yellow-500 text-white font-bold text-xs py-1 right-[-35px] top-[20px] w-[140px] text-center">
                        WINNER
                    </div>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold flex items-center">
                    <Trophy className="text-amber-300 mr-2" size={24} />
                    {data.contestName}
                </h2>
            </div>
            
            {/* Content - Stacks vertically on mobile */}
            <div className="p-4 sm:p-6">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-indigo-100 shadow-inner">
                        {data.userImage ? (
                            <Image 
                                src={data.userImage} 
                                alt={data.name || "Contest Winner"} 
                                fill 
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                <Trophy size={36} className="text-amber-400" />
                            </div>
                        )}
                    </div>
                    
                    <div className="flex-1 text-center w-full">
                        <div className="inline-block px-3 py-1 rounded-full text-indigo-800 text-xs sm:text-sm font-medium mb-2 bg-indigo-50">
                            Winner Announcement
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                            {data.name || "No winner yet"}
                        </h3>
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <div className="flex items-center text-gray-700">
                                <Star size={18} className="text-amber-400 mr-1" fill="#FBBF24" />
                                <span className="font-semibold">{data.upvote || 0}</span> <span className="text-gray-500 ml-1">upvotes</span>
                            </div>
                        </div>
                        <p className="text-gray-600 mb-6 px-4 sm:px-8">
                            {data.name ? 
                                `Congratulations to ${data.name} for winning the ${data.contestName} with an outstanding ${data.upvote} upvotes!` : 
                                "We don't have a winner for this contest yet. Be the first to participate and claim the prize!"
                            }
                        </p>
                        
                        <button 
                            onClick={handleParticipate}
                            className="inline-flex items-center px-5 py-2 sm:px-6 sm:py-3 bg-yellow-400 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md"
                        >
                            Want to Participate <ArrowRight size={16} className="ml-2" />
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Stats Section - Responsive grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-4 py-5 border-t border-b border-gray-100 bg-gray-50">
                <div className="text-center p-2">
                    <p className="text-gray-500 text-xs">Total Contestants</p>
                    <p className="text-lg font-semibold text-gray-800 flex items-center justify-center">
                        <Users size={14} className="text-indigo-500 mr-1" /> 128
                    </p>
                </div>
                <div className="text-center p-2">
                    <p className="text-gray-500 text-xs">Total Votes</p>
                    <p className="text-lg font-semibold text-gray-800 flex items-center justify-center">
                        <Star size={14} className="text-amber-400 mr-1" /> 2,547
                    </p>
                </div>
                
            </div>
            
            {/* Footer - Mobile-friendly */}
            <div className="bg-slate-50 p-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="flex items-center text-sm text-slate-600">
                    <Calendar size={16} className="text-indigo-500 mr-2" />
                    <span>Next contest starting in 3 days</span>
                </div>
                
                <button onClick={() => router.push("/vote")} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
                    Vote your favourite participant <ArrowRight size={14} className="ml-1" />
                </button>
            </div>
        </div>
    )
}