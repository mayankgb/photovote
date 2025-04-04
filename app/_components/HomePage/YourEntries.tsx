"use server"

import { authOptions } from "@/app/lib/auth"
import {prisma} from "@/client"
import { getServerSession } from "next-auth"
import Link from "next/link"

export default async function YourEntries() {

    const session = await getServerSession(authOptions)
    console.log(session)

    if (!session) {
        return (
            <div>
                adsasds
            </div>
        )
    }

    const response = await prisma.participant.findMany({
        where: {
            userId: session.user.id
        },
        select: {
            id: true
        }
    })

    return (
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                    <div className="flex items-center">
                        <div className="p-3 bg-gray-100 rounded-lg mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-1">Your Entries</h3>
                            <p className="text-gray-500">{response && response.length} submissions</p>
                        </div>
                    </div>
                    <Link href="/approvals" className="mt-4 inline-block text-sm font-medium text-yellow-600 hover:text-yellow-700">
                        Manage your entries →
                    </Link>
                </div>
    )
}