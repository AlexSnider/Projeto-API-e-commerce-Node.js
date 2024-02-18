const request = require("supertest");
const router = require("../../routes/v1Routes");

describe("GET /v1/all-products", () => {
  test("should return all products", async () => {
    const response = await request(router).get("/v1/all-products");

    expect(response.statusCode).toBe(200);
  });
});
