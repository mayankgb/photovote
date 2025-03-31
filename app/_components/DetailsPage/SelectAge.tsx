"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { useUserStore } from "@/store/state"

export function SelectAge() {

    const {age , setField} = useUserStore()

    return(
        <div className="space-y-2">
          <label className="text-sm font-medium">Age</label>
          <Select  onValueChange={(value) => setField("age", value)} value={age}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select age" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="18">18</SelectItem>
              <SelectItem value="19">19</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="21">21</SelectItem>
              <SelectItem value="22">22</SelectItem>
              <SelectItem value="23">23</SelectItem>
              <SelectItem value="24">24</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="26">26</SelectItem>
            </SelectContent>
          </Select>
        </div>

    )
}