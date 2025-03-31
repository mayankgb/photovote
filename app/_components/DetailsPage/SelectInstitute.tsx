"use client"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
import { useUserStore } from "@/store/state"
import { useEffect, useState } from "react"
import { getCollege } from "@/app/actions/getInfo"

export function SelectInstitute() {

    const {instituteId , setField} = useUserStore()
    const [instituteSelectOpened, setInstituteSelectOpened] = useState(false)
    const [institutes, setInstitutes] = useState<{ id: string; name: string }[]>([])
    const [isLoadingInstitutes, setIsLoadingInstitutes] = useState(false)

    useEffect(() => {
        if (instituteSelectOpened && institutes.length === 0) {
          fetchInstitutes()
        }
      }, [instituteSelectOpened])

    const handleInstituteChange = (value: string) => {
        setField("instituteId", value)
        // setBranchId("")
      }

      const fetchInstitutes = async () => {
        setIsLoadingInstitutes(true)
        try {
          // Replace with your actual API endpoint
          const response = await getCollege()
          setInstitutes(response)
        } catch (error) {
          console.error('Error fetching institutes:', error)
          // Mock data for demonstration purposes
          setInstitutes([
            { id: "1", name: "MIT Institute of Technology" },
            { id: "2", name: "Harvard University" },
            { id: "3", name: "Stanford University" },
            { id: "4", name: "Oxford University" }
          ])
        } finally {
          setIsLoadingInstitutes(false)
        }
      }

    return (
        <div className="space-y-2">
          <label className="text-sm font-medium">Institute</label>
          <Select 
            onValueChange={handleInstituteChange} 
            value={instituteId}
            onOpenChange={setInstituteSelectOpened}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select institute" />
            </SelectTrigger>
            <SelectContent>
              {isLoadingInstitutes ? (
                <div className="px-2 py-4 text-center">Loading...</div>
              ) : institutes.length > 0 ? (
                institutes.map((institute) => (
                  <SelectItem key={institute.id} value={institute.id}>
                    {institute.name}
                  </SelectItem>
                ))
              ) : (
                <div className="px-2 py-4 text-center">No institutes found</div>
              )}
            </SelectContent>
          </Select>
        </div>
    )
}