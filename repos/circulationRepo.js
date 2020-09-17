const { MongoClient } = require("mongodb");

function circulationRepo() {
  const url = "mongodb://localhost:27017";
  const dbName = "circulation";

  function loadData() {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try {
        await client.connect();

        // create a new db
        const db = client.db(dbName);
        const results = await db.collection("newspapers").insertMany([]);
        resolve(results);
      } catch (error) {
        reject(error);
      }
    });
  }

  return { loadData };
}

export default circulationRepo;
