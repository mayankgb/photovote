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
import { getBranch } from "@/app/actions/getInfo"

export function SelectBranch() {

    const {instituteId,branchId , setField} = useUserStore()

    const [branches, setBranches] = useState<{ id: string; name: string }[]>([])
  
  const [isLoadingBranches, setIsLoadingBranches] = useState(false)
  
  const [branchSelectOpened, setBranchSelectOpened] = useState(false)


    useEffect(() => {
        if (branchSelectOpened && instituteId) {
          fetchBranches(instituteId)
        }
      }, [branchSelectOpened, instituteId])


      const fetchBranches = async (instituteId: string) => {
        setBranches([])
        setIsLoadingBranches(true)
        try {
          // Replace with your actual API endpoint
          const response = await getBranch(instituteId)
          if (!response) {
            return
          }
          setBranches(response)
        } catch (error) {
          console.error('Error fetching branches:', error)
          // Mock data for demonstration purposes
          setBranches([
            { id: "1", name: "Computer Science Engineering" },
            { id: "2", name: "Electrical Engineering" },
            { id: "3", name: "Mechanical Engineering" },
            { id: "4", name: "Civil Engineering" }
          ])
        } finally {
          setIsLoadingBranches(false)
        }
      }

    return (
        <div className="space-y-2">
        <label className="text-sm font-medium">Branch</label>
        <Select 
          onValueChange={(value) => setField("branchId", value)} 
          value={branchId} 
          disabled={!instituteId}
          onOpenChange={setBranchSelectOpened}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select branch" />
          </SelectTrigger>
          <SelectContent>
            {!instituteId ? (
              <div className="px-2 py-4 text-center">Select an institute first</div>
            ) : isLoadingBranches ? (
              <div className="px-2 py-4 text-center">Loading...</div>
            ) : branches.length > 0 ? (
              branches.map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
                </SelectItem>
              ))
            ) : (
              <div className="px-2 py-4 text-center">No branches found</div>
            )}
          </SelectContent>
        </Select>
      </div>
    )
}