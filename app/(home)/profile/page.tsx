"use client"

import { useSession } from "next-auth/react"
import Image from "next/image"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import axios from "axios"
import { getPresignedUrl, getUserInfo, updateUser } from "@/app/actions/getInfo"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"


interface UserData {
    name: string,
    instituteName: string,
    branchName: string
    image:string
}

export default function Profile() {
    const inputRef = useRef<HTMLInputElement>(null)
    const session = useSession()
    const [imageUrl, setImageUrl] = useState(session.data?.user.image || "")
    const [file, setFile] = useState<File>()
    const [userData, setUserData] = useState<UserData>({
        name: "",
        instituteName:"",
        branchName:"",
        image: ""
    })
    const [loading, setIsLoading] = useState(false)
    // console.log(session.data?.user.image)
    console.log(session)

    useEffect(() => {
        const main = async () => {
            
            const data = await getUserInfo()
            console.log(data)
            if (data) {
                setUserData({
                    name: data.name!,
                    instituteName: data.institute!.name,
                    branchName: data.branch!.name,
                    image: data.image!
                })
                setImageUrl(data.image!)
            }

        }
        main()
    },[])

    async function handleClick() {
        if (inputRef.current && !session.data?.user.image) {
            inputRef.current.click()
        }
    }

    async function previewLoad(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            const type = e.target.files[0]

            if (!type.type.startsWith("image/")) {
                return 
            }

            const reader = new FileReader()
            reader.onload = () => {
                setImageUrl(reader.result as string)
            }

            reader.readAsDataURL(type)
            setFile(e.target.files[0])
        }
    }

    async function uploadPhoto() {

        const toastId = toast.loading("uploading...")
        try {
            if (!file || userData?.image) {
                toast.dismiss(toastId)
                toast.error("file is not uploaded")
                return

            }

            const signedUrl = await getPresignedUrl(file.type)
            if (!signedUrl) {
                return
            }
            
            const response = await axios.put(signedUrl, file, {
                headers: {
                    "Content-Type": "image/jpeg"
                }
            })

            const imageUrl =  `https://d12hk4zd0jmtng.cloudfront.net/path/${session.data?.user.name}-${session.data?.user.id}`

            const updateImage = await updateUser(session.data?.user.id || "",  imageUrl)
            setImageUrl(imageUrl)
            setUserData((prev) => {
                return {
                    ...prev,
                    image: imageUrl
                }
            })

            await session.update({imageUrl: imageUrl})
            toast.dismiss(toastId)
            toast.success("uploaded")
            return
        } catch(e) {
            console.log(e)
            toast.dismiss(toastId)
            toast.error("something went wrong")
            return
        }
    }

    return (
        <div className="mt-6 flex flex-col grow items-center bg-gray-50 p-6 max-w-md mx-auto rounded-xl shadow-md">
            <div className="flex flex-col items-center w-full mb-6">
                {(!imageUrl && !session.data?.user.image) ? (
                    <div 
                        className="h-40 w-40 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer border-2 border-yellow-400" 
                        onClick={handleClick}
                    >
                        <span className="text-4xl text-gray-400">+</span>
                    </div>
                ) : (
                    <div className="relative   ">

                        {(userData?.image || imageUrl) && (
                              <Image 
                              src={userData?.image || imageUrl} 
                              alt="Profile" 
                              width={100} 
                              height={100} 
                              className=" w-[150px] h-[150px] object-cover rounded-full border-2 border-yellow-400" 
                              onClick={handleClick}
                          />
                        )}
                      
                        <div 
                            className="absolute bottom-0 right-0 bg-yellow-400 p-2 rounded-full cursor-pointer shadow-md"
                            onClick={handleClick}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-black" viewBox="0 0 16 16">
                                <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z"/>
                                <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                            </svg>
                        </div>
                    </div>
                )}
                <input  type="file" onChange={(e) => previewLoad(e)} className="hidden" ref={inputRef} accept="image/*" />
                
                <h2 className="mt-4 text-xl font-bold text-gray-800">{userData?.name}</h2>
            </div>

            <div className="w-full space-y-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Institute Name</label>
                    <div className="p-2 bg-gray-100 rounded-md text-gray-800">{userData?.instituteName}</div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Branch</label>
                    <div className="p-2 bg-gray-100 rounded-md text-gray-800">{userData?.branchName}</div>
                </div>
            </div>

            <Button 
                onClick={uploadPhoto} 
                disabled={(imageUrl && userData?.image) ? true : false} 
                className={`${!imageUrl ? "bg-gray-300 cursor-not-allowed" : "bg-yellow-400 hover:bg-yellow-500"} text-black font-medium rounded-lg w-full px-4 py-3 transition-colors flex items-center justify-center`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="mr-2" viewBox="0 0 16 16">
                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                    <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
                </svg>
                {loading ? "uploading" : "Upload Photo"}
            </Button>
        </div>
    )
}