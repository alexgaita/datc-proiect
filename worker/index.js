const { TableClient } = require("@azure/data-tables");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config(); // Load environment variables from .env file

const connectionString = process.env.CONNECTION_STRING;

// Create a new instance of the TableClient
const zoneTableClient = TableClient.fromConnectionString(
  connectionString,
  "ambroziaZones"
);
const statisticsTableClient = TableClient.fromConnectionString(
  connectionString,
  "statistics"
);

const getAllZonesSize = async () => {
  const zoneReponse = zoneTableClient.listEntities();
  let size = 0;

  for await (const zone of zoneReponse) {
    size += Number(zone.size);
  }

  return size;
};

const createStatistics = async () => {
  const size = await getAllZonesSize();
  const statistics = {
    partitionKey: uuidv4(),
    rowKey: "Statistics",
    size: size,
  };

  statisticsTableClient.createEntity(statistics);
};

createStatistics().then(() => console.log("Statistics created"));
