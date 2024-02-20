const axios = require("axios");

const instance = axios.create({
  withCredentials: true,
});

const baseURL = "http://localhost:3002/v1/all-products";

describe("Products Controller", () => {
  describe("GET Products", () => {
    it("expect to return status 200", async () => {
      const response = await instance.get(baseURL);

      expect(response.data.products).toBeDefined();
      expect(response.data.products.length).toBeGreaterThan(0);
      expect(Array.isArray(response.data.products)).toBe(true);

      expect(response.data.error).toBe(false);
      expect(response.status).toBe(200);
    });

    it("expect to have correct property values", async () => {
      const response = await instance.get(baseURL);

      response.data.products.forEach((product) => {
        expect(product).toHaveProperty("id", expect.any(Number));
        expect(product).toHaveProperty("name", expect.any(String));
        expect(product).toHaveProperty("description", expect.any(String));
        expect(product).toHaveProperty("unit_price", expect.any(Number));
        expect(product).toHaveProperty("stock", expect.any(Number));
        expect(product).toHaveProperty("categoryId", expect.any(Number));
      });
    });

    it("expect to have invalid route parameters", async () => {
      const response = await instance.get("http://localhost:3002/v1/products");

      expect(response.data.error).toBe(true);

      expect(response.status).toBe(404);
    });
  });
});
