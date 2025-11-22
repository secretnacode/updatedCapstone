import { checkResetPass } from "@/lib/server_action/link";
import { serverActionOptionalNotifMessage } from "@/types";
import {
  RedirectUnauthorizedWithNotif,
  UnexpectedErrorMessage,
} from "@/util/helper_function/reusableFunction";

export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  let checkToken: serverActionOptionalNotifMessage;

  try {
    checkToken = await checkResetPass((await params).token);
  } catch (error) {
    console.log((error as Error).message);
    checkToken = {
      success: false,
      notifError: [{ message: UnexpectedErrorMessage(), type: "warning" }],
    };
  }

  if (!checkToken.success)
    return RedirectUnauthorizedWithNotif(checkToken.notifError);

  return <div>{(await params).token}</div>;
}
