import bcrypt from "bcrypt";
import crypto from "crypto";

const ENCRYPTION_KEY =
  process.env.AUTH_SECRET || "your-32-character-secret-layer-here";
const IV_LENGTH = 16;

export class SecurityFacade {
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  encryptCardNumber(text: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32)),
      iv,
    );
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
  }

  decryptCardNumber(text: string): string {
    const textParts = text.split(":");
    const iv = Buffer.from(textParts.shift()!, "hex");
    const encryptedText = Buffer.from(textParts.join(":"), "hex");
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32)),
      iv,
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
}

export const securityFacade = new SecurityFacade();

export const hashPassword = (p: string) => securityFacade.hashPassword(p);
export const comparePassword = (p: string, h: string) =>
  securityFacade.verifyPassword(p, h);
export const encryptCard = (t: string) => securityFacade.encryptCardNumber(t);
export const decryptCard = (t: string) => securityFacade.decryptCardNumber(t);
