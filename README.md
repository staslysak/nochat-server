// export { default as resolvers } from "./resolvers";

sequelize:
-- model creation:

---- user: sequelize-cli model:generate --name user --attributes avatar:string,name:string,online:boolean,lastSeen:date,username:string,email:string,status:string,shortCode:string,password:string --underscored

---- message: sequelize model:generate --name Message --attributes text:text,unread:boolean,type:string

---- direct: sequelize model:generate --name Direct --attributes sender_id:integer,receiver_id:integer
