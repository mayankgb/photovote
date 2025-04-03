import { authOptions } from "@/app/lib/auth"
import {prisma} from "@/client"
import { getServerSession } from "next-auth"

export default async function ViewAchievements() {

    const session = await getServerSession(authOptions)

    if (!session) {
        return
    }

    const response = await prisma.position.findMany({
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
                        <div className="p-3 bg-black rounded-lg mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-1">Achievements</h3>
                            <p className="text-gray-500">{response && response.length} contest won</p>
                        </div>
                    </div>
                </div>
    )
}