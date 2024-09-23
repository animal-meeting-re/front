import { create } from "zustand";
const useApplyStore = create((set) => ({
  //party,meeting
  choiced: "party",
  setChoiced: (newChoiced) => set({ choiced: newChoiced }),
}));

export default useApplyStore;
