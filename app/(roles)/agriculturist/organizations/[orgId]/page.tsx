import { RenderNotification } from "@/component/client_component/fallbackComponent";
import { OrganizationMemberList } from "@/component/server_component/componentForAllUser";
import { GetAllOrgMemberList } from "@/lib/server_action/org";
import { isDynamicValueExist } from "@/lib/server_action/user";
import { GetAllOrgMemberListReturnType } from "@/types";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  let orgMemberList: GetAllOrgMemberListReturnType;
  let isExistDynamicVal: boolean | undefined;

  try {
    orgMemberList = await GetAllOrgMemberList((await params).orgId);

    isExistDynamicVal = await isDynamicValueExist(
      "agriculturist/organizations",
      (
        await params
      ).orgId
    );
  } catch (error) {
    orgMemberList = {
      success: false,
      notifError: [{ message: (error as Error).message, type: "error" }],
    };
  }

  if (!isExistDynamicVal) notFound();

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
