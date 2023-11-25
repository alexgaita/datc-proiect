const zoneRepository = require('../repositories/zoneRepo');
const turf = require('@turf/turf')

const getAllZones = async (req, res) => {
    zoneRepository.getAllZones().then((zones) => {
        res.status(200).json(zones);
    }).catch((err) => {
        res.status(500).json({ message: err.message });
    });
}

const createZone = async (req, res) => 
    zoneRepository.createZone(req.body).then(() => {
        res.status(200).json({ message: "Zone created" });
    }).catch ((err) => {
        res.status(500).json({ message: err.message });
    });


const updateZone = async (req, res) => {
    console.log(`Update zone with id: ${req.params.id}`);

    zoneRepository.updateZone({
        partitionKey: req.params.id,
        rowKey: "Zone",
        size: req.body.size,
        points: JSON.stringify(req.body.points),
    }).then(() => {
        res.status(200).json({ message: "Zone updated" });
    }).catch ((err) => {
        res.status(500).json({ message: err.message });
    });
}

const isInZone = async (req, res) => {
    const zones = await zoneRepository.getAllZones();
    const point = turf.point([req.query.x, req.query.y]);

    let isInZone = false;

    zones.forEach(zone => {
        const points = zone.points.map(point => [point.x, point.y]);

        console.log(points);

        const poly = turf.polygon([points]);

        if (turf.booleanPointInPolygon(point, poly)) {
            isInZone = true;
        }
    }
    );

    return res.status(200).json({ isInZone });
}

module.exports = { getAllZones, createZone, updateZone, isInZone }

