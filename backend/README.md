# Multiplayer backend

PHP scripts and SQL for MariaDB. The backend only stores and synchronizes multiplayer sessions; all game logic stays in the Angular app.

## Deployment (IONOS)

1. Run [database/schema.sql](./database/schema.sql) once in the MariaDB database (e.g. via phpMyAdmin).
2. Copy [api/config.example.php](./api/config.example.php) to `api/config.php` and enter the database credentials. `config.php` is not committed.
3. Upload `api/config.php` once by hand to the webspace folder `/api` next to the Angular build. The GitHub workflow [deploy.yml](../.github/workflows/deploy.yml) uploads all other `api/` files on every push to `master` and keeps the server's `config.php`. The production build calls `/api` (`multiplayerApiUrl` in `src/environments/environment.prod.ts`).
4. Make sure the Angular `.htaccess` only rewrites requests to non-existing files, so `/api/*.php` is not redirected to `index.html`:

   ```apache
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule ^ index.html [L]
   ```

5. Existing databases: run the scripts in [database/migrations](./database/migrations) that haven't been applied yet. They are already part of `schema.sql`.
6. Check `post_max_size` (PHP) and `max_allowed_packet` (MariaDB) if creating a session with large game content fails.

## Endpoints

| Endpoint                        | Purpose                                                        |
| ------------------------------- | -------------------------------------------------------------- |
| `POST create-session.php`       | Host creates a session with host setup and game state          |
| `POST join-session.php`         | Loads a session; fails with 409 if the app version differs     |
| `GET get-session-changes.php`   | Polls game values and seats changed since a revision           |
| `POST update-session-state.php` | Saves changed game values; 409 with remote changes on conflict |
| `POST claim-seat.php`           | Assigns a player seat to a device                              |
| `POST release-seat.php`         | Frees a seat of the own device; the host may free any seat     |
| `POST set-seat-ready.php`       | Marks the own seat as ready or not ready in the lobby          |

## Local testing

`src/environments/environment.ts` points to `http://localhost:8080/api`. Start the local backend (PHP + MariaDB) with Docker Desktop running:

```powershell
cd backend/local-dev
docker compose up -d --build   # start
docker compose down            # stop, sessions are kept
docker compose down -v         # stop and delete the database
```

The schema is only applied when the database volume is created. After a schema change, run the migration in the container or recreate the volume with `docker compose down -v`. The local config is [local-dev/config.php](./local-dev/config.php); it is passed via `DUNE_API_CONFIG_PATH`, so the deployed `api/config.php` stays untouched.
