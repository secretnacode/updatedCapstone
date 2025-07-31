import { RedirectManager } from "@/component/client_component/fallbackComponent";
import { NotificationBaseType } from "@/types";

export default async function Page({
  params,
}: {
  params: Promise<{ success?: string }>;
}) {
  console.log(`Farmer main page`);

  const { success } = await params;
  let message: NotificationBaseType[] | null = null;

  if (success) message = JSON.parse(decodeURIComponent(success));
  console.log(message);

  return (
    <div>
      {message && <RedirectManager data={message} paramName="success" />}
    </div>
  );
}
