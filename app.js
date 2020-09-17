const MongoClient = require("mongodb").MongoClient;
const circulationRepo = require("./repos/circulationRepo");

const url = "mongodb://localhost:27017";
const dbName = "circulation";

const main = async () => {
  // create an instance of mongo client
  const client = new MongoClient(url);
  // connect to mongo db
  await client.connect();

  // get admin db instance
  const admin = client.db(dbName).admin();
  // get mongodb server status
  console.log(await admin.serverStatus());
  // get the list of databases
  console.log(await admin.listDatabases());
};

main();
