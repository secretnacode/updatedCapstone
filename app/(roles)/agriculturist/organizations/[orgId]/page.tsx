import { RenderNotification } from "@/component/client_component/fallbackComponent";
import { OrganizationMemberList } from "@/component/server_component/componentForAllUser";
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
    <>
      {!orgMemberList.success ? (
        <RenderNotification notif={orgMemberList.notifError} />
      ) : (
        <OrganizationMemberList memberList={orgMemberList.memberList} />
      )}
    </>
  );
}
