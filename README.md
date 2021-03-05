## Running Locally

1. Clone the repo - https://github.com/brijeshb42/postcard-mini.git
2. `cd postcard-mini`
3. Install dependencies. Make sure `node` and `npm/yarn` are installed.
  1. Install node dependencies `yarn install`
4. Setup php backend
  1. Make sure php and composer are installed on the system `brew install php composer` for mac.

    ```
      PHP >= 7.3
      OpenSSL PHP Extension
      PDO PHP Extension
      Mbstring PHP Extension
    ```
5. `cd postcard-api`
6. Install php dependencies - `composer install`
7. Create sqlite file - `touch database/database.sqlite`
8. Create tables - `php artisan migrate`.
9. Run `yarn dev` in the project root folder to start frontend dev server.
10. Run php server, `cd postcard-api` and `php -S localhost:8000 -t public`
11. You can now visit `http://localhost:3000` to access the UI while in dev
    mode.

## Local build step
1. Run `yarn build` in project root.
2. Run php server, `cd postcard-api` and `php -S localhost:8000 -t public`
3. You can now visit `http://localhost:8000` to access the production built UI.

