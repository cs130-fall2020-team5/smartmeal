var MongoClient = require("mongodb").MongoClient;

// database setup
let db = null;

// api
exports.connect = function (url, dbname, callback) {
    if (db != null) {
        close();
    }

    return new MongoClient(url, { useUnifiedTopology: true })
        .connect()
        .then((mongo) => {
            db = mongo.db(dbname);
        });
};

exports.get = function () {
    return db;
};

exports.close = async function () {
    if (db == null) return;
    if (db.isConnected) await db.close();
};

exports.set = function (newDb) {
    db = newDb;
}