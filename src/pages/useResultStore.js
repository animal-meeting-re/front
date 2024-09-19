import { create } from "zustand";

const useResultStore = create(set => ({
    userGender : '',
    animal : '',
    setUserGender: userGender => set({ userGender }),
    setAnimal: animal => set({ animal }),
}));

export default useResultStore;