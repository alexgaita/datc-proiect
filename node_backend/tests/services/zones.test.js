const zoneRepository = require("../../repositories/zoneRepo");
const {
  updateZone,
  getAllZones,
  createZone,
  deleteZone,
  isInZone,
} = require("../../services/zones");
const turf = require("@turf/turf");

jest.mock("@turf/turf");
jest.mock("../../repositories/zoneRepo");

const reqMock = {
  params: {
    id: "zoneId",
  },
  query: {
    x: 1,
    y: 2,
  },
  body: {
    size: 10,
    points: [
      [
        [1, 2],
        [1, 3],
        [1, 4],
      ],
    ],
  },
};

const resMock = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

afterEach(() => {
  resMock.status.mockClear();
  resMock.json.mockClear();
  zoneRepository.updateZone.mockClear();
  zoneRepository.getAllZones.mockClear();
});

describe("Get All Zones", () => {
  it("should return all zones", async () => {
    const zones = [
      { id: "zone1", size: 10, points: "[[[1,2],[1,3],[1,4]]]" },
      { id: "zone2", size: 20, points: "[[[2,2],[2,3],[2,4]]]" },
      { id: "zone3", size: 30, points: "[[[3,2],[3,3],[3,4]]]" },
    ];

    zoneRepository.getAllZones.mockResolvedValue(zones);

    await getAllZones(reqMock, resMock);

    expect(zoneRepository.getAllZones).toHaveBeenCalled();
    expect(resMock.status).toHaveBeenCalledWith(200);
    expect(resMock.json).toHaveBeenCalledWith(zones);
  });

  it("should return 500 if an error occurs", async () => {
    const errorMessage = "Failed to get zones";
    zoneRepository.getAllZones.mockRejectedValue(new Error(errorMessage));

    await getAllZones(reqMock, resMock);

    expect(zoneRepository.getAllZones).toHaveBeenCalled();
    expect(resMock.status).toHaveBeenCalledWith(500);
    expect(resMock.json).toHaveBeenCalledWith({ message: errorMessage });
  });
});

describe("Update Zone", () => {
  it("should update the zone and return 200", async () => {
    zoneRepository.updateZone.mockResolvedValue();

    await updateZone(reqMock, resMock);

    expect(resMock.status).toHaveBeenCalledWith(200);
    expect(resMock.json).toHaveBeenCalledWith({ message: "Zone updated" });
  });

  it("should return 500 if an error occurs during update", async () => {
    const errorMessage = "Update failed";
    zoneRepository.updateZone.mockRejectedValue(new Error(errorMessage));

    await updateZone(reqMock, resMock);

    expect(resMock.status).toHaveBeenCalledWith(500);
    expect(resMock.json).toHaveBeenCalledWith({ message: errorMessage });
  });
});

describe("Create zone", () => {
  it("should return 200 if zone is created", async () => {
    zoneRepository.createZone.mockResolvedValue();

    await createZone(reqMock, resMock);

    expect(resMock.status).toHaveBeenCalledWith(200);
    expect(resMock.json).toHaveBeenCalledWith({ message: "Zone created" });
  });

  it("should return 500 if zone is not created", async () => {
    const errorMessage = "Failed to create zone";
    zoneRepository.createZone.mockRejectedValue(new Error(errorMessage));

    await createZone(reqMock, resMock);

    expect(resMock.status).toHaveBeenCalledWith(500);
    expect(resMock.json).toHaveBeenCalledWith({ message: errorMessage });
  });

  it("should return 500 if zone is not created", async () => {
    const errorMessage = "Failed to create zone";
    zoneRepository.createZone.mockRejectedValue(new Error(errorMessage));

    await createZone(reqMock, resMock);

    expect(resMock.status).toHaveBeenCalledWith(500);
    expect(resMock.json).toHaveBeenCalledWith({ message: errorMessage });
  });
});

describe("Delete zone", () => {
  it("should return 200 if zone is deleted", async () => {
    zoneRepository.deleteZone.mockResolvedValue();

    await deleteZone(reqMock, resMock);

    expect(resMock.status).toHaveBeenCalledWith(200);
    expect(resMock.json).toHaveBeenCalledWith({ message: "Zone deleted" });
  });

  it("should return 500 if zone is not deleted", async () => {
    const errorMessage = "Failed to delete zone";
    zoneRepository.deleteZone.mockRejectedValue(new Error(errorMessage));

    await deleteZone(reqMock, resMock);

    expect(resMock.status).toHaveBeenCalledWith(500);
    expect(resMock.json).toHaveBeenCalledWith({ message: errorMessage });
  });
});

describe("Validate zone data", () => {
  it("Should throw an error if size is smaller than 0", () => {
    [0, -2, -2, -3, -4, -5].forEach(async (size) => {
      await updateZone(
        { body: { size, points: reqMock.body.points } },
        resMock
      );
    });

    expect(resMock.status).toHaveBeenCalledTimes(6);
    expect(resMock.status).toHaveBeenCalledWith(500);
    expect(resMock.json).toHaveBeenCalledWith({
      message: "Size must be greater than 0",
    });
  });

  it("Should throw an error if points is not a valid polygon", () => {
    const invalidPoints = [];

    invalidPoints.push([1, 2, 3, 4]);
    invalidPoints.push([
      [1, 2],
      [1, 3],
    ]);
    invalidPoints.push([]);
    invalidPoints.push({});
    invalidPoints.push("string");
    invalidPoints.push([
      [
        [1, 2],
        [1, 3],
        [1, 4],
        [1, 5],
      ],
    ]);

    invalidPoints.forEach(async (points) => {
      await updateZone({ body: { size: 10, points } }, resMock);
    });

    console.log(resMock.status.mock.calls);

    expect(resMock.status).toHaveBeenCalledTimes(5);
    expect(resMock.status).toHaveBeenCalledWith(500);
    expect(resMock.json).toHaveBeenCalledWith({
      message: "Points are not in polygon format",
    });
  });
});

const mockZones = [
  {
    id: "zone1",
    size: 10,
    points: [
      [
        [1, 2],
        [1, 3],
        [1, 4],
      ],
    ],
  },
];

describe("Is in zone", () => {
  it("should return true if point is in zone", async () => {
    zoneRepository.getAllZones.mockResolvedValue(mockZones);
    turf.polygon.mockReturnValue({});
    turf.point.mockReturnValue({});
    turf.booleanPointInPolygon.mockReturnValue(true);

    await isInZone(reqMock, resMock);

    expect(resMock.status).toHaveBeenCalledWith(200);
    expect(resMock.json).toHaveBeenCalledWith({ isInZone: true });
  });

  it("should return false if point is not in zone", async () => {
    zoneRepository.getAllZones.mockResolvedValue(mockZones);
    turf.polygon.mockReturnValue({});
    turf.point.mockReturnValue({});
    turf.booleanPointInPolygon.mockReturnValue(false);

    await isInZone(reqMock, resMock);

    expect(resMock.status).toHaveBeenCalledWith(200);
    expect(resMock.json).toHaveBeenCalledWith({ isInZone: false });
  });

  it("should throw error if an error occurs", async () => {
    const errorMessage = "Failed to get zones";
    zoneRepository.getAllZones.mockRejectedValueOnce({ message: errorMessage });

    await isInZone(reqMock, resMock).catch((err) => {
      expect(err).toEqual({ message: errorMessage });
    });

    turf.point.mockReset();
    resMock.status.mockClear();

    await isInZone({ query: [] }, resMock).catch((err) => {
      expect(err).toEqual({ message: errorMessage });
    });
  });
});
