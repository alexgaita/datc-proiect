const {zoneTableClient} = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const getZoneById = async (id) => {
  const response = await zoneTableClient.getEntity(id, "Zone");
  return response;
}

const getAllZones = async () => {
  const zoneReponse = zoneTableClient.listEntities();

  const zones = [];

  for await (const zone of zoneReponse) {
    zones.push({
        id: zone.partitionKey,
        size: Number(zone.size),
        points: JSON.parse(zone.points),
    });
  }

  return zones;
}

const updateZone = async (zone) => {
    await zoneTableClient.updateEntity(zone);
}

const createZone = async (zone) => {
    await zoneTableClient.createEntity({
        partitionKey: uuidv4(),
        rowKey: "Zone",
        size: Number(zone.size),
        points: JSON.stringify(zone.points),
    });
    }

module.exports = {getZoneById, getAllZones, createZone ,updateZone}