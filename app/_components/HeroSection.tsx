import { Instrument_Serif } from "next/font/google"
import { CardImage } from "./CardImage"
import Link from "next/link"

const instrument = Instrument_Serif({
    subsets: ['latin'],
    weight: ['400']
})

export function Hero() {
    return (
        <div className="h-full grow flex flex-col items-center pt-20">
            <div className={`${instrument.className} text-6xl text-center`}>
                Vote the most <span className="text-yellow-300">Hottest</span> Guy in your Institute
            </div>
            <CardImage />
            <div className="flex justify-center items-center w-full h-20  md:mt-10">
                <div className="flex justify-between w-80 items-center">
                    <Link href={"/vote"} className="bg-yellow-300 w-32 rounded-full px-2 py-2 text-center font-bold cursor-pointer">
                        Vote
                    </Link>
                    <Link href={"/participate"} className="bg-black text-yellow-300 rounded-full px-4 text-center py-2 font-bold cursor-pointer">
                        Participate Now
                    </Link>
                </div>
            </div>
        </div>
    )
}