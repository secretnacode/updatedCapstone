"use client";

import { NotificationBaseType } from "@/types";
import { FC, memo, useEffect } from "react";
import { useNotification } from "./provider/notificationProvider";
import { useRouter } from "next/navigation";
import { useLoading } from "./provider/loadingProvider";

export const RedirectManager: FC<{
  data: NotificationBaseType[] | undefined;
  paramName: string;
}> = ({ data, paramName }) => {
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

export const MemoizedRedirectManager = memo(RedirectManager);

export const RenderNotification: FC<{ notif: NotificationBaseType[] }> = ({
  notif,
}) => {
  const { handleSetNotification } = useNotification();

  useEffect(() => {
    handleSetNotification(notif);
  }, [notif, handleSetNotification]);

  return null;
};
