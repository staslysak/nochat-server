SQL HOSTING:
------ https://remotemysql.com/databases.php

// export { default as resolvers } from "./resolvers";

.env:
------ DB_URL=postgres://postgres:admin@127.0.0.1:5432/nochat
------ SMTP_CLIENT_USER=testestore28@gmail.com
------ SMTP_CLIENT_PW=testestore123

sequelize:
-- model creation:
---- user: sequelize-cli model:generate --name user --attributes avatar:string,name:string,online:boolean,lastSeen:date,username:string,email:string,status:string,shortCode:string,password:string --underscored
