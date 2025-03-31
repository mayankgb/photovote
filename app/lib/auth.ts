import prisma from "@/client";
import { Account, NextAuthOptions, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import Google from "next-auth/providers/google";
import jwt from "jsonwebtoken"
import { NextConfig } from "next";


export const authOptions = {
    providers: [
        Google({
            clientId: process.env.CLIENT_ID!,
            clientSecret: process.env.CLIENT_SECRET!
        })
    ],
    secret: process.env.NEXTAUTH_SECRET!,
    callbacks: {
        async signIn({ user, account }: { user: User | null, account: Account | null }) {
            if (account?.provider === 'google') {
                if (!user) {
                    console.log("user is not present")
                    return false
                } else {
                    try {
                        const existingUser = await prisma.user.findUnique({
                            where: {
                                email: user.email
                            },
                            select: {
                                id: true,
                                instituteId: true,
                                image: true,
                                name: true,
                                Gender: true
                            }
                        })
                        if (!existingUser) {
                            const newUser = await prisma.user.create({
                                data: {
                                    email: user.email,
                                    role: "USER",
                                },
                                select: {
                                    id: true,
                                    instituteId: true,
                                    image: true,
                                    name: true,
                                }
                            })
                            const token = jwt.sign({ id: newUser.id, instituteId: newUser.instituteId }, "addasd")
                            user.jwtToken = token
                            user.role = "USER"
                            user.id = newUser.id
                            user.instituteId = newUser.instituteId
                            user.image = newUser.image ?? undefined
                            user.name = newUser.name
                            user.gender = null
                        } else {
                            const token = jwt.sign({ id: existingUser.id, instituteId: existingUser.instituteId }, "addasd")
                            user.role = "USER"
                            user.instituteId = existingUser.instituteId
                            user.id = existingUser.id
                            user.jwtToken = token
                            user.image = existingUser.image ?? undefined
                            user.name = existingUser.name
                            user.gender = existingUser.Gender ? (existingUser.Gender === "MALE" ? "male" : "female") : null 
                        }
                        return true
                    } catch (e) {
                        console.log(e)
                        return false

                    }



                }
            } else {
                return false
            }
        },
        jwt: async ({ token, user, trigger, session }: { token: JWT, user: User, trigger?: "signIn" | "signUp" | "update", session?: any }) => {
            // console.log(user)
            if (user) {
                // console.log("this is the user", user)
                token.role = user.role
                token.instituteId = user.instituteId
                token.id = user.id
                token.jwtToken = user.jwtToken
                token.name = user.name
                token.gender = user.gender
                token.image = user.image
                // console.log("this is the token ", token)

            }

            // console.log("dekhle token", token)
            if (trigger === "update" && session) {
                if (session.imageUrl) {
                    token.image = session.imageUrl
                } else {
                    token.instituteId = session.instituteId
                    token.gender = session.gender
                    const newToken = jwt.sign({ userId: token.id, instiuteId: session.instituteId }, "addasd")
                    token.jwtToken = newToken
                    token.name = session.name
                    // console.log("this is the institueId", session)
                }
            }
            console.log(trigger)

            return token
        },
        session: async ({ session, token }: { session: Session, token: JWT }) => {
            // console.log("this run many times")

            const newSession = session as Session
            newSession.user.jwtToken = token.jwtToken as string
            newSession.user.role = token.role as string
            newSession.user.instituteId = token.instituteId as string | null
            newSession.user.id = token.id as string
            newSession.user.image = token.image as string
            newSession.user.name = token.name as string ?? null
            newSession.user.gender = token.gender as string ?? null
            return newSession

        }
    },
    pages: {
        signIn: "/signin",
    },

    cookies: {
        sessionToken: {
          name: "next-auth.session-token",
          options: {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            secure: process.env.NODE_ENV === "production",
          },
        },
      },
      
}