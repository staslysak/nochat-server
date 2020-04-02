SQL HOSTING:
https://remotemysql.com/databases.php

add nodemon.json file with
{
"exec": "./node_modules/.bin/babel-node index.js"
}
or
{
"exec": "npx babel-node -- ./index.js"
}

.env
DB_URL=postgres://postgres:admin@127.0.0.1:5432/nochat
CLIENT_SMPT_EMAIL=testestore28@gmail.com
CLIENT_SMPT_PW=testestore123
