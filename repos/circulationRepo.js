const { MongoClient } = require("mongodb");

function circulationRepo() {
  const url = "mongodb://localhost:27017";
  const dbName = "circulation";

  function loadData(data) {
    return new Promise(async (resolve, reject) => {
      // create an instance of mongo client
      const client = new MongoClient(url, { useUnifiedTopology: true });

      try {
        // connect to mongo db
        await client.connect();
        // create a new db
        const db = client.db(dbName);
        // insert documents
        const results = await db.collection("newspapers").insertMany(data);
        resolve(results);
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }

  function get() {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url, { useUnifiedTopology: true });
      try {
        await client.connect();
        const db = client.db(dbName);

        const items = db.collection("newspapers").find();
        resolve(await items.toArray());
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }

  return { loadData, get };
}

const tester = () => {};

module.exports = circulationRepo();
