import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;
const ITERATIONS = 100000;

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "";

if (!ENCRYPTION_KEY) {
  console.warn(
    "WARNING: ENCRYPTION_KEY is not set. Token encryption will fail.",
  );
}

/**
 * Encrypts text using AES-256-GCM
 */
export function encrypt(text: string): string {
  if (!text) return text;
  if (!ENCRYPTION_KEY) throw new Error("Encryption key not configured");

  const iv = crypto.randomBytes(IV_LENGTH);
  const salt = crypto.randomBytes(SALT_LENGTH);

  // Derive key using PBKDF2
  const key = crypto.pbkdf2Sync(
    ENCRYPTION_KEY,
    salt,
    ITERATIONS,
    KEY_LENGTH,
    "sha512",
  );

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  // Format: salt + iv + tag + encrypted_data
  return Buffer.concat([salt, iv, tag, encrypted]).toString("hex");
}

/**
 * Decrypts text using AES-256-GCM
 */
export function decrypt(text: string): string {
  if (!text) return text;
  if (!ENCRYPTION_KEY) throw new Error("Encryption key not configured");

  try {
    const data = Buffer.from(text, "hex");

    const salt = data.subarray(0, SALT_LENGTH);
    const iv = data.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const tag = data.subarray(
      SALT_LENGTH + IV_LENGTH,
      SALT_LENGTH + IV_LENGTH + TAG_LENGTH,
    );
    const textData = data.subarray(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);

    const key = crypto.pbkdf2Sync(
      ENCRYPTION_KEY,
      salt,
      ITERATIONS,
      KEY_LENGTH,
      "sha512",
    );

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    return decipher.update(textData) + decipher.final("utf8");
  } catch (error) {
    console.error("Decryption failed:", error);
    return text; // Fallback or throw? Ideally throw, but for migration safety returning null/empty might be better.
    // Here we return null or throw. Let's throw for now to catch bugs.
    throw new Error("Failed to decrypt data");
  }
}
