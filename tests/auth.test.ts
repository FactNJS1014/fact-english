import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  registerSchema,
  loginSchema,
  passwordChangeSchema,
} from "../src/lib/validations";

describe("registerSchema", () => {
  const valid = {
    firstName: "Napa",
    lastName: "Srisai",
    username: "napa_srisai",
    email: "napa@example.com",
    password: "Secret123",
    confirmPassword: "Secret123",
  };

  it("accepts a valid registration", () => {
    const res = registerSchema.safeParse(valid);
    assert.equal(res.success, true);
  });

  it("rejects a short password", () => {
    const res = registerSchema.safeParse({ ...valid, password: "short", confirmPassword: "short" });
    assert.equal(res.success, false);
    if (!res.success) {
      assert.ok(res.error.issues.some((i) => i.path[0] === "password"));
    }
  });

  it("rejects an invalid email", () => {
    const res = registerSchema.safeParse({ ...valid, email: "not-an-email" });
    assert.equal(res.success, false);
    if (!res.success) {
      assert.ok(res.error.issues.some((i) => i.path[0] === "email"));
    }
  });

  it("rejects mismatched confirmation password", () => {
    const res = registerSchema.safeParse({ ...valid, confirmPassword: "Different1" });
    assert.equal(res.success, false);
    if (!res.success) {
      assert.ok(res.error.issues.some((i) => i.path[0] === "confirmPassword"));
    }
  });

  it("rejects a username shorter than 3 characters or with symbols", () => {
    assert.equal(registerSchema.safeParse({ ...valid, username: "ab" }).success, false);
    assert.equal(registerSchema.safeParse({ ...valid, username: "na pa!" }).success, false);
  });

  it("rejects empty required names", () => {
    assert.equal(registerSchema.safeParse({ ...valid, firstName: "" }).success, false);
    assert.equal(registerSchema.safeParse({ ...valid, lastName: "" }).success, false);
  });
});

describe("loginSchema", () => {
  it("accepts email or username + password", () => {
    const ok = loginSchema.safeParse({
      identifier: "napa@example.com",
      password: "Secret123",
      rememberMe: true,
    });
    assert.equal(ok.success, true);
  });

  it("rejects empty identifier/password", () => {
    assert.equal(loginSchema.safeParse({ identifier: "", password: "x" }).success, false);
    assert.equal(loginSchema.safeParse({ identifier: "napa", password: "" }).success, false);
  });

  it("defaults rememberMe to false", () => {
    const res = loginSchema.parse({ identifier: "napa", password: "Secret123" });
    assert.equal(res.rememberMe, false);
  });
});

describe("passwordChangeSchema", () => {
  it("rejects a new password below 8 characters", () => {
    const res = passwordChangeSchema.safeParse({
      currentPassword: "OldPass1",
      newPassword: "tiny",
      confirmPassword: "tiny",
    });
    assert.equal(res.success, false);
  });
});
