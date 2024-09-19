import { create } from "zustand";
const useProgressStore = create((set) => ({
  progress: [false, false, false],
  pageNum: 0,
  isClickedLast: false,

  setProgress: (index, value) =>
    set((state) => {
      const newProgress = [...state.progress];
      newProgress[index] = value;
      return { progress: newProgress };
    }),
  setPageNum: (newPageNum) => set({ pageNum: newPageNum }),
  setIsClickedLast: (newIsClickedLast) =>
    set({ isClickedLast: newIsClickedLast }),
  //초기화
  reset: () =>
    set({ progress: [false, false, false], pageNum: 0, isClickedLast: false }),
}));

export default useProgressStore;
