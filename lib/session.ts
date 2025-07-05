"use server";

import { Redis } from "@upstash/redis";
import { CreateUUID } from "../util/helper_function/reusableFunction";
import { cookies } from "next/headers";
import { SessionValueType } from "@/types";

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

/**
 * Getting the session value that was store in the
 * @returns sessionVal object that contains all the in the session storage
 */
export const GetSession = async (): Promise<SessionValueType> => {
  // getting the cookie that was stored in the browser
  const sessionId = (await cookies()).get(`sessionId`)?.value;

  if (!sessionId) return null;

  const sessionWord = `session: ${sessionId}`;

  const sessionVal = (await redis.get(sessionWord)) as SessionValueType;

  if (!sessionVal) return null;

  await redis.expire(sessionWord, sessionDuration);

  return sessionVal;
};
