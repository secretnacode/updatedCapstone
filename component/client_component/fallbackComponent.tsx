"use client";

import { NotificationBaseType } from "@/types";
import { FC, useEffect } from "react";
import { useNotification } from "./provider/notificationProvider";
import { useRouter } from "next/navigation";

export const NotifFallBack: FC<{ data: NotificationBaseType[] }> = ({
  data,
}) => {
  const { handleSetNotification } = useNotification();
  const route = useRouter();

  useEffect(() => {
    if (data) handleSetNotification(data);

    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete("error");
    route.replace(currentUrl.pathname + currentUrl.search, { scroll: false });
  }, [data, handleSetNotification, route]);

  return null;
};
