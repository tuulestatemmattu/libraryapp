interface Request {
  title: string;
  author: string;
  isbn: string;
}

interface fetchedRequest {
  id: number;
  title: string;
  author: string;
  isbn: string;
  user: {
    name: string;
    email: string;
  };
}

export type { Request, fetchedRequest };
