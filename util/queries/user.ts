"use server";

import {
  agriAuthQueryReturnType,
  agriculturistRoleType,
  agriIsExistParamType,
  allType,
  allUserRoleType,
  barangayType,
  farmerAuthStatusType,
  FarmerFirstDetailType,
  getCountNotVerifiedFarmerParamType,
  getFarmerDataForResetingPassReturnType,
  GetFarmerOrgMemberQueryReturnType,
  GetFarmerProfileOrgInfoQueryReturnType,
  GetFarmerProfilePersonalInfoQueryReturnType,
  insertNewAgriculturistParamType,
  NewUserType,
  QueryUserLoginReturnType,
  ViewAllUnvalidatedFarmerQueryReturnQuery,
  ViewAllVerifiedFarmerUserQueryReturnType,
} from "@/types";
import { pool } from "../configuration";
import { Hash } from "@/lib/reusableFunctions";
import { CreateUUID } from "../helper_function/reusableFunction";

/**
 * function taht returns all the available auth statuses
 * @returns
 */
export const farmerAuthStatus = async (): Promise<
  Record<farmerAuthStatusType, farmerAuthStatusType>
> => ({
  delete: "delete",
  active: "active",
  block: "block",
});

/**
 * Check the user value by making a query that returns a boolean value.
 * @param {string} username - The username of the new user that is trying to sign up
 * @returns {Promise<boolean>} A promise that either true or false
 * @throws {Error} If the network request fails or an invalid username is provided.
 */
export const CheckUsername = async (username: string): Promise<boolean> => {
  try {
    return (
      await pool.query(
        `select exists(select 1 from capstone.auth where username = $1)`,
        [username]
      )
    ).rows[0].exists;
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag susuri ng username ng user: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag susuri ng username ng user`
    );
  }
};

/**
 * query for inserting new user in the auth table
 * @param {string} data.username - The username of the user that is trying to sign up
 * @param {string} data.password - The hashed password of the new user
 * @param {string} data.userId - UUID of the new user, this ensures the uniqueness of the ID
 * @throws {Error} If the network request fails or an invalid username is provided.
 **/
export const InsertNewUser = async (data: NewUserType): Promise<void> => {
  try {
    const { active } = await farmerAuthStatus();

    await pool.query(
      `insert into capstone.auth ("authId", "username", "password", "status") values ($1, $2, $3, $4)`,
      [data.userId, data.username, data.password, active]
    );
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag lalagay ng impormasyon sa database: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag lalagay ng impormasyon sa database`
    );
  }
};

/**
 * @param username the username of the user that is trying to login
 * @returns a object of exist that is a boolean type, if its false there's an object with it called message, this contains the error message
 * but if the exist is a truthy value, it comes with the data object; it consist of {authId: string, password: string, work: string}
 * @throws {Error} if the network is request fails
 */
export const UserLogin = async (
  username: string
): Promise<QueryUserLoginReturnType> => {
  try {
    const del = (await farmerAuthStatus()).delete;

    // returns a boolean that indicates whether the username exists in the database, the 1 in the select subquery will be returned if the where clause is satisfied, and if the 1 is returned it means it was existing
    const query = await pool.query(
      `select "authId", "password", "status" from capstone.auth where "username" = $1 and "status" <> $2`,
      [username, del]
    );

    if (!query.rows[0])
      return {
        exist: false,
        message: "Mali ang nailagay mong password o username",
      };

    return {
      exist: true,
      data: query.rows[0],
    };
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag lologin ng user: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag lologin ng user`
    );
  }
};

/**
 * query for geting the farmer id base on the authId that was passed
 * @param authId auth Id of the farmer that you want to get its farmerId
 * @returns farmerId
 */
export const getFarmerIdByAuthId = async (
  authId: string
): Promise<{ farmerId: string; orgRole: string }> => {
  try {
    return (
      await pool.query(
        `select f."farmerId", f."orgRole" from capstone.farmer f join capstone.auth a on f."farmerId" = a."authId" where a."authId" = $1`,
        [authId]
      )
    ).rows[0];
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag lologin ng user: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag lologin ng user`
    );
  }
};

