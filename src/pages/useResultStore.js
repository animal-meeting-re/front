import { create } from "zustand";

const useResultStore = create((set) => ({
  userGender: "",
  phonNum: "",
  animal: "",
  setUserGender: (userGender) => set({ userGender }),
  setPhoneNumber: (phonNum) => set({ phonNum }),
  setAnimal: (animal) => set({ animal }),
}));

export default useResultStore;
