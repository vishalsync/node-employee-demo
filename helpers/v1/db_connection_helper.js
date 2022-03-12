const fs = require("fs/promises");

// Third party packages
const { MongoClient } = require("mongodb");

let _db;

exports.initDBConnection = async () => {

    const mongoURI = process.env.MONGO_URI;

    const mongoClient = new MongoClient(mongoURI)

    try {
        await mongoClient.connect();

        _db = await mongoClient.db(process.env.DB_NAME);
        console.log("Connected successfully to server");


    } catch(error) {
        console.log("Error occured while establishing connection =", error)
        throw error;
    }

}// End of initDBConnection function

exports.getDB = () => {
    if(!_db) throw Error("Database is not initialize");
    return _db;
}

exports.createCollection = async (collectionName, options) => {
    const isCollectionExist = await _db.listCollections({name: collectionName}).next();

    if(!isCollectionExist) {
        this.getDB().createCollection(collectionName, options);
    }

}// End of createCollection function

exports.syncCollection = async () => {

    try {
        // Getting list of all collection file name
        const files = await fs.readdir("collections/v1");

        // Reqiring all files
        files.forEach(file => require(`../../collections/v1/${file}`));

    } catch(error) {
        console.log(error);
    }
    

}// End of syncCollection function


exports.getCollection = (collectionName) => {

    return this.getDB().collection(collectionName);

}// End of getCollection 

