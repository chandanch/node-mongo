const { MongoClient } = require("mongodb");

function circulationRepo() {
  const url = "mongodb://localhost:27017";
  const dbName = "circulation";

  function loadData(data) {
    return new Promise(async (resolve, reject) => {
      // create an instance of mongo client
      const client = new MongoClient(url);

      try {
        // connect to mongo db
        await client.connect();
        // create a new db
        const db = client.db(dbName);
        const results = await db.collection("newspapers").insertMany(data);
        resolve(results);
      } catch (error) {
        reject(error);
      }
    });
  }

  return { loadData };
}

const tester = () => {};

module.exports = {
  circulationRepo: circulationRepo(),
  tester: tester,
};
