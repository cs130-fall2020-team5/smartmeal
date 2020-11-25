var MongoClient = require("mongodb").MongoClient;
var mongodb_mock = require('mongo-mock');

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

// SHOULD ONLY BE USED FOR TESTING
exports.set = function (db_handle) {
    db = db_handle;
}

exports.close = async function () {
    if (db == null) return;
    if (db.isConnected) await db.close();
};

exports.set = function (newDb) {
    db = newDb;
}