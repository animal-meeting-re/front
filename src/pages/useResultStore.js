import { create } from "zustand";

const useResultStore = create((set) => ({
  userGender: "FEMALE",
  phonNum: "01053242164",
  animal: "강아지",
  setUserGender: (userGender) => set({ userGender }),
  setPhoneNumber: (phonNum) => set({ phonNum }),
  setAnimal: (animal) => set({ animal }),
}));

export default useResultStore;
