import { describe, expect, it } from "vitest";
import { clientRegisterSchema, serviceRequestSchema } from "./validation";

describe("service request validation", () => {
  it("accepts the required contract without GPS", () => {
    const result = serviceRequestSchema.safeParse({
      phone: "+96512345678",
      serviceId: 1,
      areaId: 2,
      latitude: null,
      longitude: null,
    });
    expect(result.success).toBe(true);
  });

  it("requires coordinates as a pair", () => {
    const result = serviceRequestSchema.safeParse({
      phone: "+96512345678",
      serviceId: 1,
      areaId: 2,
      latitude: 29.3,
      longitude: null,
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid phone, IDs, and coordinate ranges", () => {
    const result = serviceRequestSchema.safeParse({
      phone: "123",
      serviceId: 0,
      areaId: 0,
      latitude: 120,
      longitude: 200,
    });
    expect(result.success).toBe(false);
  });
});

describe("client registration validation", () => {
  it("accepts Gmail registration with matching passwords", () => {
    const result = clientRegisterSchema.safeParse({
      fullName: "Client User",
      email: "client@gmail.com",
      password: "password123",
      confirmPassword: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects non-Gmail addresses", () => {
    const result = clientRegisterSchema.safeParse({
      fullName: "Client User",
      email: "client@example.com",
      password: "password123",
      confirmPassword: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects mismatched passwords", () => {
    const result = clientRegisterSchema.safeParse({
      fullName: "Client User",
      email: "client@gmail.com",
      password: "password123",
      confirmPassword: "password456",
    });
    expect(result.success).toBe(false);
  });
});
