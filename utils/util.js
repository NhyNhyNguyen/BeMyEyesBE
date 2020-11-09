var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";


module.exports = {
    createConnection: function () {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            console.log("Database created!");
            db.close();
        });
    },

    createCollection: function (collectionName){
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("mydb");
            dbo.createCollection(collectionName, function (err, res) {
                if (err) throw err;
                console.log("Collection created!");
                db.close();
            });
        });
    }
}

