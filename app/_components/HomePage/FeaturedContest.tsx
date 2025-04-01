import { authOptions } from "@/app/lib/auth";
import {prisma} from "@/client";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function FeaturedContest() {

    const session = await getServerSession(authOptions)

    if (!session || !session.user.instituteId) {
        return
    }

    const response = await prisma.contest.findMany({
        where:{
            instituteId: session.user.instituteId
        },
        take: 3,
        select: {
            id:true,
            name: true,
            endDate: true,
            _count: {
                select: {participant: true}
            }
        }
    })


    return(
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Contest Card 1 */}
                    {(response && response.length > 0)? response.map((data) => (
                        <div key={data.id} className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                        <div className="h-40 bg-gradient-to-r from-yellow-400 to-yellow-600 relative">
                            <div className="absolute top-4 left-4 bg-black text-white text-xs font-bold px-2 py-1 rounded">
                                POPULAR
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-semibold mb-2">{data.name}</h3>
                            <p className="text-gray-600 text-sm mb-4">Ends on {new Date(data.endDate).toLocaleDateString("en-GB", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })} </p>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">{data._count.participant} participants</span>
                                <Link href="/contests/photography" className="bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-medium py-2 px-4 rounded-lg transition-colors">
                                    Join Now
                                </Link>
                            </div>
                        </div>
                    </div>
                    )):(
                        <div>
                            No Active Contest right now
                        </div>
                    )
                    }
                    
                    {/* Contest Card 2 */}
                    {/* Contest Card 3 */}
                    
                </div>
    )
}