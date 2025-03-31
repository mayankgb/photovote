"use client"

import { Input } from "@/components/ui/input"
import { useUserStore } from "@/store/state"
import { Gender } from "../_components/DetailsPage/SelectGender"
import { SelectInstitute } from "../_components/DetailsPage/SelectInstitute"
import { SelectBranch } from "../_components/DetailsPage/SelectBranch"

import { Instrument_Serif } from "next/font/google"
import { updateUserDetails } from "../actions/getInfo"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { SelectAge } from "../_components/DetailsPage/SelectAge"
import { useRouter } from "next/navigation"

const instrument = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400']
})

export default function ProfileForm() {

  const session = useSession()
  const router = useRouter()
  console.log(session)

  const { name, age, gender, instituteId, branchId, setField } = useUserStore()

  async function handleSubmit() {

    const toastId = toast.loading("updating your data")
    try {
      if (!name || !age || !gender || !instituteId || !branchId) {
        return
      }
      const response = await updateUserDetails(instituteId, branchId, name, parseInt(age), gender)
      await session.update({ instituteId: instituteId, name: name, gender: gender })

      toast.dismiss(toastId)
      toast.success("successfully updated")

      router.push("/home")
    } catch (e) {
      console.log("this is the error",e)
      toast.dismiss(toastId)
      toast.error("something went wrong please try after some time")
    }
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="flex items-center justify-end flex-col space-y-4 pb-2 h-full w-[70%] md:w-[40%]">
        <div className="w-full">
          <div className="font-bold text-center text-sm">
            PhotoVote
          </div>
          <div className={`${instrument.className} text-4xl text-center`}>
            One Step More
          </div>
        </div>

        <div className="h-fit flex flex-col w-full md:w-[70%]  items-center bg-gray-50 p-6  rounded-xl shadow-md">


          <div className="w-full space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setField("name", e.target.value)}
              />
            </div>

            <SelectAge/>
            {/* {Gender select} */}
            <Gender />

            {/* {selectinstitute} */}
            <SelectInstitute />
            <SelectBranch />


            <button
              onClick={handleSubmit}
              disabled={(!name || !age || !gender || !instituteId || !branchId)}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-lg mt-6 transition-colors"
            >
              Save Profile
            </button>
          </div>
        </div>


      </div>

    </div>
  )
}