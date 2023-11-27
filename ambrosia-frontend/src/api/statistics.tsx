import axios from "./axios";
import { AxiosResponse } from "axios";
import dayjs from "dayjs";

const responseBody = (response: AxiosResponse) => response.data;

export type StatisticsResponse = {
  size: number;
  timestamp: string;
};

const getStatistics = (): Promise<StatisticsResponse[]> => {
  return axios
    .get(`/statistics`)
    .then(responseBody)
    .catch((error) => {
      console.log(error);
      return [];
    });
};

const useStatisticsQuery = () => {
  const handleGetStatistics = async () => {
    const response = await getStatistics();

    const statisticsWithDate = response.map((statistic) => {
      return {
        ...statistic,
        date: dayjs(statistic.timestamp).format("DD/MM/YYYY"),
      };
    });

    return statisticsWithDate;
  };

  return {
    handleGetStatistics,
  };
};

export default useStatisticsQuery;
