import {
  AgriculturistCreateLinkTable,
  CreateResetPassOrCreateAgriButton,
  CreateResetPasswordButton,
} from "@/component/client_component/componentForAllUser";
import { RenderNotification } from "@/component/client_component/provider/notificationProvider";
import { getAllLinkData } from "@/lib/server_action/link";
import { getAllLinkDataReturnType } from "@/types";
import { UnexpectedErrorMessageEnglish } from "@/util/helper_function/reusableFunction";

export const dynamic = "force-dynamic";

export default async function Page() {
  let linkData: getAllLinkDataReturnType;

  try {
    linkData = await getAllLinkData();
  } catch (error) {
    console.error((error as Error).message);

    linkData = {
      success: false,
      notifError: [{ message: UnexpectedErrorMessageEnglish(), type: "error" }],
    };
  }

  return (
    <div className="component space-y-4">
      <div className=" flex flex-row justify-between items-center mb-4">
        <p className="table-title">List of Links</p>

        {linkData.success && linkData.work === "admin" ? (
          <CreateResetPassOrCreateAgriButton />
        ) : (
          <CreateResetPasswordButton />
        )}
      </div>

      {linkData.success ? (
        <AgriculturistCreateLinkTable
          work={linkData.work}
          links={linkData.links}
        />
      ) : (
        <>
          <RenderNotification notif={linkData.notifError} />
          <AgriculturistCreateLinkTable work={"agriculturist"} links={[]} />
        </>
      )}
    </div>
  );
}
