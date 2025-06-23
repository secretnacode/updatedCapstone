import { Redis } from "@upstash/redis";
import { CreateUUID } from "./reusableFunction";
import { cookies } from "next/headers";

const sessionDuration = 36000;

/**
 * initializing the connection of redis up stash so it can be used in this file
 */
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * Creates a new session in Redis and sets the session cookie.
 * @param userId The ID of the authenticated user.
 * @param role The role of the user (optional).
 * @returns The generated session ID.
 */
export const CreateSession = async (
  userId: string,
  role: string
): Promise<string> => {
  const sessionId = CreateUUID();

  // setting the value in the redis, it will set the session id and
  // stringify the objects that will be used for authentication,
  // also adding "ex" object, it will define the expiration of the session
  await redis.set(
    `session: ${sessionId}`,
    JSON.stringify({
      isAuthenticated: true,
      userId: userId,
      role: role,
    }),
    { ex: sessionDuration }
  );

  // setting the cookie in the header together its session id
  // this will be passed in the browser in the header response
  (await cookies()).set("sessionId", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: sessionDuration,
  });

  return sessionId;
};
