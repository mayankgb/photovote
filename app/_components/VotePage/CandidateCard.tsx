"use client"

import { getParticipant } from "@/app/actions/getInfo"
import { useContestId } from "@/store/state"
import { useEffect, useState } from "react"
import Image from "next/image"
import axios from "axios"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

interface Data {
    id: string;
    upvote: number;
    user: {
        name: string | null;
        image: string | null;
        branch: {
            name: string;
        } | null;
    };
}

export function Candidates() {
    const { contestId } = useContestId()
    const session = useSession()
    const [error, setError] = useState("")
    const [data, setData] = useState<Data[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [votedFor, setVotedFor] = useState<string | null>(null)
    const [isVoted, setIsVoted] = useState<boolean>(false)
    
    useEffect(() => {

        const fetchParticipants = async () => {
            if (!session || !session.data) {
                return
            }
            setIsLoading(true)
            try {

                const response2 = await axios.post("https://molest-backend.onrender.com/user/getallparticipant",{
                    contestId
                } , {
                    headers: {
                        Authorization: session.data.user.jwtToken
                    }
                })

                console.log("this is the response from the vote component", response2.data.data)

                setData(response2.data.data.participant)
                setIsVoted(response2.data.data.isVoted)
                
            } catch (err) {
                setError("Failed to load participants")
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }
        
        if (contestId) {
            fetchParticipants()
        }
    }, [contestId, session.data])
    
    const handleVote = async (participantId: string) => {

        const toastId = toast.loading("updating")
        try{

            if (!session || !session.data) {
                toast.dismiss(toastId)
                toast.error("you are not logged in")
                return
            }
            setVotedFor(participantId)
            if (isVoted) {
                toast.dismiss(toastId)
                toast.error("you already voted")
                return
            }
    
    
            const response = await axios.post("http://localhost:8001/user/upvote", {
                contestId, 
                participantId
            } , {
                headers:{
                    Authorization: session.data.user.jwtToken
                }
            })

            const data = response.data.isVoted
            toast.dismiss(toastId)
            toast.success("voted successfully")
            setIsVoted(data)
            return
        }catch(e){
            console.log(e)
            toast.dismiss(toastId)
            toast.error("something went wrong")
            return
        }
    }
    
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
            </div>
        )
    }
    
    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        )
    }
    
    if (!data || data.length === 0) {
        return (
            <div className="text-center py-8 px-4">
                <h3 className="text-xl font-medium mb-2">No participants yet</h3>
                <p className="text-gray-600">Be the first to join this contest!</p>
            </div>
        )
    }
    
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.map((participant, index) => (
                <div key={participant.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all">
                    <div className="p-5">
                        {/* Position Badge */}
                        <div className="absolute -mt-3 -ml-3 w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold">
                            {index + 1}
                        </div>
                        
                        {/* Participant Info */}
                        <div className="flex flex-col items-center pt-4">
                            {participant.user.image ? (
                                <div className="w-20 h-20 mb-3 relative rounded-full overflow-hidden">
                                    <Image 
                                        src={participant.user.image}
                                        alt={participant.user.name || "Participant"}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-20 h-20 mb-3 rounded-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-2xl text-gray-600">
                                        {participant.user.name?.charAt(0) || "?"}
                                    </span>
                                </div>
                            )}
                            
                            <h3 className="text-xl font-semibold mb-1 text-center">
                                {participant.user.name || "Anonymous"}
                            </h3>
                            
                            {participant.user.branch?.name && (
                                <p className="text-gray-600 mb-2 text-sm">
                                    {participant.user.branch.name}
                                </p>
                            )}
                            
                            {/* Vote Stats */}
                            <div className="flex items-center justify-center mb-4 mt-2">
                                <div className="px-3 py-1 rounded-full bg-gray-100 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                    </svg>
                                    <span className="font-medium">{participant.upvote}</span>
                                    <span className="ml-1 text-gray-600 text-sm">votes</span>
                                </div>
                            </div>
                            
                            {/* Vote Button */}
                            <button
                                onClick={() => handleVote(participant.id)}
                                disabled={isVoted}
                                className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                                    isVoted
                                        ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                                        : "bg-yellow-400 hover:bg-yellow-500 text-black"
                                }`}
                            >
                                {votedFor === participant.id ? "Voted" : "Vote"}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}