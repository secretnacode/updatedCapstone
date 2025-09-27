import { RedirectManager } from "@/component/client_component/fallbackComponent";
import { NotificationBaseType } from "@/types";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;
  let message: NotificationBaseType[] | null = null;

  if (success) message = JSON.parse(success);

  return (
    <div>
      {message && <RedirectManager data={message} paramName="success" />}
    </div>
  );
}
