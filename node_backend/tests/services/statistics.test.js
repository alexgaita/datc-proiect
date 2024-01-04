const statisticsService = require("../../services/statistics");
const statisticsRepo = require("../../repositories/statisticsRepo");

jest.mock("../../repositories/statisticsRepo");

const mockStatistics = [
  {
    id: "1",
    size: 100,
    timestamp: "2020-12-12T00:00:00.000Z",
  },
  {
    id: "2",
    size: 200,
    timestamp: "2020-12-13T00:00:00.000Z",
  },
  {
    id: "3",
    size: 300,
    timestamp: "2020-12-14T00:00:00.000Z",
  },
];

const responseMock = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe("Statistics Service", () => {
  beforeAll(() => {
    statisticsRepo.getStatistics.mockResolvedValue(mockStatistics);
  });

  it("should return statistics if retrieval is successful", async () => {
    statisticsRepo.getStatistics.mockResolvedValue(mockStatistics);

    await statisticsService.getStatistics({}, responseMock);

    expect(responseMock.status).toHaveBeenCalledWith(200);
    expect(responseMock.json).toHaveBeenCalledWith(mockStatistics);
  });

  it("should return an error message if retrieval fails", async () => {
    const errorMessage = "Failed to retrieve statistics";

    statisticsRepo.getStatistics.mockRejectedValueOnce({
      message: errorMessage,
    });

    await statisticsService.getStatistics({}, responseMock);

    expect(responseMock.status).toHaveBeenCalledWith(500);
    expect(responseMock.json).toHaveBeenCalledWith({ message: errorMessage });
  });
});
