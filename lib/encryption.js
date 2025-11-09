import crypto from "crypto";

// Use a 32-byte key (256 bits) and 16-byte IV
const SECRET_KEY = process.env.MESSAGE_SECRET_KEY; // store in .env
const IV = crypto.randomBytes(16);

export function encrypt(text) {
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(SECRET_KEY, "hex"),
    IV
  );
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return IV.toString("hex") + ":" + encrypted; // store IV + ciphertext
}

export function decrypt(encryptedText) {
  const [ivHex, data] = encryptedText.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(SECRET_KEY, "hex"),
    iv
  );
  let decrypted = decipher.update(data, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
