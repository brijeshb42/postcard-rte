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
9. Update the contents of `.env` file with
    ```
    APP_NAME=Lumen
    APP_ENV=local
    APP_KEY=
    APP_DEBUG=true
    APP_URL=http://localhost
    APP_TIMEZONE=UTC
    # obtain google font api key from https://developers.google.com/fonts/docs/developer_api#APIKey
    FONT_KEY=google-font-api-key

    LOG_CHANNEL=stack
    LOG_SLACK_WEBHOOK_URL=

    DB_CONNECTION=sqlite

    CACHE_DRIVER=database
    QUEUE_CONNECTION=sync
    ```
10. Create tables - `php artisan migrate`.
11. Run `yarn dev` in the project root folder to start frontend dev server.
12. Run php server, `cd postcard-api` and `php -S localhost:8000 -t public`
13. You can now visit `http://localhost:3000` to access the UI while in dev
    mode.


## Local build step
1. Run `yarn build` in project root.
2. Run php server, `cd postcard-api` and `php -S localhost:8000 -t public`
3. You can now visit `http://localhost:8000` to access the production built UI.

## Production (steps taken on digitalocean)

1. `git clone https://github.com/brijeshb42/postcard-mini.git`
2. `cd postcard-mini`
3. `sudo apt update`
4. `curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -`
5. `sudo apt-get install -y nodejs`
6. `npm install -g yarn`
7. `yarn install`
8. `yarn build`
9. `cd postcard-api`
10. `cp .env.example .env` and update the values for production env.
10. `sudo apt install php7.4-cli`
11. `sudo apt install php-mbstring php-xml`
12.  ```
      php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
      php -r "if (hash_file('sha384', 'composer-setup.php') === '756890a4488ce9024fc62c56153228907f1545c228516cbf63f885e036d37e9a59d27d63f46af1d4d07ee0f76181c7d3') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
      php composer-setup.php
      php -r "unlink('composer-setup.php');"
      ```
13. `php composer.phar update`
14. `php composer.phar install`
15. `sudo apt-get install php7.4-sqlite3`
17. `chmod -R 777 database`
18. `chmod -R 777 logs`
19. `sudo -H -u www-data touch database/database.sqlite`
20. `php artisan migrate`
21. `sudo apt-get install nginx php-fpm`
22. `sudo ln -s ``pwd``/server.conf /etc/nginx/sites-enabled/server.conf`
23. `sudo apt install certbot python3-certbot-nginx`
24. `sudo certbot --register-unsafely-without-email --nginx -d postcard-mini.bitwiser.in`
25. `/etc/init.d/nginx restart`
