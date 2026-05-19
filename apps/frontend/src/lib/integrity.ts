import * as jose from "jose";
import * as crypto from "crypto";

// Transient in-memory key pair fallback for local development / zero-config
let cachedPrivateKey: any = null;
let cachedPublicKey: any = null;

/**
 * Returns the ES256 key pair, dynamically importing from environment variables
 * or generating a temporary in-memory key pair if they are missing (zero-config).
 */
export async function getIntegrityKeys() {
  if (cachedPrivateKey && cachedPublicKey) {
    return { privateKey: cachedPrivateKey, publicKey: cachedPublicKey };
  }

  const envPrivateKey = process.env.INTEGRITY_PRIVATE_KEY;
  const envPublicKey = process.env.INTEGRITY_PUBLIC_KEY;

  if (envPrivateKey && envPublicKey) {
    try {
      // Import PEM PKCS#8 private key and SPKI public key
      cachedPrivateKey = await jose.importPKCS8(envPrivateKey.replace(/\\n/g, "\n"), "ES256");
      cachedPublicKey = await jose.importSPKI(envPublicKey.replace(/\\n/g, "\n"), "ES256");
      return { privateKey: cachedPrivateKey, publicKey: cachedPublicKey };
    } catch (err) {
      console.warn("Failed to import ES256 key pair from environment variables. Falling back to dynamic key pair:", err);
    }
  }

  // Self-healing: generate transient ECDSA P-256 key pair for zero-config local development
  try {
    const { privateKey, publicKey } = await jose.generateKeyPair("ES256", {
      extractable: true,
    });
    cachedPrivateKey = privateKey;
    cachedPublicKey = publicKey;
    return { privateKey, publicKey };
  } catch (err) {
    console.error("Critical: Failed to generate transient cryptographic keys:", err);
    throw err;
  }
}

/**
 * Generates a SHA-256 hash of any JSON-serializable object
 */
export function calculateSHA256(payload: any): string {
  const jsonString = JSON.stringify(payload);
  return crypto.createHash("sha256").update(jsonString).digest("hex");
}

/**
 * Cryptographically signs a payload (ES256) and returns the JWT token and SHA-256 hash
 */
export async function signData(
  subjectId: string,
  subjectType: "EXPERT" | "BAST" | "PROJECT",
  payload: any
): Promise<{ token: string; hash: string }> {
  const { privateKey } = await getIntegrityKeys();
  const hash = calculateSHA256(payload);

  const token = await new jose.SignJWT({
    ...payload,
    subjectId,
    subjectType,
    sha256Hash: hash,
  })
    .setProtectedHeader({ alg: "ES256", typ: "JWT" })
    .setIssuedAt()
    .setIssuer("INFRAMEET Integrity Authority")
    .setExpirationTime("100y") // Permanent lifetime
    .sign(privateKey);

  return { token, hash };
}

/**
 * Cryptographically verifies a token signature and returns the verified payload
 */
export async function verifySignature(token: string): Promise<any> {
  const { publicKey } = await getIntegrityKeys();
  try {
    const { payload } = await jose.jwtVerify(token, publicKey, {
      issuer: "INFRAMEET Integrity Authority",
    });
    return payload;
  } catch (err: any) {
    console.error("Cryptographic signature verification failed:", err.message);
    throw new Error(`Invalid signature: ${err.message}`);
  }
}
