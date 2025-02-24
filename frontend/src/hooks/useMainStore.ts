import { create } from "zustand";

interface StoreState {
    location: string,
    setLocation: (location: string) => void,
}

const useMainStore = create<StoreState>((set) => ({
    location: "Helsinki",

    setLocation: (location: string) => set(
        (state) => ({ ...state, location })
    ),
}));

export default useMainStore;