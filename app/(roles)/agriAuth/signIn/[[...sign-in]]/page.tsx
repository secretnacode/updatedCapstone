import { AgriSignIn } from "@/component/client_component/authComponent";
import { RenderRedirectNotification } from "@/component/client_component/provider/notificationProvider";
import { NotificationBaseType } from "@/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AgroFarm",
  description: "Sign in page of the agriculturist and admin",
  robots: { index: false, follow: false },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ notif?: string }>;
}) {
  const { notif } = await searchParams;
  let message: NotificationBaseType[] | null = null;

  if (notif) message = JSON.parse(notif);

  return (
    <div className="clerk-modal">
      {message && <RenderRedirectNotification notif={message} />}
      <AgriSignIn />
    </div>
  );
}
