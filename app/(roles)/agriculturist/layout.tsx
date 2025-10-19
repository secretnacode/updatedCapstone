import { NavbarComponent } from "@/component/server_component/navbarComponent";
import { agriculturistAuthorization } from "@/lib/server_action/user";
import { serverActionOptionalNotifMessage } from "@/types";
import {
  RedirectUnauthorizedWithError,
  UnexpectedErrorMessageEnglish,
} from "@/util/helper_function/reusableFunction";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  let authorization: serverActionOptionalNotifMessage;

  try {
    authorization = await agriculturistAuthorization();
  } catch (error) {
    console.error((error as Error).message);
    authorization = {
      success: false,
      notifError: [{ message: UnexpectedErrorMessageEnglish(), type: "error" }],
    };
  }

  if (!authorization.success)
    RedirectUnauthorizedWithError(authorization.notifError);
  return (
    <div className="min-h-screen flex">
      <NavbarComponent />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
