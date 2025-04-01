
import Image from 'next/image';
import mradul from "@/public/mradul.jpg"
import sid from "@/public/sidhart.png"

export function CardImage() {
    return (
        <div className="h-[55%] flex items-center justify-center w-full py-3  md:mt-15">
            <div className="relative w-[40%] h-full  flex items-center justify-center">
                <Image src={mradul} alt='icon' className="bg-yellow-100 object-cover z-0 absolute rounded-lg md:h-full h-[60%] w-28 md:w-52 transform -rotate-12 left-1/2 -translate-x-[150%]">
                    {/* Left Card Content */}
                </Image>
                <Image src={"https://d12hk4zd0jmtng.cloudfront.net/path/ASHNEEL SONI"} unoptimized quality={100} width={20} height={20} alt='icon' className=" z-10 object-cover absolute rounded-lg md:h-full h-[60%] w-28 md:w-52 left-1/2 -translate-x-1/2 -translate-y-[8%]">
                    {/* Middle Card Content */}
                </Image>
                <Image src={sid} alt='icon' className="bg-black object-cover z-0 absolute rounded-lg md:h-full h-[60%] w-28 md:w-52 transform rotate-12 left-1/2 translate-x-[50%]">
                    {/* Right Card Content */}
                </Image>
            </div>
        </div>
    )
}