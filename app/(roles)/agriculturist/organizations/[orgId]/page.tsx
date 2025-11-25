import { AgriculturistOrgMemberTable } from "@/component/client_component/componentForAllUser";
import { RenderRedirectNotification } from "@/component/client_component/provider/notificationProvider";
import { GetAllOrgMemberList } from "@/lib/server_action/org";
import { GetAllOrgMemberListReturnType } from "@/types";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  let orgMemberList: GetAllOrgMemberListReturnType;

  try {
    orgMemberList = await GetAllOrgMemberList((await params).orgId);
  } catch (error) {
    orgMemberList = {
      success: false,
      notifError: [{ message: (error as Error).message, type: "error" }],
    };
  }

  if (!orgMemberList.success && !orgMemberList.isExist) notFound();

  return (
    <div className="component space-y-4">
      <div>
        <h1 className="table-title">{`Member/s of the ${
          orgMemberList.success ? orgMemberList.orgName : "unknown"
        } organization`}</h1>
      </div>

      {!orgMemberList.success ? (
        <>
          <RenderRedirectNotification notif={orgMemberList.notifError} />
          <AgriculturistOrgMemberTable orgMem={[]} />
        </>
      ) : (
        <AgriculturistOrgMemberTable orgMem={orgMemberList.memberList} />
      )}
    </div>
  );
}
