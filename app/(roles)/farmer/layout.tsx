import { NavbarComponent } from "@/component/server_component/navbarComponent";
import { farmerAuthorization } from "@/lib/server_action/user";
import { serverActionOptionalNotifMessage } from "@/types";
import {
  RedirectUnauthorizedWithNotif,
  UnexpectedErrorMessage,
} from "@/util/helper_function/reusableFunction";
import { ReactNode } from "react";

export default async function Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  let authorization: serverActionOptionalNotifMessage;

  try {
    authorization = await farmerAuthorization();
  } catch (error) {
    console.error((error as Error).message);
    authorization = {
      success: false,
      notifError: [{ message: UnexpectedErrorMessage(), type: "warning" }],
    };
  }

  if (!authorization.success)
    RedirectUnauthorizedWithNotif(authorization.notifError);

  return (
    <div className="min-h-screen md:flex ">
      <NavbarComponent />

      <main className="p-8">{children}</main>
    </div>
  );
}
