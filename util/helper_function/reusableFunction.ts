import { v4 as uuidv4 } from "uuid";

/**
 * Generates a new UUID (Universally Unique Identifier).
 * @returns {string} A new UUID.
 */
export function CreateUUID(): string {
  return uuidv4();
}

export function HandleErrorReturn(error: Error, message: string) {
  console.log(`${message}: ${error.message}`);
  throw new Error(`${message}: ${error.message}`);
}
