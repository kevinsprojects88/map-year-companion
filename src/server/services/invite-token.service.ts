import { createHash, randomBytes } from "node:crypto";

const INVITE_TOKEN_BYTE_LENGTH = 32;

function generateInviteToken() {
  return randomBytes(INVITE_TOKEN_BYTE_LENGTH).toString("base64url");
}

function hashInviteToken(token: string) {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export { generateInviteToken, hashInviteToken, INVITE_TOKEN_BYTE_LENGTH };
