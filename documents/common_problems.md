
# Fixes to common problems
## vscode: "Cannot find module '...' or its corresponding type declarations.ts(2307)"
In the repository root, run
```
sudo chown $USER frontend/node_modules backend/node_modules
npm install --prefix frontend
npm install --prefix backend
```

## starting application: "Cannot find module '...' or its corresponding type declarations."
In the repository root, run
```
docker compose down
docker compose up --build
```

## Database schema doesn't get updated after changing models
The "correct" way would be to use migrations. The easiest way currently is to just delete the database and restart the application, that is
```
docker compose down
sudo rm -rf db-data
docker compose up --build
```

## How to manually add test data to the database?
Go to [http://localhost:8080](http://localhost:8080) and login with
* System: PostgreSQL
* Username: libraryapp
* Password: salainen
* Database: libraryapp