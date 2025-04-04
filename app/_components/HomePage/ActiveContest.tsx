"use server"

import {prisma} from "@/client";
import Link from "next/link"

export default async function ActiveContest() {

    const response = await prisma.contest.findMany({
        where: {
            status: "STARTED"
        },
        select: {
            id: true
        }
    })

    return (
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-xl font-semibold mb-1">Active Contests</h3>
                    <p className="text-gray-500">{response && response.length} contest</p>
                </div>
            </div>
            <Link href="/participate" className="mt-4 inline-block text-sm font-medium text-yellow-600 hover:text-yellow-700">
                View all active contests →
            </Link>
        </div>
    )

}
