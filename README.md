SQL HOSTING:
https://remotemysql.com/databases.php

nodemon.json file with
{
"exec": "./node_modules/.bin/babel-node index.js"
}
or
{
"exec": "npx babel-node -- ./index.js"
}

// export { default as resolvers } from "./resolvers";
// export { default as typeDefs } from "./types";

.env
DB_URL=postgres://postgres:admin@127.0.0.1:5432/nochat
SMTP_CLIENT_USER=testestore28@gmail.com
SMTP_CLIENT_PW=testestore123
