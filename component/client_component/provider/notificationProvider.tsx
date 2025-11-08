"use client";

import {
  NotificationBaseType,
  NotificationContextType,
  NotificationValType,
  renderNotificationPropType,
  renderRedirectNotification,
} from "@/types";
import { CreateUUID } from "@/util/helper_function/reusableFunction";
import {
  CircleCheck,
  LucideIcon,
  OctagonX,
  TriangleAlert,
  X,
} from "lucide-react";
import {
  createContext,
  FC,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSearchParam } from "../customHook";

/**
 * defining the default value of the notification context
 */
const NotificationContext = createContext<NotificationContextType>({
  notificationVal: [{ message: "", type: null, notifId: null }],
  handleSetNotification: () => {},
  handleRemoveNotification: () => {},
});

/**
 * custom hook that uses the notification context
 * @returns useContext of the notification context
 */
export const useNotification = (): NotificationContextType =>
  useContext(NotificationContext);

/**
 * Notification provider component that carries the available value notificationVal, handleSetNotification, and handleRemoveNotification
 * @param param children under the notification provider component
 * @returns provider component with children object inside it and notification design
 */
export function NotificationProvider({
  children,
}: Readonly<{ children: ReactNode }>): ReactElement {
  const [notificationVal, setNotificationVal] = useState<NotificationValType[]>(
    [{ message: "", type: null, notifId: null }]
  );
  const timeRef = useRef<NodeJS.Timeout | null>(null);

  const handleSetNotification = useCallback((data: NotificationBaseType[]) => {
    if (data) {
      const newNotification: NotificationValType[] = data.map((notif) => ({
        ...notif,
        notifId: CreateUUID(),
      }));

      setNotificationVal((prev) => [...prev, ...newNotification]);

      if (timeRef.current !== null) {
        clearTimeout(timeRef.current);
      }

      timeRef.current = setTimeout(() => {
        document.querySelectorAll(".notification").forEach((item) => {
          item.classList.add("animate-toRight");
        });

        setTimeout(() => {
          setNotificationVal([{ message: "", type: null, notifId: null }]);
          timeRef.current = null;
        }, 1000);
      }, 10000);
    }
  }, []);

  const handleRemoveNotification = (notifId: string) => {
    setNotificationVal((prev) =>
      prev.filter((notif) => notif.notifId !== notifId)
    );
  };

  const notificationContextValue: NotificationContextType = {
    notificationVal,
    handleSetNotification,
    handleRemoveNotification,
  };

  return (
    <NotificationContext.Provider value={notificationContextValue}>
      <NotificationMessages />
      {children}
    </NotificationContext.Provider>
  );
}

/**
 * notification message components that renders all the notification inside it
 * @returns notification component with its notification messages
 */
const NotificationMessages: FC = (): ReactElement | null => {
  const { notificationVal } = useNotification();

  return (
    <div className="notification-wrapper">
      {notificationVal.map(
        (notif, index) =>
          notif.type !== null && (
            <Notification
              key={notif.notifId || index}
              message={notif.message}
              type={notif.type}
              notifId={notif.notifId}
            />
          )
      )}
    </div>
  );
};

/**
 * used to render eacg notification
 * @param param.message message of the notification that will be passed
 * @param param.type type of the message like success, warning, or error
 * @param param.notifId id of the notif
 * @returns notification component
 */
const Notification: FC<NotificationValType> = ({
  message,
  type,
  notifId,
}): ReactElement | null => {
  const notifRef = useRef<HTMLDivElement>(null);
  const { handleRemoveNotification } = useNotification();

  const removeNotif = <T extends HTMLDivElement>(refElement: T): void => {
    if (refElement.classList.contains("animate-toLeft"))
      refElement.classList.remove("animate-toLeft");

    refElement.classList.add("animate-toRight");
    setTimeout(() => handleRemoveNotification(notifId as string), 1000);
  };

  return (
    <div ref={notifRef} className={`notification animate-toLeft ${type}`}>
      <Logo type={type} />
      <p>{message}</p>
      <button onClick={() => removeNotif(notifRef.current as HTMLDivElement)}>
        <X className="logo notification-close-logo" />
      </button>
    </div>
  );
};

/**
 * used to render what logo will be shown in the notification
 * @param param.type accepts a type of notification that will be render
 * @returns logo component
 */
const Logo: FC<{ type: "success" | "error" | "warning" | null }> = ({
  type,
}): ReactElement => {
  let logoColor: null | string = null;

  const LucideIcon: LucideIcon | null = (() => {
    switch (type) {
      case "success":
        logoColor = "text-green-600";
        return CircleCheck;

      case "warning":
        logoColor = "text-orange-600";
        return TriangleAlert;

      case "error":
        logoColor = "text-red-600";
        return OctagonX;

      default:
        return null;
    }
  })();

  return (
    <>
      {LucideIcon && (
        <LucideIcon className={`logo notification-logo ${logoColor}`} />
      )}
    </>
  );
};

export const RenderRedirectNotification: FC<renderRedirectNotification> = ({
  notif,
}) => <RenderNotification notif={notif} paramName="notif" />;

export const RenderNotification: FC<renderNotificationPropType> = ({
  notif,
  paramName,
}) => {
  const { handleSetNotification } = useNotification();
  const { deleteParams } = useSearchParam();

  useEffect(() => {
    handleSetNotification(notif);

    if (paramName) deleteParams(paramName);
  }, [notif, paramName, handleSetNotification, deleteParams]);

  return null;
};
