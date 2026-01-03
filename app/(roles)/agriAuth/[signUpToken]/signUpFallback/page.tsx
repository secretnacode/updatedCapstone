import { AgriAuthSignUp } from "@/component/client_component/authComponent";
import { LoadingScreen } from "@/component/server_component/customComponent";
import { checkAlreadySignUpAgri } from "@/lib/server_action/link";
import { serverActionOptionalNotifMessage } from "@/types";
import {
  RedirectUnauthorizedWithNotif,
  UnexpectedErrorMessageEnglish,
} from "@/util/helper_function/reusableFunction";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AgroFarm",
  description:
    "Fallback page for sign up where it will check if the token is existing and is valid before signing up the user in the database",
  robots: { index: false, follow: false },
};

export default async function Page({
  params,
}: {
  params: Promise<{ signUpToken: string }>;
}) {
  let checkToken: serverActionOptionalNotifMessage;

  const token = (await params).signUpToken;

  try {
    checkToken = await checkAlreadySignUpAgri(token);
  } catch (error) {
    console.error((error as Error).message);

    checkToken = {
      success: false,
      notifError: [{ message: UnexpectedErrorMessageEnglish(), type: "error" }],
    };
  }

  if (!checkToken.success) RedirectUnauthorizedWithNotif(checkToken.notifError);

  return (
    <div>
      <LoadingScreen />
      <AgriAuthSignUp token={token} />
    </div>
  );
}
