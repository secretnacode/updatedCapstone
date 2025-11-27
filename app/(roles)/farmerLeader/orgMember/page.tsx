import { OrgMemberTable } from "@/component/client_component/componentForAllUser";
import { RenderRedirectNotification } from "@/component/client_component/provider/notificationProvider";
import { GetFarmerOrgMember } from "@/lib/server_action/farmerUser";
import { GetFarmerOrgMemberReturnType } from "@/types";

export const dynamic = "force-dynamic";

export default async function Page() {
  let farmerMember: GetFarmerOrgMemberReturnType;

  try {
    farmerMember = await GetFarmerOrgMember();
  } catch (error) {
    farmerMember = {
      success: false,
      notifError: [
        {
          message: (error as Error).message,
          type: "error",
        },
      ],
    };
  }

  return (
    <div className="component space-y-6">
      <div>
        <div className="flex justify-start items-center">
          <h1 className="table-title">Mga Miyembro ng Organisasyon</h1>
        </div>
      </div>

      {farmerMember.success ? (
        <OrgMemberTable orgMember={farmerMember.farmerMember} />
      ) : (
        <>
          <RenderRedirectNotification notif={farmerMember.notifError} />
          <OrgMemberTable orgMember={[]} />
        </>
      )}
    </div>
  );
}
