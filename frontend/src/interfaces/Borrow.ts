interface BorrowData {
  id: number;
  borrowedDate: string;
  active: boolean;
  user: {
    name: string;
    email: string;
  };
  book: {
    title: string;
    id: number;
  };
}

export type { BorrowData };