/**
 * inserting the value of the new user
 * @param data of the new user that is signing up
 * @returns the farmerId that was inserted
 */
export const FarmerFirstDetailQuery = async (
  data: FarmerFirstDetailType
): Promise<void> => {
  try {
    await pool.query(
      `insert into capstone.farmer ("farmerId", "farmerFirstName", "farmerMiddleName", "farmerLastName", "farmerExtensionName", "farmerAlias", "mobileNumber", "barangay", "birthdate", "verified", "dateCreated", "familyMemberCount") values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        data.farmerId,
        data.firstName,
        data.middleName,
        data.lastName,
        data.extensionName,
        data.alias,
        String(data.mobileNumber),
        data.farmerBarangay,
        data.birthdate,
        data.verified,
        data.dateCreated,
        data.countFamilyMember,
      ]
    );
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag sisign up ng user: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag sisign up ng user`
    );
  }
};

/**
 * query to get the role of the farmer (e.g. member or leader)
 * @param userId id params of the current farmer user
 * @returns the role of the farmer user
 */
export const GetFarmerRole = async (
  userId: string
): Promise<{ orgRole: string }> => {
  try {
    return (
      await pool.query(
        `select "orgRole" from capstone.farmer where "farmerId" = $1`,
        [userId]
      )
    ).rows[0];
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng role ng magsasaka: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng role ng magsasaka`
    );
  }
};

/**
 * query to get the role of the agriculturist (e.g. adming or agriculturist)
 * @param userId id params of the current agriculturist user
 * @returns the role of the agriculturist user
 */
export const GetAgriRole = async (
  userId: string
): Promise<{ agriRole: string }> => {
  try {
    return (
      await pool.query(
        `select "agriRole" from capstone.agriculturist where "agriId" = $1`,
        [userId]
      )
    ).rows[0];
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng role ng agriculturist: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng role ng agriculturist`
    );
  }
};

/**
 * query for getting the necesarry info of the membe in the organizatio
 * @param leaderId id of the farm leader
 * @returns all the user info that is within the organization
 */
export const GetFarmerOrgMemberQuery = async (
  leaderId: string
): Promise<GetFarmerOrgMemberQueryReturnType[]> => {
  try {
    const status = await farmerAuthStatus();

    return (
      await pool.query(
        `select f."farmerId", concat( f."farmerFirstName", ' ', f."farmerLastName") as "farmerName", f."farmerAlias", f."mobileNumber", f."barangay", f."verified", count(c."cropId") as "cropNum", a."status" from capstone.farmer f left join capstone.crop c on f."farmerId" = c."farmerId" join capstone.auth a on f."farmerId" = a."authId" where f."orgId" = (select "orgId" from capstone.farmer where "farmerId" = $1) and f."orgRole" = $2 group by f."farmerId", a."authId" order by case when a."status" = $3 then $4 when a."status" = $5 then $6 else $7 end asc`,
        [leaderId, "member", status.active, 1, status.block, 2, 3]
      )
    ).rows;
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng detalye sa database: ${
        (error as Error).message
      }`,
      error
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng detalye sa database`
    );
  }
};

/**
 * query for updating the verified status of the farmer account
 * @param farmerId id of the farmer you want to approved
 */
