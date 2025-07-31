"use client";

import { NotificationBaseType } from "@/types";
import { FC, useEffect } from "react";
import { useNotification } from "./provider/notificationProvider";
import { useRouter } from "next/navigation";
import { useLoading } from "./provider/loadingProvider";

export const RedirectManager: FC<{
  data: NotificationBaseType[] | undefined;
  paramName: string;
}> = ({ data, paramName }) => {
  console.log("Redirect manager component");
  const { handleSetNotification } = useNotification();
  const { isLoading, handleDoneLoading } = useLoading();
  const route = useRouter();

  useEffect(() => {
    if (data) handleSetNotification(data);
    if (isLoading) handleDoneLoading();
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete(paramName);
    route.replace(currentUrl.pathname + currentUrl.search, { scroll: false });
  }, [
    data,
    handleSetNotification,
    route,
    isLoading,
    handleDoneLoading,
    paramName,
  ]);

  return null;
};
