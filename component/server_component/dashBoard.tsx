import { getFarmerLeadDashboardData } from "@/lib/server_action/user";

export const FarmerLeadDashBoard = async () => {
  await getFarmerLeadDashboardData();
  return <div>farmLead</div>;
};

export const FarmerDashBoard = () => {
  return <div>farmer</div>;
};
