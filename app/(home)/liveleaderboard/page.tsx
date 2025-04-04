"use client"

import { leaderBoardState } from "@/store/state"
import dynamic from "next/dynamic"
import { Instrument_Serif } from "next/font/google"

const LiveBoard = dynamic(() => import("@/app/_components/LiveLeaderBoard"))
const OngoingContest = dynamic(() => import("@/app/_components/OngoingContest"))


const instrument = Instrument_Serif({
    subsets: ['latin'],
    weight: ['400']
})

export default function LiveLeaderBoard() {

    const { isLeaderBoard, setisLeaderBoard } = leaderBoardState()

    return (
        <div className="w-full  py-8 px-4">
            <header className="">
                <h1 className={`${instrument.className} text-5xl mb-2`}>
                    LeaderBoard
                </h1>
                <p className="text-gray-600 font-bold ">View ongoing contest</p>
            </header>
            {
                isLeaderBoard && (
                    <button onClick={setisLeaderBoard} disabled={!isLeaderBoard} className={`mt-4 cursor-pointer ${isLeaderBoard ? "bg-yellow-300" : "bg-gray-50"} py-2 px-5 font-semibold rounded-xl`} >
                        Go back
                    </button>
                )
            }
            {
                isLeaderBoard ? <LiveBoard /> : <OngoingContest />
            }

        </div>
    )
}