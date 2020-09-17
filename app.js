const MongoClient = require("mongodb").MongoClient;
const circulationRepo = require("./repos/circulationRepo");
const circulationData = require("./circulation.json");

const url = "mongodb://localhost:27017";
const dbName = "circulation";

const main = async () => {
  const insertResults = await circulationRepo.loadData(circulationData);
  console.log(insertResults.insertedCount, insertResults.ops);

  // get admin db instance
  //   const admin = client.db(dbName).admin();
  // get mongodb server status
  //   console.log(await admin.serverStatus());
  // get the list of databases
  console.log(await admin.listDatabases());
};

main();
