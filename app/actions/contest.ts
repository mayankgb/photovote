"use server"

import { prisma } from "@/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";

export async function getAllContest(instituteId: string) {
    try {
        const data = await prisma.contest.findMany({
            where: {
                instituteId: instituteId,
                status: "STARTED"
            },
            select: {
                id: true,
                name: true,
                endDate: true,
                category: true
            }
        })
        console.log("this is the data", data)
        return data
    } catch (e) {
        console.log(e)
        return
    }
}

export async function getNonParticipatedContest(instituteId: string, userId: string) {
    try {
        const data = await prisma.contest.findMany({
            where: {
                instituteId: instituteId,
                status: "CREATED",
                participant: {
                    none: {
                        userId: userId
                    }

                }
            },
            select: {
                id: true,
                name: true,
                endDate: true,
                category: true
            }
        })
        return data
    } catch (e) {
        console.log(e)
        return
    }
}


export async function getAprroval(userId: string) {

    try {
        const response = await prisma.participant.findMany({
            where: {
                userId: userId
            },
            select: {
                id: true,
                contest: {
                    select: {
                        name: true,
                        id: true,
                        endDate: true
                    }
                },
                status: true
            }
        })

        return response

    } catch (e) {
        console.log(e)
        return

    }
}

export async function createApproval(userId: string, contestId: string) {

    try {

        const existingParticipant = await prisma.participant.findFirst({
            where: {
                userId: userId,
                contestId: contestId
            }
        })

        if (existingParticipant) {
            return
        }

        const newParticipant = await prisma.participant.create({
            data: {
                userId: userId,
                contestId: contestId,
                status: "PENDING"
            }
        })

        return newParticipant.id

    } catch (e) {
        console.log(e)
        return
    }

}


export async function getCompeletedContest() {
    try {

        const session = await getServerSession(authOptions)

        if (!session || !session.user.instituteId) {
            return
        }

        const data = await prisma.contest.findMany({
            where: {
                instituteId: session.user.instituteId,
                status: "ENDED"
            },
            select: {
                id: true,
                name: true,
                status: true,
                category: true
            }
        })

        if (data) {
            return data
        }

        return

    } catch (e) {
        console.log(e)
        return
    }
}


export async function getWinners(contestId: string) {
    try {

        const data = await prisma.position.findFirst({
            where: {
                contestId: contestId,
                contest: {
                    status: "ENDED"
                },
                rank: 1
            },
            select: {
                participant: {
                    select: {
                        upvote: true
                    }
                },
                user: {
                    select: {
                        name: true,
                        image: true
                    }
                },
                contest: {
                    select: {
                        name: true
                    }
                }
            }
        })

        const participantCount = await prisma.contest.findFirst({
            where: {
                id: contestId
            },
            select: {
                _count: { select: { participant: true } }
            }
        })

        if (data && participantCount?._count) {
            return {
                message: "we got the winners",
                data,
                count: participantCount._count,
                status: 200
            }
        }

        return {
            message: "No winners with this Contest found or Contest does not exists",
            status: 400
        }

    } catch (e) {
        console.log(e)
        return {
            message: "something went wrong",
            status: 500
        }
    }
}

export async function getUserparticipation() {
    try {

        const session = await getServerSession(authOptions)

        if (!session || !session.user.instituteId) {
            return {
                message: "you are not logged in",
                status: 403
            }

        }

        const data = await prisma.position.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: {
                contest: {
                    endDate: "desc"
                }
            },
            select: {
                rank: true,
                contest: {
                    select: {
                        id: true,
                        status: true,
                        name: true,
                        endDate: true,

                    }
                }

            }
        })
        if (data) {
            return {
                message: "data found",
                data: data,
                status: 200
            }
        }

        return {
            message: "You didn't participate in any contest",
            status: 200
        }

    } catch (e) {
        console.log(e)
        return {
            message: "something went wrong",
            status: 500
        }
    }
}