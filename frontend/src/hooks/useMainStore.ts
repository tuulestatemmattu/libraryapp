import { create } from 'zustand';
import { FetchedBook } from '../interfaces/Book';
import { FetchedTag } from '../interfaces/Tags';

interface StoreState {
  location: string;
  setLocation: (location: string) => void;

  tags: FetchedTag[];
  setTags: (tags: FetchedTag[]) => void;
  addTag: (tag: FetchedTag) => void;

  books: FetchedBook[];
  setBooks: (books: FetchedBook[]) => void;
  addBook: (book: FetchedBook) => void;
  updateBook: (book: FetchedBook) => void;
}

const useMainStore = create<StoreState>((set) => ({
  location: 'Helsinki',
  setLocation: (location: string) => set((state) => ({ ...state, location })),

  tags: [],
  setTags: (tags: FetchedTag[]) => set((state) => ({ ...state, tags })),
  addTag: (tag: FetchedTag) => set((state) => ({ ...state, tags: [...state.tags, tag] })),

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
