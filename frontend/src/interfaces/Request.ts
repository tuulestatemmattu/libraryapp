interface Request {
  title: string;
  author: string;
  isbn: string;
}

interface FetchedRequest {
  id: number;
  title: string;
  author: string;
  isbn: string;
  user_emails: string;
  request_count: number;
}

export type { Request, FetchedRequest };
