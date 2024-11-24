# React + TypeScript + Vite + Node.js + PostgreSQL

This is an app used to create, view and edit records

# Prerequisites
Ensure the following software is installed on your system:
Node.js (version 20.0.0 or later): Download Node.js

# Installation Steps
1. Clone the Repository

Open your terminal and run:

```bash
git clone [repository_url]
```

2. Navigate to the Project Directory

```bash
cd [project_directory]
```

3. Install Dependencies in frontend

```bash
cd [project_directory]/frontend
npm install
```

4. Continue Backend Setup Install PostgreSQL if needed

The application relies on a PostgreSQL database. To set it up:

Install PostgreSQL:
  
  For Windows:
  Download the installer from the PostgreSQL website.
  Run the installer and follow the on-screen instructions.
  The PostgreSQL service should start automatically. If not, start it manually via the Services app.

  For macOS:

  Use Homebrew:

  ```bash
  brew install postgresql
  ```

  After installation run 
  ```bash
   brew services start postgresql
  ```

5. Setup PostgreSQL database and user
  In a terminal run `psql`

  Create a new user, replace your_username and your_password:

  `CREATE USER your_username WITH PASSWORD 'your_password'`;

  Create a new database:

  `CREATE DATABASE records_app OWNER your_username;`

  Grant all privileges on the database to the user:

  `GRANT ALL PRIVILEGES ON DATABASE records_app TO your_username;`

  Exit psql termimal:

  `\q`

6. Set Up the Database Schema:

  Connect to the records_app database:
  
  `psql -d records_app -U your_username`

  Create the records table with the following schema:

    `CREATE TABLE records` (
     id SERIAL PRIMARY KEY,
      sender_name VARCHAR(255) NOT NULL,
      sender_age INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      message TEXT,
      file_paths JSONB DEFAULT '[]'::jsonb 
  );

  Create indices for the table:
  `CREATE UNIQUE INDEX records_pkey ON records(id);`
  `CREATE INDEX idx_records_created_at ON records(created_at);`

  Exit psql termimal:
  `\q`

6. Configure Environment Variables:

  In the backend directory, create a .env file with the following content:
  `PORT=4000`
  `DATABASE_URL=postgresql://your_username:your_password@localhost:5432/records_app`

7. Install Dependencies in backend
```bash
cd [project_directory]/backend
npm install
```

8. Verift server.ts configuration

Run:
```bash
cd [project_directory]/frontend
npm run dev
```

Take note of localhost port number
Navigate to `server.ts` in backend folder
The line `app.use(cors({ origin: "http://localhost:5173" }));` must match your frontend's development URL.

9. Create an `uploads` folder in backend directory
```bash
cd [project_directory]/backend
mkdir uploads
```

10. Run app

Run frontend:
```bash
cd [project_directory]/frontend
npm run dev
```

Run backend:
```bash
cd [project_directory]/backend
npm run dev
```


