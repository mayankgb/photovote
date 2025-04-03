"use client"

import { getCompeletedContest } from "@/app/actions/contest"
import { $Enums } from "@prisma/client"
import { useEffect, useState } from "react"
import { Trophy, Medal, Award } from "lucide-react"
import { useRouter } from "next/navigation"

interface ContestData {
    id: string,
    name: string, 
    status: $Enums.ContestStatus,
    category: $Enums.Category
}

export default function Winners() {
    const [data, setData] = useState<ContestData[]>([]) 
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        async function fetchContests() {
            setIsLoading(true)
            try {
                const response = await getCompeletedContest()
                if (response) {
                    setData(response)
                }
            } catch(e) {
                console.error("Error fetching contests:", e)
            } finally {
                setIsLoading(false)
            }
        }
        
        fetchContests()
    }, [])

    const getCategoryIcon = (category: $Enums.Category) => {
        return category === "MALE" ? 
            <div className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm font-medium flex items-center">
                <Trophy size={16} className="mr-1" />
                Male
            </div> : 
            <div className="bg-pink-100 text-pink-700 rounded-full px-3 py-1 text-sm font-medium flex items-center">
                <Trophy size={16} className="mr-1" />
                Female
            </div>
    }

    const getStatusBadge = (status: $Enums.ContestStatus) => {
        switch(status) {
            case "STARTED":
                return <div className="bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm font-medium flex items-center">
                    <Award size={16} className="mr-1" />
                    Completed
                </div>
            case "ENDED":
                return <div className="bg-yellow-100 text-yellow-700 rounded-full px-3 py-1 text-sm font-medium flex items-center">
                    <Medal size={16} className="mr-1" />
                    Ongoing
                </div>
            default:
                return <div className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-sm font-medium">
                    {status}
                </div>
        }
    }

    if (isLoading) {
        return (
            <div className="w-full h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Contest Winners</h1>
            
            {data.length === 0 ? (
                <div className="bg-white shadow rounded-lg p-8 text-center">
                    <p className="text-gray-500">We're waiting for our first contest champions! Come back later to see the winners."</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {data.map((contest) => (
                        <div 
                            key={contest.id} 
                            onClick={() => router.push(`/winners/${contest.id}`)}
                            className="bg-white cursor-pointer shadow rounded-lg p-6 hover:shadow-lg transition-shadow w-full"
                        >
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex-1">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{contest.name}</h2>
                                    <p className="text-gray-500 text-sm">ID: {contest.id}</p>
                                </div>
                                
                                <div className="flex flex-wrap gap-2">
                                    {getCategoryIcon(contest.category)}
                                    {getStatusBadge(contest.status)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}