"use client"

import { Candidates } from "@/app/_components/VotePage/CandidateCard";
import { OngoingContest } from "@/app/_components/VotePage/contest";
import { leaderBoardState } from "@/store/state";

export default function Vote() {

    const { isLeaderBoard, setisLeaderBoard } = leaderBoardState()

    return (
        <div className="pt-2 pl-2 ">
            {isLeaderBoard &&
                <div onClick={() => setisLeaderBoard()} className="py-2 bg-yellow-400 w-24 text-center cursor-pointer font-semibold mb-4 mt-3 rounded-full px-3">
                    Go Back
                </div>}
            {
                isLeaderBoard ? <Candidates /> : <OngoingContest />
            }

        </div>
    )
}