const { MongoClient, ObjectID } = require("mongodb");

function circulationRepo() {
  const url = "mongodb://localhost:27017";
  const dbName = "circulation";
  const collectionName = "newspapers";

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

  function get(query, limit) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url, { useUnifiedTopology: true });
      try {
        await client.connect();
        const db = client.db(dbName);

        let items = db.collection("newspapers").find(query);
        if (limit > 0) {
          items = items.limit(limit);
        }

        resolve(await items.toArray());
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }

  function getById(id) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url, { useUnifiedTopology: true });
      try {
        await client.connect();
        const db = client.db(dbName);

        const item = await db
          .collection(collectionName)
          // convert from string to Object ID using ObjectID()
          .findOne({ _id: ObjectID(id) });
        resolve(item);
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }

  return { loadData, get, getById };
}

const tester = () => {};

module.exports = circulationRepo();
