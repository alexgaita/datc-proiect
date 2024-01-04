const statisticsRepo = require("../repositories/statisticsRepo");

const getStatistics = async (req, res) => {
  return statisticsRepo
    .getStatistics()
    .then((statistics) => {
      res.status(200).json(statistics);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

module.exports = { getStatistics };
