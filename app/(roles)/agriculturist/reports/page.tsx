import { GetAllFarmerReport } from "@/lib/server_action/report";

export default async function Page() {
  const farmerReport = await GetAllFarmerReport();
  console.log(farmerReport);
  return <div>hewow</div>;
}
