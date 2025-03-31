import { useState } from "react"

export function ToggleButton() {

    const [state , setState] = useState< 1 | 2>(1)
    
        const handleClick = (newState: 1| 2) => {
            if (newState === 1) {
                setState(1)
            }else {
                setState(2)
            }
        }
    

    return (
        <div className="flex pl-2 pt-2 space-x-4 ">
                <div onClick={() => handleClick(1)} className={`cursor-pointer font-semibold w-24 py-1 text-center rounded-xl ${state === 1 ? "bg-yellow-300" : "bg-gray-300"}`}>
                    Ongoing
                </div>
                <div onClick={() => handleClick(2)} className={`cursor-pointer font-sm font-semibold bg-gray-300 w-28 py-1 text-center rounded-xl ${state === 2 ? "bg-yellow-300": "bg-gray-300"}`}>
                    Completed
                </div>
            </div>
    )
}