export const ApprovedOrgMemberAccQuery = async (farmerId: string) => {
  try {
    await pool.query(
      `update capstone.farmer set "verified" = $1 where "farmerId" = $2`,
      [true, farmerId]
    );
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag aapruba ng mag sasaka sa database: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag aapruba ng mag sasaka sa database`
    );
  }
};

/**
 * checks the current user(usually leader) if the other farmer was its member or not
 * @param farmerId farmer id that you want to check if its the member of the leader id or not
 * @param leaderId current id of the user(leader id)
 * @returns boolean value base on the result that the farmer is a member of the leader or not
 */
export const CheckMyMemberquery = async (
  farmerId: string,
  leaderId: string
): Promise<boolean> => {
  try {
    return (
      await pool.query(
        `select exists(select 1 from capstone.farmer f join capstone.org o on f."orgId" = o."orgId" where f."farmerId" = $1 and o."farmerLeadId" = $2)`,
        [farmerId, leaderId]
      )
    ).rows[0].exists;
  } catch (error) {
    console.error(
      `May hindi inaasahang pagkakamali sa database habang tsinetsek kung ang user nato ay ka miyembro mo: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May hindi inaasahang pagkakamali sa database habang tsinetsek kung ang user nato ay ka miyembro mo`
    );
  }
};

/**
 * getting the necesarry information about the farmer
 * @param farmerId id of the farmer you want to get the info
 * @returns info of the farmer
 */
export const GetFarmerProfilePersonalInfoQuery = async (
  farmerId: string
): Promise<GetFarmerProfilePersonalInfoQueryReturnType> => {
  try {
    return (
      await pool.query(
        `select f."farmerId", f."farmerFirstName", f."farmerAlias", f."mobileNumber", f."barangay", f."birthdate", f."verified", f."farmerLastName", f."farmerMiddleName", f."farmerExtensionName", f."familyMemberCount", a."status" from capstone.farmer f join capstone.auth a on f."farmerId" = a."authId" where f."farmerId" = $1`,
        [farmerId]
      )
    ).rows[0];
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa database habang kinukuha ang mga personal na impormasyon: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa database habang kinukuha ang mga personal na impormasyon`
    );
  }
};

/**
 * getting the necesarry information about the farmer ORG
 * @param farmerId id of the farmer you want to get the info
 * @returns org info of the farmer
 */
export const GetFarmerProfileOrgInfoQuery = async (
  farmerId: string
): Promise<GetFarmerProfileOrgInfoQueryReturnType> => {
  try {
    return (
      await pool.query(
        `select f."orgId", f."orgRole", o."orgName", concat(fl."farmerFirstName", ' ', fl."farmerLastName") as "farmerLeader" from capstone.farmer f join capstone.org o on f."orgId" = o."orgId" join capstone.farmer fl on o."farmerLeadId" = fl."farmerId" where f."farmerId" = $1`,
        [farmerId]
      )
    ).rows[0];
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa database habang kinukuha ang impormasyon ng organisasyon: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa database habang kinukuha ang impormasyon ng organisasyon`
    );
  }
};

/**
 * query for mutating the farmer auth status(active, delete, block)
 * @param farmerId id of the farmer to be mutated
 * @param role role of the user who will make this action(deleting or blocking the user)
 * @param action block or delete
 */
export const blockOrDelteUserAccountQuery = async (
  farmerId: string,
  role: allUserRoleType,
  action: "block" | "delete" | "unblock"
): Promise<void> => {
  try {
    const status = await farmerAuthStatus();

    let query = "";
    let param: allType[] = [];

    if (action === "block" || action === "unblock") {
      query = `update capstone.auth set "status" = $1 where "authId" = $2`;

      if (action === "block") param = [status.active, farmerId];
      else param = [status.block, farmerId];
    } else if (action === "delete") {
      query = `update capstone.auth set "username" = $1, "password" = $2, "status" = $3 where "authId" = $4`;

      param = ["", await Hash(CreateUUID()), status.delete, farmerId];
    }

    await pool.query(query, param);
  } catch (error) {
    const message =
      role === "admin" || role === "agriculturist"
        ? `Unexpected error while ${
            action === "delete"
              ? "deleting"
              : action === "block"
              ? "blocking"
              : "unblocking"
          } the user`
        : `May pagkakamali na hindi inaasahang nang yari sa pag ${
            action === "delete"
              ? "tatanggal"
              : action === "block"
              ? "b-block"
              : "u-unblock"
          } ng account ng user`;

    console.error(`${message}: ${(error as Error).message}`);

    throw new Error(message);
  }
};

/**
 * server action for updating the user information
 * @param userId id of the user
 * @param newProfileInfo new value of the user
 */
export const UpdateUserProfileInfoQuery = async (
  userId: string,
  newProfileInfo: GetFarmerProfilePersonalInfoQueryReturnType
): Promise<void> => {
  try {
    await pool.query(
      `update capstone.farmer set "farmerFirstName" = $1, "farmerAlias" = $2, "mobileNumber" = $3, "barangay" = $4, "birthdate" = $5, "farmerLastName" = $6, "farmerMiddleName" = $7, "farmerExtensionName" = $8, "familyMemberCount" = $9 where "farmerId" = $10`,
      [
        newProfileInfo.farmerFirstName,
        newProfileInfo.farmerAlias,
        newProfileInfo.mobileNumber,
        newProfileInfo.barangay,
        newProfileInfo.birthdate,
        newProfileInfo.farmerLastName,
        newProfileInfo.farmerMiddleName,
        newProfileInfo.farmerExtensionName,
        newProfileInfo.familyMemberCount,
        userId,
      ]
    );
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag uupdate ng user sa database: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag uupdate ng user sa database`
    );
  }
};

