📘 PostgreSQL + pgAdmin Setup (Docker)

This project includes a ready-to-use Docker setup for:

PostgreSQL (database server)

pgAdmin (web UI to view/manage the database)

Anyone on the team can set it up — no technical experience required.

✅ Requirements

Please install:

Docker Desktop
Download: https://www.docker.com/products/docker-desktop

Make sure Docker Desktop is running before beginning.

No other installation is needed (no PostgreSQL installation required).

▶️ Start PostgreSQL + pgAdmin

Open Terminal / PowerShell / Command Prompt.

Go to the folder containing this project:

cd path/to/your/project


Run this command:

docker compose up -d


This will:

Download PostgreSQL and pgAdmin (first run only)

Start both containers in the background

To confirm they are running:

docker ps


You should see:

imc-postgres

imc-pgadmin

🌐 Open pgAdmin in Browser

Open your web browser

Go to:

http://localhost:5050


Login with:

Email: admin@example.com

Password: admin123

These credentials come from the docker-compose file.

🖥️ Add the PostgreSQL Server inside pgAdmin

pgAdmin does not automatically detect your database.
You must register it manually (one time only).

In pgAdmin, right-click Servers (left panel)

Click Create → Server...

Fill the form:

General Tab

Name: imc-postgres

Connection Tab

Host name/address: imc-postgres

Port: 5432

Maintenance database: imc_db

Username: imc_user

Password: imc_pass

Click Save

Your PostgreSQL server will now appear under “Servers”.

🗂️ View the Database + Tables

After saving, expand:

Servers
 └── imc-postgres
      └── Databases
           └── imc_db
                └── Schemas
                     ├── public
                     └── imc_course   ← your tables are here


All project tables are inside the schema:

imc_course


You do NOT need to run SQL manually — the project automatically creates tables on first startup.

⏹ Stop the Containers

When you're done, stop everything:

docker compose down

🔁 Start Later Anytime

To restart PostgreSQL + pgAdmin:

docker compose up -d


Open pgAdmin again:

http://localhost:5050


Login with the same credentials as before.

🔁 Reset the Database (only if needed)

If developers update the database schema (initdb/01-schema.sql),
you must reset the database so scripts re-run:

docker compose down -v
docker compose up -d


⚠️ This deletes all database data — use only when needed.

🎉 Done!

Your PostgreSQL + pgAdmin environment is ready.
Anyone on the team can follow these steps to get the database running quickly.