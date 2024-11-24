# React + TypeScript + Node.js + PostgreSQL

This is an app used to create, view and edit records.

# Prerequisites
Ensure the following software is installed on your system:
Node.js (version 20.0.0 or later)

# Installation Steps
1. Clone the repository

Open your terminal and run:

```bash
git clone https://github.com/garciazapiain/records_app.git
```

2. Navigate to the project directory

```bash
cd records_app
```

3. Install dependencies in frontend

```bash
cd frontend
npm install
```

4. Continue backend setup, install PostgreSQL

Install PostgreSQL:
  
  For Windows:
  Download the installer from the PostgreSQL website.
  Run the installer and follow the on-screen instructions.
  The PostgreSQL service should start automatically. If not, start it manually via the Services app.

  For macOS:

  Use Homebrew to install PostgreSQL:

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

6. Set Up the database schema:

  Connect to the records_app database:
  
  `psql -d records_app -U your_username`

  Create the records table with the following schema:

    `CREATE TABLE records` (
     id SERIAL PRIMARY KEY,
      sender_name VARCHAR(255) NOT NULL,
      sender_age INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      message TEXT,
      file_paths JSONB DEFAULT '[]'::jsonb);

  Create indices for the table:

  `CREATE UNIQUE INDEX records_pkey ON records(id);`

  `CREATE INDEX idx_records_created_at ON records(created_at);`

  Exit psql termimal:
  `\q`

7. Configure environment variables:

  In the backend directory, create a .env file with the following content:

  `PORT=4000`

  `DATABASE_URL=postgresql://your_username:your_password@localhost:5432/records_app`

8. Install dependencies in backend
```bash
cd records_app/backend
npm install
```

9. Verify server.ts configuration

Run:
```bash
cd [records_app]/frontend
npm run dev
```

Take note of localhost port number used for frontend.

Navigate to `server.ts` in backend folder.

The line `app.use(cors({ origin: "http://localhost:5173" }));` must match your frontend's development URL.

10. Create an `uploads` folder in backend directory
```bash
cd [records_app]/backend
mkdir uploads
```

11. Run app

Run frontend:
```bash
cd [records_app]/frontend
npm run dev
```

Run backend:
```bash
cd [records_app]/backend
npm run dev
```


