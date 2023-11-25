const {statisticsTableClient} = require("../config/db");

const getStatistics = async () => {
  const statisticsResponse = statisticsTableClient.listEntities();

  const statistics = [];

  for await (const statistic of statisticsResponse) {
    statistics.push({
        id: statistic.partitionKey,
        size: Number(statistic.size),
        timestamp: statistic.timestamp,
    });
  }

  statistics.sort((a, b) => (a.timestamp > b.timestamp) ? 1 : -1)

  return statistics;
}

module.exports = {getStatistics}
