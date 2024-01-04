const e = require("express");
const loginRepo = require("../../repositories/userRepo");

jest.mock("../../repositories/userRepo");

const loginService = require("../../services/login");

const responseMock = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const mockUsers = [
  {
    id: "admin",
    name: "admin",
    isAdmin: true,
  },
  {
    id: "user",
    name: "user",
    isAdmin: false,
  },
];

describe("Login Service", () => {
  beforeAll(() => {
    loginRepo.getUser.mockResolvedValue({
      password: "admin",
      isAdmin: true,
    });

    loginRepo.getAllUsers.mockResolvedValue(mockUsers);
  });

  it("should return 200 if login is successful", async () => {
    await loginService.handleLogin("admin", "admin", responseMock);

    expect(responseMock.status).toHaveBeenCalledWith(200);
  });

  it("should return 403 if login is unsuccessful", async () => {
    await loginService.handleLogin("admin", "wrong", responseMock);

    expect(responseMock.status).toHaveBeenCalledWith(403);
    expect(responseMock.json).toHaveBeenCalledWith({
      message: "Forbidden",
    });
  });

  it("should throw an error if repo layer fails", async () => {
    loginRepo.getUser.mockRejectedValue({ error: "something went wrong" });

    loginService.handleLogin("admin", "admin", responseMock).catch((err) => {
      expect(err).toEqual({ error: "something went wrong" });
    });
  });

  it("should return all users if all is good", async () => {
    await loginService.handleGetAllUsers({}, responseMock);

    expect(responseMock.status).toHaveBeenCalledWith(200);
    expect(responseMock.json).toHaveBeenCalledWith(mockUsers);
  });

  it("should throw an error if repo layer fails", async () => {
    loginRepo.getAllUsers.mockRejectedValue({
      error: "something went wrong",
    });

    loginService.handleGetAllUsers({}, responseMock).catch((err) => {
      expect(err).toEqual({ error: "something went wrong" });
    });
  });
});
