
const { TableClient } = require("@azure/data-tables");

require('dotenv').config(); // Load environment variables from .env file

const connectionString = process.env.CONNECTION_STRING;

console.log(connectionString);

// Create a new instance of the TableClient
const userTableClient = TableClient.fromConnectionString(connectionString, "users");
const zoneTableClient = TableClient.fromConnectionString(connectionString, "ambroziaZones");

module.exports = { userTableClient,zoneTableClient}
