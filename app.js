const assert = require("assert");
const { MongoClient } = require("mongodb");

const circulationRepo = require("./repos/circulationRepo");
const circulationData = require("./circulation.json");

const url = "mongodb://localhost:27017";
const dbName = "circulation";

const main = async () => {
  const client = new MongoClient(url, { useUnifiedTopology: true });
  await client.connect();

  try {
    const insertResults = await circulationRepo.loadData(circulationData);
    // console.log(insertResults.insertedCount, insertResults.ops);
    assert.strictEqual(circulationData.length, insertResults.insertedCount);

    // get Data
    const newsData = await circulationRepo.get();
    assert.strictEqual(newsData.length, circulationData.length);
    // console.log(newsData.length, circulationData.length);

    // filter Data
    const filterData = await circulationRepo.get({
      Newspaper: newsData[2].Newspaper,
    });
    assert.deepStrictEqual(filterData[0], newsData[2]);
    // console.log(filterData);

    //limit Data
    const limitData = await circulationRepo.get({}, 3);
    assert.strictEqual(limitData.length, 3);
    // console.log("Limit Data", limitData);

    // get By Id
    const documentId = newsData[3]._id.toString(); // convert from object ID to string
    const byId = await circulationRepo.getById(documentId);
    assert.deepStrictEqual(byId, newsData[3]);
    // console.log("By Id", byId);

    // add new data
    const newItem = {
      Newspaper: "Chandio Post",
      "Daily Circulation, 2004": 70034,
      "Daily Circulation, 2013": 74767,
      "Change in Daily Circulation, 2004-2013": 38,
      "Pulitzer Prize Winners and Finalists, 1990-2003": 0,
      "Pulitzer Prize Winners and Finalists, 2004-2014": 1,
      "Pulitzer Prize Winners and Finalists, 1990-2014": 0,
    };
    const addedItem = await circulationRepo.add(newItem);
    assert(addedItem._id);
    // console.log("Added Item", addedItem);

    // check for added Item
    const addItemQuery = await circulationRepo.getById(addedItem._id);
    assert.deepStrictEqual(addItemQuery, newItem);
    // console.log("added Item Query", addItemQuery);

    // update Item
    const updatedItem = await circulationRepo.update(addedItem._id, {
      Newspaper: "Chandio Daily News",
      "Daily Circulation, 2004": 70034,
      "Daily Circulation, 2013": 74767,
      "Change in Daily Circulation, 2004-2013": 3,
      "Pulitzer Prize Winners and Finalists, 1990-2003": 0,
      "Pulitzer Prize Winners and Finalists, 2004-2014": 1,
      "Pulitzer Prize Winners and Finalists, 1990-2014": 0,
    });

    // check if Item is updated
    const updateItemQuery = await circulationRepo.getById(addedItem._id);
    assert.strictEqual(updateItemQuery.Newspaper, "Chandio Daily News");
    // console.log("Updated Item3", updateItemQuery);

    // remove Item
    const removed = await circulationRepo.remove(addedItem._id);
    assert(removed);

    // check if item is deleted
    const deleteItemQuery = await circulationRepo.getById(addedItem._id);
    assert.strictEqual(deleteItemQuery, null);

    // get average finalists
    const averageFinalists = await circulationRepo.averageFinalists();
    console.log("Average Finalists", averageFinalists);

    // get average finalists by circulation change
    const averageFinalistsByChange = await circulationRepo.averageFinalistsByChange();
    console.log("Average Finalists", averageFinalistsByChange);
  } catch (error) {
    console.log(error);
  } finally {
    // get admin db instance
    const admin = client.db(dbName).admin();
    // get mongodb server status
    //   console.log(await admin.serverStatus());'

    // drop database
    await client.db(dbName).dropDatabase();

    // get the list of databases
    // console.log("DB List", await admin.listDatabases());

    client.close();
  }
};

main();
