import { farmerLeaderAuthorization } from "@/lib/server_action/user";
import { serverActionOptionalNotifMessage } from "@/types";
import {
  RedirectUnauthorizedWithError,
  UnexpectedErrorMessage,
} from "@/util/helper_function/reusableFunction";
import { ReactNode } from "react";

export default async function Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  let authorization: serverActionOptionalNotifMessage;

  try {
    authorization = await farmerLeaderAuthorization();
  } catch (error) {
    console.error((error as Error).message);
    authorization = {
      success: false,
      notifError: [{ message: UnexpectedErrorMessage(), type: "warning" }],
    };
  }

  if (!authorization.success)
    RedirectUnauthorizedWithError(authorization.notifError);

  return <div>{children}</div>;
}
