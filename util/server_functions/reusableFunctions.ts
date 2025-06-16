import { hashSync } from "bcrypt";

export function Hash(word: string): string {
  return hashSync(word, 10);
}
