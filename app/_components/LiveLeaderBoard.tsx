"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Trophy, Medal, Award } from "lucide-react"
import { useContestId } from "@/store/state"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

interface Data {
    upvote: number;
    id: string
    user: {
        name: string | null;
        image: string | null;
        id: string
        branch: {
            name: string;
        } | null;
    };
}

export function LiveBoard() {

    const { contestId } = useContestId()
    const session = useSession()
    const [error, setError] = useState("")
    const [data, setData] = useState<Data[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const main = async () => {

            if (!session || !session.data) {
                return
            }

            const socket = new WebSocket("wss://molest-backend.onrender.com")

            socket.onopen = () => {
                console.log("connected")
                socket.send(JSON.stringify({
                    token: session.data.user.jwtToken,
                    type: "firstonline",
                    contestId: contestId
                }))
            }

            socket.onmessage = (message) => {
                const data = JSON.parse(message.data)
                if (data.type === "data") {
                    setData(data.data)
                    setError("")
                }else if (data.type === "error"){
                    toast(data.message)
                    setError(data.message)
                }else if (data.type === "Last") {
                    setData((prev) => {
                        const clonePrev = [...prev]
                        clonePrev.pop()
                        clonePrev.push(data.data)
                        return clonePrev
                    })
                }else if (data.type === "new") {
                    setData((prev) => {
                        const clonePrev = [...prev]
                        clonePrev.pop()
                        clonePrev.splice(data.index, 0, data.data)
                        return clonePrev
                    })
                }else if (data.type === "update") {
                    setData((prev) => {
                        const newData = [...prev]
                        const newArr = newData.map((a) => {
                            if (a.id === data.id) {
                                const newUpvote: Data = {...a , upvote: data.upvote}
                                return newUpvote
                            }
                            return a
                        })

                        return newArr
                    })
                }
            }
        }
        main()
    }, [contestId, session])

    const getRankIcon = (index: number) => {
        switch (index) {
            case 0:
                return <Trophy className="text-yellow-400 w-6 h-6" />
            case 1:
                return <Medal className="text-gray-400 w-6 h-6" />
            case 2:
                return <Medal className="text-amber-700 w-6 h-6" />
            default:
                return <Award className="text-black w-5 h-5" />
        }
    }

    return (
        <div className="bg-gray-50 rounded-lg shadow-md p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-2">Top 10 Hottest Guy</h2>
            <p className="text-center text-gray-600 mb-6">Vote for the hottest guy from the institute</p>

            {isLoading ? (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
                </div>
            ) : error ? (
                <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            ) : data && data.length > 0 ? (
                <div className="space-y-4">
                    {data.map((participant, index) => (
                        <div
                            key={participant.user.name}
                            className={`flex items-center space-y-4 md:space-y-0 flex-col sm:flex-row justify-between p-4 rounded-lg transition-all ${index === 0
                                ? "bg-yellow-100 border-2 border-yellow-400"
                                : "bg-white border border-gray-200 hover:border-yellow-400"
                                }`}
                        >
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                                    {getRankIcon(index)}
                                </div>

                                <div className="flex items-center">
                                    {participant.user.image ? (
                                        <div className="relative mr-3">
                                            <Image
                                                src={participant.user.image}
                                                alt={participant.user.name || "User"}
                                                width={40}
                                                height={40}
                                                className="rounded-full border-2 border-gray-200"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center">
                                            <span className="text-gray-600 font-medium">
                                                {participant.user.name?.charAt(0) || "?"}
                                            </span>
                                        </div>
                                    )}

                                    <div>
                                        <p className="font-semibold text-gray-800">{participant.user.name || "Anonymous"}</p>
                                        <p className="text-sm text-gray-500">{participant.user.branch?.name || "No Branch"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center sm:w-fit w-full space-x-3">
                                <div className="bg-black w-full text-yellow-400 text-center rounded-2xl px-4 py-2 rounded-lg font-semibold">
                                    {participant.upvote} {participant.upvote === 1 ? "vote" : "votes"}
                                </div>

                                
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10">
                    <p className="text-gray-500 mb-2">No participants found</p>
                    <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-md transition-colors">
                        Refresh
                    </button>
                </div>
            )}
        </div>
    )
}