import { create } from "zustand";

interface UserState {
  name: string;
  instituteId: string;
  branchId: string;
  age: string;
  gender: string
  setField: <K extends keyof UserState>(key: K, value: UserState[K]) => void;
}

export const useUserStore = create<UserState>((set) => ({
  name: "",
  instituteId: "",
  branchId: "",
  age: "",
  gender: "",
  setField: (key, value) => set((state) => ({ ...state, [key]: value })),
}));


export const useContestId = create<{contestId: string, setContestId: (value: string) => void }>((set) => ({
  contestId: "",
  setContestId: (value: string) => set({contestId: value})
}))

export const leaderBoardState = create<{isLeaderBoard: boolean , setisLeaderBoard: () => void} >((set) => ({
  isLeaderBoard: false,
  setisLeaderBoard: () => set((prev) => ({isLeaderBoard: !prev.isLeaderBoard}))
}))

