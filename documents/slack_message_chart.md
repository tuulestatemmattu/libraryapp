```mermaid

flowchart TD
    User -->|Borrow Book| LibraryApp
    User -->|Request Book| LibraryApp
    User -->|Return Book| LibraryApp
    Admin -->|Add Book| LibraryApp
    Admin -->|Edit Book| LibraryApp

    LibraryApp -->|Notify everyone on new book| SlackChannel
    LibraryApp -->|Notify users who requested a book| SlackPrivateMessage
        LibraryApp -->|Notify users with late books or ready queues| SlackPrivateMessage

```
