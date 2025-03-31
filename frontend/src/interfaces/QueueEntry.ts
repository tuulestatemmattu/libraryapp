interface QueueEntryData {
  id: number;
  book: {
    title: string;
    id: number;
  };
  user: {
    name: string;
    email: string;
  };
  createdAt: string;
  position: number;
}

export type { QueueEntryData };