import { GetAllOrganization } from "@/lib/server_action/org";
import { GetAllOrganizationReturnType } from "@/types";

export default async function Page() {
  let allOrg: GetAllOrganizationReturnType;
  try {
    allOrg = await GetAllOrganization();
  } catch (error) {
    allOrg = {
      success: false,
      notifError: [{ message: (error as Error).message, type: "error" }],
    };
  }
  console.log(allOrg);

  return <div>org</div>;
}
