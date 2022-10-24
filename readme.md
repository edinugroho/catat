## Catat App
  catat is backend service for reporting income or expense

### Prerequisite

- `Nodejs ^v16.14.2`
- `MySQL`

### How To Install

- Clone This repo
  ```
  git clone git@github.com:edinugroho/catat.git
  ```

- Go to inside direcrtory
  ```
  cd catat
  ```

- Configure .env
    - copy .env.example to .env
      ```
      cp .env.example .env
      ```
  > update .env if necessary

- Setup Database
  > for example using xampp for mysql database
  - Create database with this several name
    - for dev environment 
        ```
        CREATE DATABASE catat_db_development
        ```
    - for prod environment database name same as your .env file DB_NANE
        ```
        CREATE DATABASE catat_db
        ```

- Install Dependency
    ```
    npm install
    ```

- Setup initial data
  - Migrate tables
    - dev environment
        ```
        npx sequelize-cli db:migrate
        ```
    - prod environment
        ```
        npx sequelize-cli db:migrate --env production
        ```
  - Seed data
    - dev environment
        ```
        npx sequelize-cli db:seed:all
        ```
    - prod environment
        ```
        npx sequelize-cli db:seed:all --env production
        ```

- Run app
  - dev environment
      ```
      npm run dev
      ```
  - prod environment
      ```
      npm start
      ```

### Postman Collection
 
[Collection](https://www.postman.com/collections/426192b7613da43f7ca6)