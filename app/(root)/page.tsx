import { AuthForm } from "@/component/client_component/authComponent";
import { RedirectManager } from "@/component/client_component/fallbackComponent";
import { NotificationBaseType } from "@/types";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ notif?: string }>;
}) {
  const { notif } = await searchParams;
  let message: NotificationBaseType[] | null = null;

  if (notif) message = JSON.parse(notif);

  return (
    <div className="w-[90%] max-w-md">
      {message && <RedirectManager data={message} />}
      <AuthForm />
    </div>
  );
}
