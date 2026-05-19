import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const SALT = "INFRAMEET-SALT-2026";

/**
 * Encrypts a string payload using AES-256-GCM authenticated encryption.
 * Returns the hex cipher, dynamic IV, and GCM authentication tag.
 */
export function encryptPayload(payload: string, secretKey: string) {
  const key = crypto.scryptSync(secretKey, SALT, 32);
  const iv = crypto.randomBytes(12); // GCM standard IV size is 12 bytes
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(payload, "utf8", "hex");
  encrypted += cipher.final("hex");
  
  const authTag = cipher.getAuthTag().toString("hex");
  
  return {
    iv: iv.toString("hex"),
    authTag: authTag,
    encryptedData: encrypted
  };
}

/**
 * Decrypts an AES-256-GCM encrypted payload and validates the auth tag.
 */
export function decryptPayload(
  encryptedData: string, 
  secretKey: string, 
  ivHex: string, 
  authTagHex: string
) {
  const key = crypto.scryptSync(secretKey, SALT, 32);
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  
  return decrypted;
}
