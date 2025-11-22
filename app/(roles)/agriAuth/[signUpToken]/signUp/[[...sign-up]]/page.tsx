import { AgriSignUp } from "@/component/client_component/authComponent";
import { checkSignUp } from "@/lib/server_action/link";
import { serverActionOptionalNotifMessage } from "@/types";
import {
  RedirectUnauthorizedWithNotif,
  UnexpectedErrorMessageEnglish,
} from "@/util/helper_function/reusableFunction";

export default async function Page({
  params,
}: {
  params: Promise<{ signUpToken: string }>;
}) {
  let checkToken: serverActionOptionalNotifMessage;

  try {
    checkToken = await checkSignUp((await params).signUpToken);
  } catch (error) {
    console.error((error as Error).message);

    checkToken = {
      success: false,
      notifError: [{ message: UnexpectedErrorMessageEnglish(), type: "error" }],
    };
  }

  if (!checkToken.success) RedirectUnauthorizedWithNotif(checkToken.notifError);

  return (
    <div className="clerk-modal">
      <AgriSignUp />
    </div>
  );
}
