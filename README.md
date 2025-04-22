# 📖 LibraryApp

LibraryApp is a modern web application designed to streamline library operations, making it ideal for small community libraries in offices, schools, or residential complexes. It enables users to browse, borrow, and return books effortlessly while providing administrators with powerful tools to manage inventory, handle book requests, and keep users informed through Slack notifications. Built with a Mobile First design approach, LibraryApp ensures an intuitive and seamless user experience across all devices.

### Regular users can:
- Borrow books by scanning barcodes.
- Request new books to be added to the library.
- Reserve books that are currently unavailable.
- Extend their loans if the book is not reserved.
- Receive Slack notifications for due date reminders or when requested books are added to the library.

### Administrators can:
- Add new books by scanning their barcodes.
- Track and manage book inventory.
- Promote other users to administrators.
- Process book requests and notify requesters via Slack.

&nbsp;

## 👁️ System Overview

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/d076ef5e55b14733b6292ddb3391bbdc)](https://app.codacy.com/gh/tuulestatemmattu/libraryapp/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
![](https://byob.yarr.is/tuulestatemmattu/libraryapp/las)

### Application links
- **[Production environment](https://ohtu-library-7801af5eb8b8.herokuapp.com/)**
  - [Code on GitHub](https://github.com/tuulestatemmattu/libraryapp/tree/main)
- **[Staging environment](https://ohtu-library-staging-c43b89853868.herokuapp.com/)**
  - [Code on GitHub](https://github.com/tuulestatemmattu/libraryapp/tree/staging)

### Tools, technologies and libraries used:
- **Programming Languages**: JavaScript, TypeScript
- **Frameworks**: React, Node.js, Express, MUI
- **Database**: PostgreSQL, Sequelize
- **Version Control**: Git, GitHub
- **Testing**: Jest, Playwright
- **CI/CD**: GitHub Actions, Heroku, Codacy
- **Project Management**: GitHub Projects
- **Communication**: Slack
- **Accessibility**: Lighthouse
- **Other Tools**: Docker, ESLint, Prettier

### User guides:
- [User guide for regular users](https://github.com/tuulestatemmattu/libraryapp/blob/staging/documents/general_app_use_instructions.md)
- [User guide for admin users](https://github.com/tuulestatemmattu/libraryapp/blob/staging/documents/general_app_use_instructions.md)

&nbsp;


## 🛠️ Developer Resources

### Setup
* [Setting up a development environment](documents/development_environment_setup.md)
* [Setting up Slack integration](https://github.com/tuulestatemmattu/libraryapp/blob/main/documents/slack_bot_setup.md)

### Supportive documentation
* [Build pipeline flowchart](https://github.com/tuulestatemmattu/libraryapp/blob/staging/documents/build_pipeline_documentation.md)

### Services for local development
* Backend [http://localhost:3001](http://localhost:3001)
* Frontend [http://localhost:5173](http://localhost:5173)
* Database manager [http://localhost:8080](http://localhost:8080)
    * System: PostgreSQL
    * Username: libraryapp
    * Password: salainen
    * Database: libraryapp

### Commands (in repostitory root)
* `make up`: Creates & starts the services
* `make down`: Removes the services
* `make rebuild`: Rebuilds the images (e.g. adding new dependencies)
* `make fixmodules`: Fixes vscode "Cannot find module ..."
* `make resetdb`: Resets the database (must be done after changing schema)
* `make testback`: Runs unit tests for backend
* `make testfront`: Runt unit tests for frontend
* `make lint`: Lints both frontend & backend
* `make prettier`: Runs prettier for both frontend & backend
* `make e2e`: Run e2e tests

&nbsp;


## 🚀 Project

This project was created as part of the [Software Engineering Project course](https://www.helsinki.fi/en/innovations-and-cooperation/innovations-and-entrepreneurship/business-collaboration-and-partnership/benefit-expertise-our-students/software-engineering-project) at the University of Helsinki. The project lasted from January 2025 to May 2025 and followed the Scrum methodology as instructed by the University of Helsinki Software Engineering course ([course page, Finnish only](https://ohjelmistotuotanto-hy.github.io/)).

### Scrum backlogs
- [Product Backlog](https://github.com/orgs/tuulestatemmattu/projects/19)
- [Sprint 0 Backlog](https://github.com/orgs/tuulestatemmattu/projects/21)
- [Sprint 1 Backlog](https://github.com/orgs/tuulestatemmattu/projects/24)
- [Sprint 2 Backlog](https://github.com/orgs/tuulestatemmattu/projects/26)
- [Sprint 3 Backlog](https://github.com/orgs/tuulestatemmattu/projects/28)
- [Sprint 4 Backlog](https://github.com/orgs/tuulestatemmattu/projects/30)
- [Sprint 5 Backlog](https://github.com/orgs/tuulestatemmattu/projects/31)
- [Sprint 6 Backlog](https://github.com/orgs/tuulestatemmattu/projects/33)
- [Sprint 7 Backlog](https://github.com/orgs/tuulestatemmattu/projects/36)
- [Sprint 8 Backlog](https://github.com/orgs/tuulestatemmattu/projects/37)

### Definition of Done
Definition of Done can be found [here](documents/definition_of_done.md).
