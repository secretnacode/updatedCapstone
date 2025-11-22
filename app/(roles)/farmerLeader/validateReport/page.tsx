import { ValidateReportTable } from "@/component/client_component/componentForAllUser";
import { RenderRedirectNotification } from "@/component/client_component/provider/notificationProvider";
import { GetOrgMemberReport } from "@/lib/server_action/report";
import { GetOrgMemberReportReturnType } from "@/types";

export const dynamic = "force-dynamic";

export default async function Page() {
  let orgReport: GetOrgMemberReportReturnType;

  try {
    orgReport = await GetOrgMemberReport();
  } catch (error) {
    const err = error as Error;
    orgReport = {
      success: false,
      notifError: [
        {
          message: err.message,
          type: "error",
        },
      ],
    };
  }

  return (
    <div className="component space-y-6">
      <div>
        <div className="flex justify-start items-center">
          <h1 className="table-title">Mga ulat ng ka-miyembro</h1>
        </div>
      </div>

      {orgReport.success ? (
        <ValidateReportTable memberReport={orgReport.memberReport} />
      ) : (
        <>
          <RenderRedirectNotification notif={orgReport.notifError} />

          <ValidateReportTable memberReport={[]} />
        </>
      )}
    </div>
  );
}
