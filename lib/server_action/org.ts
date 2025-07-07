import { GetAvailableQuery } from "@/util/queries/org";

export const AvailableOrg = async () => {
  try {
    return await GetAvailableQuery();
  } catch (error) {
    const err = error as Error;
    console.log(`Error making a new user: ${err}`);
    return {
      success: false,
      errors: [{ message: `Error making a new user: ${err}`, type: "error" }],
    };
  }
};
