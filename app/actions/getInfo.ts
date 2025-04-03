"use server"

import {prisma} from "@/client"
import { getServerSession } from "next-auth"
import { authOptions } from "../lib/auth"
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { stringify } from "querystring"

export async function getCollegeDetails() {
    try {
        const data = await prisma.institute.findFirst({
            where: {
                id: "3e237ea1-24af-466a-9cbe-295096e1ff31"
            },
            select: {
                name: true,
                id: true,
                branch: {
                    select: {
                        name: true,
                        id: true
                    }
                }
            }
        })
        if (!data) {
            return {
                statusCode: 404,
                message: "no college found with this id"
            }
        }
        return {
            statusCode: 200,
            data: {
                collegeName: data.name,
                collegeId: data.id,
                branch: data.branch[0].id,
                branchName: data.branch[0].name
            }

        }
    } catch (e) {
        return {
            statusCode: 400,
            message: "something went wrong"
        }
    }
}

export async function updateUserDetails(instituteId: string , branchId: string, name: string, age: number, gender: string) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return
        }

        console.log(instituteId)

        const updatedUser = await prisma.user.update({
            where: {
                id: session.user.id
            },
            data: {
                instituteId: instituteId,
                branchId: branchId,
                name: name,
                age: Math.abs(age),
                Gender: gender === "male" ? "MALE" : "FEMALE"
            }
        })
        return {
            statusCode: 200,
            updatedUserId: updatedUser.id

        }
    } catch (e) {
        console.log(e)
        return
    }

}

export async function getContest(institueId: string) {
    try {

        const allContest = await prisma.contest.findMany({
            where: {
                instituteId: institueId,
                status: "STARTED"
            },
            select: {
                id: true,
                name: true,
                category: true
            }
        })

        return allContest

    } catch (e) {
        return "something went wrong"
    }
}

export async function getParticipant(contestId: string) {
    try {
        const allParticipant = await prisma.participant.findMany({
            where: {
                contestId: contestId,
                status: "APPROVE"
            },
            select: {
                id: true,
                upvote: true,
                user: {
                    select: {
                        image: true,
                        name: true,
                        branch: {
                            select: {
                                name: true,
                            }
                        }
                    }
                }
            }
        })

        return allParticipant

    } catch (e) {
        console.log(e)
        return

    }

}

const s3Client = new S3Client({
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.ACCESS_KEY || "",
        secretAccessKey: process.env.SECRET_ACCESS_KEY || ""
    }
})

export async function getPresignedUrl(name: string) {
    
    const session = await getServerSession(authOptions)

    if (!session) {
        return
    }

    try {
        const command = new PutObjectCommand({
            Bucket: "photorate",
            Key: `path/${session.user.name}-${session.user.id}`,
            ContentType: name
        })
        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        return signedUrl
    } catch (e) {
        console.log(e)
        throw new Error
    }

}

export async function updateUser(userId: string, imageUrl: string) {
    try {
        const updateUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                image: imageUrl
            }
        })

        return updateUser.id
    } catch (e) {
        console.log(e)
        throw new Error
    }
}

export async function getUserInfo() {

    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return
        }
        const userId = session.user.id

        const user = await prisma.user.findFirst({
            where: {
                id: userId
            },
            select: {
                name: true,
                age: true,
                institute: {
                    select: {
                        name: true,
                    }
                },
                branch: {
                    select: {
                        name: true
                    }
                },
                image: true
            }
        })

        console.log(user)

        return user

    } catch (e) {
        console.log(e)
        throw new Error
    }


}

export async function getCollege() {
    try {

        const response = await prisma.institute.findMany({
            select: {
                id: true, 
                name: true
            }
        })

        if (!response) {
            return []
        }
        return response

    }catch(e) {
        console.log(e)
        throw new Error
    }
}

export async function getBranch(institueId: string) {
    try {

        const response = await prisma.institute.findFirst({
            where: {
                id: institueId
            },
            select :{
                branch: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })

        return response?.branch

    }catch(e) {
        console.log(e)
        throw new Error
    }
}

export async function updateImage (imageUrl: string) {
    try {

        const session = await getServerSession(authOptions)

        if (!session) {
            return
        }

        const existingImage = await prisma.user.findFirst({
            where: {
                id: session.user.id
            },
            select: {
                image: true
            }
        })

        console.log(existingImage)

        if (existingImage) {
            console.log("image exists karti hai")
            return
        }


        const response = await prisma.user.update({
            where:{
                id: session.user.id
            },
            data:{
                image: imageUrl
            }
        })
        return response

    }catch(e) {
        return

    }
}