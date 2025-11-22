import { AgriculturistFarmerOrgTable } from "@/component/client_component/componentForAllUser";
import { RenderRedirectNotification } from "@/component/client_component/provider/notificationProvider";
import { GetAllOrganization } from "@/lib/server_action/org";
import { GetAllOrganizationReturnType } from "@/types";
export const dynamic = "force-dynamic";

export default async function Page() {
  let availableOrgs: GetAllOrganizationReturnType;
  try {
    availableOrgs = await GetAllOrganization();
  } catch (error) {
    availableOrgs = {
      success: false,
      notifError: [{ message: (error as Error).message, type: "error" }],
    };
  }

  return (
    <div className="component space-y-4">
      <div>
        <h1 className="table-title">Farmer Organization</h1>
      </div>

      {!availableOrgs.success ? (
        <>
          <RenderRedirectNotification notif={availableOrgs.notifError} />

          <AgriculturistFarmerOrgTable orgVal={[]} />
        </>
      ) : (
        <AgriculturistFarmerOrgTable orgVal={availableOrgs.orgList} />
      )}
    </div>
  );
}
