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
    console.log("Limit Data", limitData);
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
    console.log("DB List", await admin.listDatabases());

    client.close();
  }
};

main();
