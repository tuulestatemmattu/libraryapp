import { create } from 'zustand';
import { FetchedBook } from '../interfaces/Book';
import Profile from '../interfaces/Profile';

interface StoreState {
  token: string | null;
  profile: Profile | null;
  setUser: (token: string, profile: Profile) => void;
  removeUser: () => void;

  location: string;
  setLocation: (location: string) => void;

  books: FetchedBook[];
  setBooks: (books: FetchedBook[]) => void;
  addBook: (book: FetchedBook) => void;
  updateBook: (book: FetchedBook) => void;
}

const useMainStore = create<StoreState>((set) => ({
  token: null,
  profile: null,
  setUser: (token: string, profile: Profile) => set({ token, profile }),
  removeUser: () => set({ token: null, profile: null }),

  location: 'Helsinki',
  setLocation: (location: string) => set((state) => ({ ...state, location })),

  books: [],
  setBooks: (books: FetchedBook[]) => set((state) => ({ ...state, books })),
  addBook: (book: FetchedBook) => set((state) => ({ ...state, books: [...state.books, book] })),
  updateBook: (book: FetchedBook) =>
    set((state) => ({
      ...state,
      books: state.books.map((b) => (b.id === book.id ? book : b)),
    })),
}));

export default useMainStore;