/**
 * server action of getting all the farmer that is verified
 * @returns list of verified farmer user
 */
export const ViewAllVerifiedFarmerUserQuery = async (): Promise<
  ViewAllVerifiedFarmerUserQueryReturnType[]
> => {
  try {
    const status = await farmerAuthStatus();

    return (
      await pool.query(
        `select f."farmerId", concat(f."farmerFirstName", ' ', f."farmerLastName") as "farmerName", f."farmerAlias", f."dateCreated", f."orgRole", o."orgName", a."status" from capstone.farmer f left join capstone.org o on f."orgId" = o."orgId" left join capstone.report r on f."farmerId" = r."farmerId" left join capstone.crop c on f."farmerId" = c."farmerId" left join capstone.auth a on a."authId" = f."farmerId" where f."verified" = $1 group by f."farmerId", o."orgId", a."status" order by case when a."status" = $2 then $3 when a."status" = $4 then $5 else $6 end asc`,
        [true, status.active, 1, status.block, 2, 3]
      )
    ).rows;
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng impormasyon ng mga validated na magsasaka: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng impormasyon ng mga validated na  magsasaka`
    );
  }
};

export const ViewAllUnvalidatedFarmerQuery = async (): Promise<
  ViewAllUnvalidatedFarmerQueryReturnQuery[]
> => {
  try {
    return (
      await pool.query(
        `select f."farmerId", concat(f."farmerFirstName", ' ', f."farmerLastName") as "farmerName", f."farmerAlias", f."dateCreated", f."verified", f."orgRole", o."orgName"  from capstone.farmer f left join capstone.org o on f."orgId" = o."orgId" where (f."verified" = $1 and f."orgId" is null) or (f."orgRole" = $2 and f."verified" = $3) order by case when f."orgId" is null then $4 else $5 end asc`,
        [false, "leader", false, 1, 2]
      )
    ).rows;
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng impormasyon ng mga hindi pa validated na magsasaka: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng impormasyon ng mga hindi pa validated na magsasaka`
    );
  }
};

export const farmerIsExist = async (farmerId: string): Promise<boolean> => {
  try {
    return (
      await pool.query(
        `select exists(select 1 from capstone.farmer where "farmerId" = $1)`,
        [farmerId]
      )
    ).rows[0].exists;
  } catch (error) {
    console.log(
      `May pagkakamali na hindi inaasahang nang yari sa pag checheck ng magsasaka: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag checheck ng magsasaka`
    );
  }
};

/**
 * query for getting the farmer id of the farmer leader base on the farmer id
 * @param userId farmer that wants to see the id of the farmer leader
 * @returns org of the farmer
 */
