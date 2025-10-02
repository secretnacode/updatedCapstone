"use server";

export const filterReportBaseOnFarmerLeader = () => {
  return `with filtered_report as (select r.(*) from capstone.report r join capstone.farmer f on r."farmerId" = f."farmerId")`;
};
