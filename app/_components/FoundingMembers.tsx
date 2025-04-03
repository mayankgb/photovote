import { Instrument_Serif } from "next/font/google"
import mradul from "@/public/mradul.jpg"
import mayank from "@/public/mayank.jpg"
import Image from "next/image"
import Link from "next/link"


const instrument = Instrument_Serif({
    subsets: ['latin'],
    weight: ['400']
})

export function FoundingMembers() {
    return (
        <div className={`flex h-70 w-full flex-col items-center `}>
            <div className={`${instrument.className} text-5xl mt-10`}>
                Founding Members
            </div>
            <div  className="flex flex-col md:flex-row justify-between items-center w-[60%] h-56 md:h-44">
                <div className="flex w-60  h-28 justify-between items-center">
                    <Image src={mayank} alt="icon" className="w-24 object-cover h-24 rounded-full bg-yellow-400">

                    </Image>
                    <div className=" h-13 flex flex-col justify-between ">
                        <div className="font-bold">
                        Mayank Agrawal
                        </div>
                        <Link className="underline select-none" href={"https://www.linkedin.com/in/mayank-agrawal-b3a312299/"} >
                            Linkedin
                        </Link>
                        
                    </div>

                </div>
                <div className="flex w-60 h-28  gap-x-5 items-center">
                    <Image src={mradul} alt="icon" className="w-24 h-24 object-cover rounded-full bg-yellow-400">

                    </Image>
                    <div className=" h-13 flex flex-col justify-between ">
                        <div className="font-bold">
                        Mradul Bisen
                        </div>
                        <Link className="underline select-none" href={"https://www.linkedin.com/in/mradul-bisen-008147289/"} >
                            Linkedin
                        </Link>
                        
                    </div>

                </div>

            </div>

        </div>
    )
}