export const getFarmerLeadId = async (userId: string) => {
  try {
    return await pool.query(
      `select c."cropName" from capstone.crop c join capstone.farmer f on c."farmerId" = f."farmerId" where f."farmerId" = $1`,
      [userId]
    );
  } catch (error) {
    console.log((error as Error).message);
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng impormasyon sa iyong leader`
    );
  }
};

/**
 * query for geting all the new user and is not verified yet
 * @param leadId id of the leader that wants to see it
 * @returns count
 */
export const getCountNotVerifiedFarmer = async (
  param: getCountNotVerifiedFarmerParamType
): Promise<number> => {
  try {
    const status = await farmerAuthStatus();

    const dynamicVal: {
      filter: string;
      param: (string | boolean)[];
    } =
      param.userRole === "agriculturist"
        ? {
            filter: `f."verified" = $1 or (f."verified" = $2 and f."orgId" is null) and a."status" <> $3`,
            param: [true, false, status.delete],
          }
        : {
            filter: `f."verified" = $1 and o."farmerLeadId" = $2 and a."status" <> $3`,
            param: [false, param.leaderId, status.delete],
          };

    return (
      await pool.query(
        `select count(f."farmerId") from capstone.farmer f join capstone.org o on f."orgId" = o."orgId" join capstone.auth a on f."farmerId" = a."authId" where ${dynamicVal.filter}`,
        dynamicVal.param
      )
    ).rows[0].count;
  } catch (error) {
    console.log((error as Error).message);
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng mga bagong user na hindi pa naaprubahan`
    );
  }
};

/**
 * qurty for getting the location of the user
 * @param userId user id that you want to get the location
 * @returns location
 */
export const getUserLocation = async (
  userId: string
): Promise<barangayType> => {
  try {
    return (
      await pool.query(
        `select "barangay" from capstone.farmer where "farmerId" = $1`,
        [userId]
      )
    ).rows[0].barangay;
  } catch (error) {
    console.log((error as Error).message);
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng barangay na iyong tinitirhan`
    );
  }
};

/**
 * server action for agriculturist and admin to get the data of the farmer
 */
export const getFarmerDataForResetingPass = async (): Promise<
  getFarmerDataForResetingPassReturnType[]
> => {
  try {
    const status = await farmerAuthStatus();

    return (
      await pool.query(
        `select f."farmerId", a."username", concat(f."farmerFirstName", ' ', f."farmerLastName") as "farmerName" from capstone.farmer f join capstone.auth a on f."farmerId" = a."authId" where a."status" <> $1 order by a."username"`,
        [status.delete]
      )
    ).rows;
  } catch (error) {
    console.log((error as Error).message);
    throw new Error(`Error occured while getting all the farmer's data`);
  }
};

/**
 * query for checking if the pass id was a farmer or not be checking if it exist in the farmer table
 * @param farmerId id that will be checked
 * @returns boolean
 */
export const isFarmer = async (farmerId: string): Promise<boolean> => {
  try {
    return (
      await pool.query(
        `select exists(select 1 from capstone.farmer where "farmerId" = $1)`,
        [farmerId]
      )
    ).rows[0].exists;
  } catch (error) {
    console.log((error as Error).message);
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari habang chinecheck kung farmer ang magsasaka`
    );
  }
};

export const isFarmerLeader = async (userId: string) => {
  try {
    return (
      await pool.query(
        `select exists(select 1 from capstone.farmer where "farmerId" = $1 and "orgRole" = $2)`,
        [userId, "leader"]
      )
    ).rows[0].exist;
  } catch (error) {
    console.log((error as Error).message);
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari habang chinecheck kung farmer leader ang magsasaka`
    );
  }
};

/**
 * query for checking if the farmer was verfied or not
 * @param farmerId id of the farmer that will be checked
 * @returns boolean
 */
export const isFarmerVerified = async (farmerId: string): Promise<boolean> => {
  try {
    return (
      await pool.query(
        `select "verified" from capstone.farmer where "farmerId" = $1`,
        [farmerId]
      )
    ).rows[0].verified;
  } catch (error) {
    console.log((error as Error).message);
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari habang chinecheck kung farmer ang ay beripikado`
    );
  }
};

/**
 * query to check if the id that pass is an agriculturist by checking the agri table
 * @param agriId id that will be checked
 * @returns
 */
export const isAgriculturist = async (agriId: string): Promise<boolean> => {
  try {
    return (
      await pool.query(
        `select exists(select 1 from capstone.agriculturist where "agriId" = $1)`,
        [agriId]
      )
    ).rows[0].exists;
  } catch (error) {
    console.log((error as Error).message);
    throw new Error(
      `Error occured while checking the agriculturist's verification`
    );
  }
};

