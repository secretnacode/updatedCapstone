import { RedirectManager } from "@/component/client_component/fallbackComponent";
import { NotificationBaseType } from "@/types";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  console.log(`Farmer main page`);

  const { success } = await searchParams;
  let message: NotificationBaseType[] | null = null;

  if (success) message = JSON.parse(success);

  return (
    <div>
      {message && <RedirectManager data={message} paramName="success" />}
    </div>
  );
}
