const { someApiCall } = require("./someApi");
const someService = require("./someService");

describe("Some Api Testing", () => {
  it("should return the default implementation of some service if nothing is passed to someApi", async () => {
    const result = await someApiCall();
    expect(result).toBe("some important data");
  });

  it("should return the mock implementation if we pass a stub to the api", async () => {
    const stubService = () => "some other data";
    const result = await someApiCall(stubService);
    expect(result).toBe("some other data");
  });

  it("should be able to spy on the service that we pass to the api", async () => {
    const spyService = jest.spyOn(someService, "someService");
    const result = await someApiCall(spyService);
    expect(spyService).toHaveBeenCalled();
    expect(result).toBe("some important data");
  });

  it("should be able to mock the service that we pass to the api", async () => {
    const mockService = jest.fn();
    mockService.mockReturnValue("some mocked data");
    const result = await someApiCall(mockService);
    expect(mockService).toHaveBeenCalled();
    expect(result).toBe("some mocked data");
  });
});
