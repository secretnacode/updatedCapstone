"use client";

import { NotificationBaseType, RemoveSearchParamsValPropType } from "@/types";
import { FC, useEffect } from "react";
import { useNotification } from "./provider/notificationProvider";
import { useRouter } from "next/navigation";

export const RedirectManager: FC<{
  data: NotificationBaseType[];
}> = ({ data }) => {
  return (
    <>
      <RenderNotification notif={data} />
      <RemoveSearchParamsVal name={"notif"} />
    </>
  );
};

export const RenderNotification: FC<{ notif: NotificationBaseType[] }> = ({
  notif,
}) => {
  const { handleSetNotification } = useNotification();

  useEffect(() => {
    handleSetNotification(notif);
  }, [notif, handleSetNotification]);

  return null;
};

export const RemoveSearchParamsVal: FC<RemoveSearchParamsValPropType> = ({
  name,
}) => {
  const route = useRouter();

  useEffect(() => {
    const currentUrl = new URL(window.location.href);

    currentUrl.searchParams.delete(name);

    route.replace(currentUrl.pathname + currentUrl.search, { scroll: false });
  }, [route, name]);

  return null;
};
