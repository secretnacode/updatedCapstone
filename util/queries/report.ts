import {
  AddNewFarmerReportQueryType,
  GetAllFarmerReportQueryReturnType,
  GetFarmerReportDetailQueryReturnType,
  GetOrgMemberReportQueryType,
  GetUserReportReturnType,
} from "@/types";
import { pool } from "../configuration";

export const GetUserReport = async (
  userId: string
): Promise<GetUserReportReturnType> => {
  try {
    return (
      await pool.query(
        `select r."reportId", r."verificationStatus",  r."dayReported", r."dayHappen",  r."title", c."cropName" from capstone.report r join capstone.crop c on r."cropId" = c."cropId" where r."farmerId" = $1`,
        [userId]
      )
    ).rows;
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari habang kinukuha ang mga impormasyon ng mga ulat: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari habang kinukuha ang mga impormasyon ng mga ulat`
    );
  }
};

/**
 * query for inserting the new value of the report in the db
 * @param data are the needed value in the insertion
 */
export const AddNewFarmerReport = async (
  data: AddNewFarmerReportQueryType
): Promise<void> => {
  try {
    await pool.query(
      `insert into capstone.report ("reportId", "farmerId", "verificationStatus", "dayReported", "dayHappen", "title", "description", "cropId", "orgId") values ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        data.reportId,
        data.farmerId,
        data.verificationStatus,
        data.dayReported,
        data.dayHappen,
        data.reportTitle,
        data.reportDescription,
        data.cropId,
        data.orgId,
      ]
    );
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag gagawa ng panibagong ulat: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag gagawa ng panibagong ulat`
    );
  }
};

export const GetFarmerReportDetailQuery = async (
  reportId: string
): Promise<GetFarmerReportDetailQueryReturnType> => {
  try {
    return (
      await pool.query(
        `SELECT r."cropId", r."verificationStatus", r."dayReported", r."dayHappen", r."title", r."description", string_agg(i."imageUrl", ', ') as pictures from capstone.report r left join capstone.image i ON r."reportId" = i."reportId" WHERE r."reportId" = $1 GROUP BY r."reportId", r."cropId", r."verificationStatus", r."dayReported", r."dayHappen", r."title"`,
        [reportId]
      )
    ).rows[0];
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng impormasyon ng ulat: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng impormasyon ng ulat`
    );
  }
};

/**
 * gets the report of the member in the same organization
 * @param orgId id of the organization that you want to see the reports
 * @returns reports of the members within the organization
 */
export const GetOrgMemberReportQuery = async (
  orgId: string
): Promise<GetOrgMemberReportQueryType> => {
  try {
    return (
      await pool.query(
        `select r."reportId", r."verificationStatus", r."dayReported", r."title", f."farmerFirstName", f."farmerLastName", f."farmerAlias" from capstone.report r join capstone.farmer f on f."farmerId" = r."farmerId" where f."orgId" = $1 order by case when r."verificationStatus" = $2 then $3 else $4 end asc`,
        [orgId, "false", 1, 2]
      )
    ).rows;
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng mga ulat: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng mga ulat`
    );
  }
};

/**
 * query for approving the farmer org member
 * @param reportId id that you want to approved
 */
export const ApprovedOrgMemberQuery = async (reportId: string) => {
  try {
    await pool.query(
      `update capstone.report set "verificationStatus" = $1, "orgId" = (select f."orgId" from capstone.farmer f join capstone.report r on f."farmerId" = r."farmerId" where r."reportId" = $2), "dayVerified" = $3 where "reportId" = $4`,
      ["pending", reportId, new Date(), reportId]
    );
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag aapruba ng ulat: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag aapruba ng ulat`
    );
  }
};

/**
 * server action for getting all the farmer report information where the status of it is pending or is null
 * @returns farmer report information
 */
export const GetAllFarmerReportQuery =
  async (): Promise<GetAllFarmerReportQueryReturnType> => {
    try {
      return (
        await pool.query(
          `select r."reportId", c."cropLocation", r."verificationStatus", concat(f."farmerFirstName", ' ', f."farmerLastName") as "farmerName", r."dayReported", r."dayHappen", o."orgName" from capstone.report r join capstone.farmer f on r."farmerId" = f."farmerId" left join capstone.org o on r."orgId" = o."orgId" left join capstone.crop c on r."cropId" = c."cropId" where r."verificationStatus" = $1 or f."orgId" is null`,
          ["pending"]
        )
      ).rows;
    } catch (error) {
      console.error(
        `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng mga ulat: ${
          (error as Error).message
        }`
      );
      throw new Error(
        `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng mga ulat`
      );
    }
  };

/**
 * function for getting all the report count that was passed to the farmer leader today
 * @param farmerLeadId id of the farmer leader that wants to see the total count of report that was made today
 * @returns count of reports
 */
export const getCountReportToday = async (
  farmerLeadId: string
): Promise<number> => {
  try {
    return (
      await pool.query(
        `select count(r."title") from capstone.report r left join capstone.farmer f on r."farmerId" = f."farmerId" join capstone.org o on f."orgId" = o."orgId" join capstone.farmer fl on o."farmerLeadId" = fl."farmerId" where fl."farmerId" = $1 and date(r."dayReported") = current_date`,
        [farmerLeadId]
      )
    ).rows[0].count;
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng mga ulat: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng mga ulat`
    );
  }
};

/**
 * query for getting the count of unvalidated report
 * @param farmerLeadId id of the farmerLeader that wants to know the count of unvalidated report
 * @returns number of unvalidated report
 */
export const getCountUnvalidatedReport = async (
  farmerLeadId: string
): Promise<number> => {
  try {
    return (
      await pool.query(
        `select count(r."verificationStatus") from capstone.report r left join capstone.farmer f on r."farmerId" = f."farmerId" join capstone.org o on f."orgId" = o."orgId" join capstone.farmer fl on o."farmerLeadId" = fl."farmerId" where fl."farmerId" = $1 and r."verificationStatus" = $2`,
        [farmerLeadId, "false"]
      )
    ).rows[0].count;
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng unvalidated na ulat: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng unvalidated na ulat`
    );
  }
};

/**
 * query for getting the count that the user made today
 * @param userId id of the user that wants to know the report it made today
 * @returns number
 */
export const getCountMadeReportToday = async (
  userId: string
): Promise<number> => {
  try {
    return (
      await pool.query(
        `select count("reportId") from capstone.report where "farmerId" = $1`,
        [userId]
      )
    ).rows[0].count;
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng ulat na isinagawa mo: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng ulat na isinagawa mo`
    );
  }
};

export const getReportCountThisWeek = async () => {
  try {
    await pool.query(
      `select to_char("dayReported", 'FMDay') as dayOfWeek, count(select 1 from capstone.report where )`
    );
  } catch (error) {
    console.error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng ulat na isinagawa mo: ${
        (error as Error).message
      }`
    );
    throw new Error(
      `May pagkakamali na hindi inaasahang nang yari sa pag kuha ng ulat na isinagawa mo`
    );
  }
};
