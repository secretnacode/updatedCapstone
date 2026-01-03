import { AuthForm } from "@/component/client_component/authComponent";
import { RenderRedirectNotification } from "@/component/client_component/provider/notificationProvider";
import { AuthBaseDesign } from "@/component/server_component/customComponent";
import { checkUserAlreadyLogin } from "@/lib/server_action/user";
import { checkUserAlreadyLoginReturnType, NotificationBaseType } from "@/types";
import { UnexpectedErrorMessage } from "@/util/helper_function/reusableFunction";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AgroFarm",
  description: "Reporting system for calauan that specialized in rice crops",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ notif?: string }>;
}) {
  const { notif } = await searchParams;
  let message: NotificationBaseType[] | null = null;

  if (notif) message = JSON.parse(notif);

  let checkSession: checkUserAlreadyLoginReturnType | null = null;

  try {
    checkSession = await checkUserAlreadyLogin();
  } catch (error) {
    if (isRedirectError(error)) throw error;

    console.error((error as Error).message);

    checkSession = {
      success: false,
      notifError: [{ message: UnexpectedErrorMessage(), type: "error" }],
    };
  }

  return (
    <AuthBaseDesign isEnglish={false}>
      {message && <RenderRedirectNotification notif={message} />}

      {checkSession && !checkSession.success && (
        <RenderRedirectNotification notif={checkSession.notifError} />
      )}

      <AuthForm />
    </AuthBaseDesign>
  );
}