export const isAdminAgri = async (adminId: string) => {
  try {
    return (
      await pool.query(
        `select exists(select 1 from capstone.agriculturist where "agriId" = $1 and "agriRole" = $2)`,
        [adminId, "admin"]
      )
    ).rows[0].exists;
  } catch (error) {
    console.log((error as Error).message);
    throw new Error(
      `Error occured while checking the agriculturist's verification`
    );
  }
};

/**
 * was created for the roles of the agriculturist to avoid typography
 */
const agriculturistRole: agriculturistRoleType = {
  admin: "admin",
  agriculturist: "agriculturist",
};

/**
 * query for inserting a new value in the agriculturist table
 * @param data
 */
export const insertNewAgriculturist = async (
  data: insertNewAgriculturistParamType
) => {
  try {
    await pool.query(
      `insert into capstone.agriculturist ("agriId", "agriRole", "email", "name") values ($1, $2, $3, $4)`,
      [data.agriId, agriculturistRole.agriculturist, data.userName, data.name]
    );
  } catch (error) {
    console.log((error as Error).message);
    throw new Error(`Error occured while inserting a new agriculturist`);
  }
};

/**
 * query for checking if the user exist
 * @param param0 id and email of the agriculturist to be check
 * @returns
 */
export const agriAuthQuery = async ({
  id,
  email,
}: agriIsExistParamType): Promise<agriAuthQueryReturnType> => {
  try {
    const res = await pool.query(
      `select "agriId" ,"agriRole", "name" from capstone.agriculturist where "agriId" = $1 and "email" = $2`,
      [id, email]
    );

    if (!res.rows[0])
      return {
        exist: false,
        message: "The user does not exist, sign up first!!!",
      };

    return {
      exist: true,
      agriVal: res.rows[0],
    };
  } catch (error) {
    console.log((error as Error).message);
    throw new Error(
      `Error occured while checking the agriculturist's verification`
    );
  }
};

/**
 * function for getting the password of the user
 * @param userId id of the user that wants to get its password
 * @returns password object
 */
export const getPassword = async (
  userId: string
): Promise<{ password: string }> => {
  try {
    return (
      await pool.query(
        `select "password" from capstone.auth where "authId" = $1`,
        [userId]
      )
    ).rows[0];
  } catch (error) {
    console.log((error as Error).message);
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari habang kinukuha ang iyong password`
    );
  }
};

/**
 * query for changing the password of the user
 * @param userId id of the user that will change its password
 * @param newPass new password that will replace the current password
 */
export const updatePassword = async (userId: string, newPass: string) => {
  try {
    await pool.query(
      `update capstone.auth set "password" = $1 where "authId" = $2`,
      [newPass, userId]
    );
  } catch (error) {
    console.log((error as Error).message);
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari habang pinapaltan ang iyong password`
    );
  }
};

/**
 * query for getting all the agri id for notification
 * @returns
 */
export const getAllAgriId = async (): Promise<{ agriId: string }[]> => {
  try {
    return (await pool.query(`select "agriId" from capstone.agriculturist`))
      .rows;
  } catch (error) {
    console.log((error as Error).message);
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari habang pinapaltan ang iyong password`
    );
  }
};

/**
 * query for getting the farmer name
 * @param farmerId id of the farmer to be get
 * @returns farmername
 */
export const getFarmerName = async (farmerId: string): Promise<string> => {
  try {
    return (
      await pool.query(
        `select concat("farmerFirstName", ' ', "farmerLastName") as "farmerName" from capstone.farmer = "farmerId" = $1`,
        [farmerId]
      )
    ).rows[0].farmerName;
  } catch (error) {
    console.log((error as Error).message);
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari habang pinapaltan ang iyong pangalan`
    );
  }
};
