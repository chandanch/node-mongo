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

  function add(item) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url, { useUnifiedTopology: true });
      try {
        await client.connect();
        const db = client.db(dbName);
        const addedItem = await db.collection(collectionName).insertOne(item);
        resolve(addedItem.ops[0]);
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }

  function update(id, item) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url, { useUnifiedTopology: true });
      try {
        await client.connect();
        const db = client.db(dbName);
        const updatedItem = await db
          .collection(collectionName)
          .findOneAndReplace({ _id: ObjectID(id) }, item, {
            returnOriginal: false,
          });
        resolve(updatedItem.value);
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }

  function remove(id) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url, { useUnifiedTopology: true });
      try {
        await client.connect();
        const db = client.db(dbName);
        const removedItem = await db
          .collection(collectionName)
          .deleteOne({ _id: ObjectID(id) });
        resolve(removedItem.deletedCount === 1);
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }

  function averageFinalists() {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url, { useUnifiedTopology: true });
      try {
        await client.connect();
        const db = client.db(dbName);
        // aggregate pipeline does multiple tasks
        const average = await db
          .collection(collectionName)
          .aggregate([
            // group by id
            {
              $group: {
                _id: null,
                avgFinalists: {
                  // average by a specific column using $
                  $avg: "$Pulitzer Prize Winners and Finalists, 1990-2014",
                },
              },
            },
          ])
          .toArray();

        resolve(average[0].avgFinalists);
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }

  function averageFinalistsByChange() {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url, { useUnifiedTopology: true });
      try {
        await client.connect();
        const db = client.db(dbName);
        // aggregate pipeline does multiple tasks
        const average = await db
          .collection(collectionName)
          .aggregate([
            {
              $project: {
                Newspaper: 1,
                "Pulitzer Prize Winners and Finalists, 1990-2014": 1,
                "Change in Daily Circulation, 2004-2013": 1,
                overallChange: {
                  $cond: {
                    if: {
                      $gte: ["$Change in Daily Circulation, 2004-2013", 0],
                    },
                    then: "positive",
                    else: "negative",
                  },
                },
              },
            },
            {
              $group: {
                _id: "$overallChange",
                avgFinalists: {
                  $avg: "$Pulitzer Prize Winners and Finalists, 1990-2014",
                },
              },
            },
          ])
          .toArray();

        resolve(average);
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }

  return {
    loadData,
    get,
    getById,
    add,
    update,
    remove,
    averageFinalists,
    averageFinalistsByChange,
  };
}

const tester = () => {};

module.exports = circulationRepo();
