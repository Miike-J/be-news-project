## Project Summary
An application to interact with nc-news database via get, patch, post and delete

## How to Clone
- Fork to your profile on github
- Copy link to forked version
- In terminal run 'git clone <copied-link\>'

## Install dependencies 
The dependencies used in the app are
- Express - npm i express
- Postgres - npm i pg
- Dotenv - npm i dotenv
- Pg-Format - npmi pg-format
- Jest - npm i -D jest
- jest-sorted npm i --save-dev jest-sorted / npm i -D jest-sorted maybe
- Supertest - npm i -D supertest

### Must add .env.development and .env.test files to connect to the two databases locally 
To add the environment variables: 
- Create two .env files - .env.development and .env.test
- Into each add PGDATABASE=<database_name>  --  **Hint**: these can be found in /db/setup.sql 
- Check .env files are in .gitignore

## Seed local databsae
To seed the database run 'npm run seed'

## Run tests for app 
Run 'npm i app'

## Minimum versions of node.js and postgres
- pg - 8.7.3
- node - 8.5.5