const zoneRepository = require("../repositories/zoneRepo");
const turf = require("@turf/turf");
const { ServiceBusClient } = require("@azure/service-bus");

const connectionString = process.env.SERVICEBUS_CONNECTION_STRING;
const queueName = "ambrozia_queue";

const sender = new ServiceBusClient(connectionString).createSender(queueName);

const sendMessageToQueue = async (message) => {
  await sender.sendMessages({ body: message });
};

const getAllZones = async (req, res) => {
  zoneRepository
    .getAllZones()
    .then((zones) => {
      res.status(200).json(zones);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

const createZone = async (req, res) =>
  zoneRepository
    .createZone(req.body)
    .then(async () => {
      res.status(200).json({ message: "Zone created" });
      sendMessageToQueue({
        body: "Zone created with success",
        email: "ambrozia@mailinator.com",
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });

const updateZone = async (req, res) => {
  console.log(`Update zone with id: ${req.params.id}`);

  zoneRepository
    .updateZone({
      partitionKey: req.params.id,
      rowKey: "Zone",
      size: req.body.size,
      points: JSON.stringify(req.body.points),
    })
    .then(() => {
      res.status(200).json({ message: "Zone updated" });
      sendMessageToQueue({
        body: "Zone updated with success",
        email: "ambrozia@mailinator.com",
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

const isInZone = async (req, res) => {
  const zones = await zoneRepository.getAllZones();
  const point = turf.point([req.query.x, req.query.y]);

  let isInZone = false;

  zones.forEach((zone) => {
    const poly = turf.polygon(zone.points);

    if (turf.booleanPointInPolygon(point, poly)) {
      isInZone = true;
    }
  });

  return res.status(200).json({ isInZone });
};

const deleteZone = async (req, res) => {
  console.log(`Delete zone with id: ${req.params.id}`);

  zoneRepository
    .deleteZone(req.params.id)
    .then(() => {
      res.status(200).json({ message: "Zone deleted" });
      sendMessageToQueue({
        body: "Zone deleted",
        email: "ambrozia@mailinator.com",
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

module.exports = { getAllZones, createZone, updateZone, isInZone, deleteZone };
