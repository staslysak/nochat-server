// export { default as resolvers } from "./resolvers";

// DB_URL=postgres://postgres:admin@127.0.0.1:5432/nochat

sequelize:
-- model creation:

---- user: sequelize-cli model:generate --name user --attributes avatar:string,name:string,online:boolean,lastSeen:date,username:string,email:string,status:string,shortCode:string,password:string --underscored

---- message: sequelize model:generate --name Message --attributes text:text,unread:boolean,type:string

---- direct: sequelize model:generate --name Direct --attributes sender_id:integer,receiver_id:integer

return Bucket.find({
where: {
// here you can use custom subquery to select only buckets that has AT LEAST one "red" color
\$and: [['EXISTS( SELECT * FROM "Colors" WHERE value = ? AND "BucketId" = "Bucket".id )', 'red']]
},
include: [
// and then join all colors for each bucket that meets previous requirement ("at least one...")
{ model: Color, as: 'colors' }
]
})

DB_URL=postgres://orojmxxt:xaRGbgVMLXdzzNoHzrNn9o6RpE9zyirc@drona.db.elephantsql.com:5432/orojmxxt

EXISTS( SELECT _ FROM "Colors" WHERE value = ? AND "BucketId" = "Bucket".id )
select _ from directs where EXISTS(select \* from users where directs.sender_id = 4 OR directs.receiver_id = 4);
insert into directs (created_at, updated_at, sender_id, receiver_id) values('2020-04-16 10:42:12.556+00', '2020-04-16 10:42:12.556+00', 8, 4);

insert into users (created_at, updated_at, username, email, password, avatar, short_code) values('2020-04-16 10:42:12.556+00', '2020-04-16 10:42:12.556+00', 'username', 'email@email.com', 'password', 'avatar', '12345');
