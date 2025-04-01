"use server"

import {prisma} from "@/client";

export async function getAllContest(instituteId : string) {
    try{
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
        console.log("this is the data",data)
        return data
    }catch(e) {
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
    }catch(e) {
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
            select:{
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

    }catch(e) {
        console.log(e)
        return

    }
}

export async function createApproval(userId: string, contestId: string) {

    try{

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

    }catch(e) {
        console.log(e)
        return
    }

}