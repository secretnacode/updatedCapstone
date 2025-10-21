"use server";

import {
  CreateUUID,
  UnexpectedErrorMessageEnglish,
} from "../util/helper_function/reusableFunction";
import { cookies } from "next/headers";
import { allUserRoleType, SessionValueType } from "@/types";
import { Redis } from "@upstash/redis";

const sessionDuration = 36000;

/**
 * initializing the connection of redis up stash so it can be used in this file
 */
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * getting the cookie id
 * @returns value of the cookie
 */
const GetCookieId = async (): Promise<string | undefined> => {
  return (await cookies()).get(`sessionId`)?.value;
};

/**
 * returning the session name together with its structure
 * @param cookieId of the cookie
 * @returns key of the session
 */
const SessionName = (cookieId: string) => `session: ${cookieId}`;

/**
 * helper function for no cookie detected message
 */
const noCookieDetectedMessage = (type: "updating" | "getting" | "deleting") =>
  `There's no cookie detected while ${type} the session`;

/**
 * helper function for no session detected message
 */
const noSessionDetectedMessage = (type: "updating" | "getting" | "deleting") =>
  `There's no session detected while ${type} the session`;

/**
 * Creates a new session in Redis and sets the session cookie.
 * @param userId The ID of the authenticated user.
 * @param work The role of the user (optional).
 * @returns The generated session ID.
 */
export const CreateSession = async (
  userId: string,
  work: allUserRoleType | "newUser"
): Promise<boolean> => {
  try {
    const sessionId = CreateUUID();

    // setting the value in the redis, it will set the session id and
    // stringify the objects that will be used for authentication,
    // also adding "ex" object, it will define the expiration of the session
    await redis.set(
      SessionName(sessionId),
      JSON.stringify({
        userId: userId,
        work: work,
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

    return true;
  } catch (error) {
    throw new Error(
      `${UnexpectedErrorMessageEnglish()} while creating session: ${
        (error as Error).message
      }`
    );
  }
};

/**
 * Getting the session value that was store in the
 * @returns sessionVal object that contains all the in the session storage
 */
export const GetSession = async (): Promise<SessionValueType | null> => {
  try {
    // getting the cookie that was stored in the browser

    const cookie = await GetCookieId();

    if (!cookie) throw new Error(`${noCookieDetectedMessage("getting")}`);

    const sessionVal = (await redis.get(
      SessionName(cookie)
    )) as SessionValueType;

    if (!sessionVal) throw new Error(`${noSessionDetectedMessage("getting")}`);

    return sessionVal;
  } catch (error) {
    throw new Error(
      `${UnexpectedErrorMessageEnglish()} while getting the current sesion: ${
        (error as Error).message
      }`
    );
  }
};

/**
 * function for updating the role of the session val, used after the sign up
 * @param role value of the role you want to chang into
 */
export const UpdateSessionRole = async (role: "leader" | "farmer") => {
  try {
    const cookie = await GetCookieId();

    if (!cookie) throw new Error(`${noCookieDetectedMessage("updating")}`);

    const sessionWord = SessionName(cookie);

    const sessionVal = (await redis.get(sessionWord)) as SessionValueType;

    if (!sessionVal) throw new Error(`${noSessionDetectedMessage("updating")}`);

    await redis.set(
      sessionWord,
      JSON.stringify({ ...sessionVal, work: role }),
      { ex: sessionDuration }
    );
  } catch (error) {
    throw new Error(
      `${UnexpectedErrorMessageEnglish()} while updating the session: ${
        (error as Error).message
      }`
    );
  }
};

export const DeleteSession = async () => {
  try {
    const cookie = await GetCookieId();

    if (!cookie) throw new Error(`${noCookieDetectedMessage("deleting")}`);

    const sessionWord = SessionName(cookie);

    const sessionVal = (await redis.get(sessionWord)) as SessionValueType;

    if (!sessionVal) throw new Error(`${noSessionDetectedMessage("deleting")}`);

    await redis.del(sessionWord);
  } catch (error) {
    throw new Error(
      `${UnexpectedErrorMessageEnglish()} while updating the session: ${
        (error as Error).message
      }`
    );
  }
};
