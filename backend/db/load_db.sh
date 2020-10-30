use SmartMeal;
db.dropDatabase();
use SmartMeal;
db.createCollection("users");

# smallberg's password: software
# eggert's password: engineering
db.users.insert([{ "username": "smallberg", "password": "$2a$10$r32SXA6LNlFAztMTR/NcIO83wAegszEXC8p6at5lBTKc04cr7qgLy" },
{ "username": "eggert", "password": "$2a$10$UcqkR8Yh7fS3jlik/TN4m.54AQNI0MN3gqMTRKLxTthTz9A9PR1qy" }]);