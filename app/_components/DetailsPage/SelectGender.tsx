"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { useUserStore } from "@/store/state"

export function Gender() {

    const {gender , setField} = useUserStore()

    return(
        <div className="space-y-2">
          <label className="text-sm font-medium">Gender</label>
          <Select  onValueChange={(value) => setField("gender", value)} value={gender}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

    )
}