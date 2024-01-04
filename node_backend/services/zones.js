const zoneRepository = require("../repositories/zoneRepo");
const { validateZoneData } = require("../utils/utils");
const turf = require("@turf/turf");

const getAllZones = async (req, res) => {
  return zoneRepository
    .getAllZones()
    .then((zones) => {
      res.status(200).json(zones);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

const createZone = async (req, res) => {
  try {
    validateZoneData(req);
    await zoneRepository.createZone(req.body);
    res.status(200).json({ message: "Zone created" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const updateZone = async (req, res) => {
  try {
    validateZoneData(req);

    console.log("update body", req.body);
    await zoneRepository.updateZone(req.body);
    return res.status(200).json({ message: "Zone updated" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
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

  return zoneRepository
    .deleteZone(req.params.id)
    .then(() => {
      res.status(200).json({ message: "Zone deleted" });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

module.exports = { getAllZones, createZone, updateZone, isInZone, deleteZone };
