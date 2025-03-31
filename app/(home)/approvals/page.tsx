"use client"

import { getAprroval } from "@/app/actions/contest"
import { $Enums } from "@prisma/client"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

interface Data {
    id: string;
    status: $Enums.ApprovalStatus;
    contest: {
        id: string;
        name: string;
        endDate?: Date;
    };
}

export default function Approval() {
    const [data, setData] = useState<Data[]>([{
        id:"asdasd",
        status: "APPROVE",
        contest: {
            id:"asdasd",
            name: "hottest guy",
            endDate: new Date()
        }
    }])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const session = useSession()

    useEffect(() => {
        async function fetchApprovals() {
            setIsLoading(true)
            try {
                if (!session || !session.data || !session.data.user.id) {
                    setError("You must be logged in to view approvals")
                    setIsLoading(false)
                    return
                }

                const response = await getAprroval(session.data.user.id)

                if (!response) {
                    setError("Failed to load approvals")
                    setIsLoading(false)
                    return
                }

                setData(response)
                setError("")
            } catch (e) {
                console.error(e)
                setError("An error occurred while fetching approvals")
            } finally {
                setIsLoading(false)
            }
        }

        if (session.status !== "loading") {
            fetchApprovals()
        }
    }, [session.data, session.status])

    const getStatusBadge = (status: $Enums.ApprovalStatus) => {
        switch (status) {
            case "APPROVE":
                return (
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Approved
                    </span>
                )
            case "CANCELLED":
                return (
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Cancelled
                    </span>
                )
            default:
                return (
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                    </span>
                )
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-64 flex items-center justify-center">
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
            <div className="text-center py-12 bg-gray-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-xl font-medium text-gray-900">No approvals found</h3>
                <p className="mt-1 text-gray-500">You don't have any contest approvals to review yet.</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Contest Approvals</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Review the status of your contest approval requests
                </p>
            </div>
            
            <ul className="divide-y divide-gray-200">
                {data.map((item) => (
                    <li key={item.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                                <h4 className="text-lg font-medium text-gray-900 truncate">
                                    {item.contest.name}
                                </h4>
                                <div className="mt-2 flex items-center text-sm text-gray-500">
                                    <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                    {item.contest.endDate ? (
                                        <span>Ends on {new Date(item.contest.endDate).toLocaleDateString()}</span>
                                    ) : (
                                        <span>No end date specified</span>
                                    )}
                                </div>
                            </div>
                            <div className="ml-5 flex-shrink-0">
                                {getStatusBadge(item.status)}
                            </div>
                        </div>
                        
                    </li>
                ))}
            </ul>
        </div>
    )
}