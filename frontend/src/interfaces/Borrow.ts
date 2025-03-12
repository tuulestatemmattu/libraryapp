interface BorrowData {
  id: number;
  borrowedDate: string;
  user: {
    name: string;
    email: string;
  };
  book: {
    title: string;
  };
}

export type { BorrowData };
