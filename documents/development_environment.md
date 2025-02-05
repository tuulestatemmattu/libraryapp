# Development environment
Setup guide [here](./development_environment_setup.md).

## Services
* Backend [http://localhost:3001](http://localhost:3001)
* Frontend [http://localhost:5173](http://localhost:5173)
* Database manager [http://localhost:8080](http://localhost:8080)
    * System: PostgreSQL
    * Username: libraryapp
    * Password: salainen
    * Database: libraryapp
* Database
* Test database

## Commands (in repostitory root)
* `make up`: Creates & starts the services
* `make down`: Removes the services
* `make rebuild`: Rebuilds the images (e.g. adding new dependencies)
* `make fixmodules`: Fixes vscode "Cannot find module ..."
* `make resetdb`: Resets the database (must be done after changing schema)
* `make testback`: Runs unit tests for backend
* `make testfront`: Runt unit tests for frontend
* `make lint`: Lints both frontend & backend
* `make prettier`: Runs prettier for both frontend & backend