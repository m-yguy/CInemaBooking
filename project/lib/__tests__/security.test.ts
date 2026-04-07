import {
  hashPassword,
  comparePassword,
  encryptCard,
  decryptCard,
} from "@/lib/security";

describe("hashPassword / comparePassword", () => {
  it("hashes a password and verifies it correctly", async () => {
    const hash = await hashPassword("MyPassword123");
    const match = await comparePassword("MyPassword123", hash);
    expect(match).toBe(true);
  });

  it("rejects the wrong password", async () => {
    const hash = await hashPassword("MyPassword123");
    const match = await comparePassword("WrongPassword", hash);
    expect(match).toBe(false);
  });

  it("produces a different hash each call (salted)", async () => {
    const hash1 = await hashPassword("SamePassword");
    const hash2 = await hashPassword("SamePassword");
    expect(hash1).not.toBe(hash2);
  });
});

describe("encryptCard / decryptCard", () => {
  it("encrypts and decrypts a card number to get the original value", () => {
    const original = "4111111111111111";
    const encrypted = encryptCard(original);
    const decrypted = decryptCard(encrypted);
    expect(decrypted).toBe(original);
  });

  it("produces different ciphertext each call (random IV)", () => {
    const card = "4111111111111111";
    const enc1 = encryptCard(card);
    const enc2 = encryptCard(card);
    expect(enc1).not.toBe(enc2);
  });

  it("encrypted value is not the plaintext card number", () => {
    const card = "4111111111111111";
    const encrypted = encryptCard(card);
    expect(encrypted).not.toContain(card);
  });
});
