"use client";

import {
  NotificationBaseType,
  NotificationContextType,
  NotificationValType,
} from "@/types";
import { removeNotif } from "@/util/helper_function/providerFunction";
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
  useContext,
  useRef,
  useState,
} from "react";

// creating a notification context with a default value of notification and showNotification function, this 1 value is the value that will be available globally if the context was used
export const NotificationContext = createContext<NotificationContextType>({
  notificationVal: [{ message: "", type: null, notifId: null }],
  handleSetNotification: () => {},
  handleRemoveNotification: () => {},
});

// making custom hook thats using the context hook of the notification context
export const useNotification = (): NotificationContextType =>
  useContext(NotificationContext);

// making a notification provider
export function NotificationProvider({
  children,
}: Readonly<{ children: ReactNode }>): ReactElement {
  const [notificationVal, setNotificationVal] = useState<NotificationValType[]>(
    [{ message: "", type: null, notifId: null }]
  );
  const timeRef = useRef<NodeJS.Timeout | null>(null);

  // handling the setting of message and type of the notification and automatically make it into a default value to remove it
  const handleSetNotification = (data: NotificationBaseType[]) => {
    const newNotification: NotificationValType[] = data.map((notif) => {
      return { ...notif, notifId: CreateUUID() };
    });

    setNotificationVal((prev) => [...prev, ...newNotification]);

    // clearing the time after making another notification, in this way the setTimeout doesnt que the function that will be called
    if (timeRef.current !== null) {
      clearTimeout(timeRef.current);
    }

    // setting a timeout function to remove the notification after 8 seconds
    timeRef.current = setTimeout(() => {
      setNotificationVal([{ message: "", type: null, notifId: null }]);
      timeRef.current = null;
    }, 10000);
  };

  const handleRemoveNotification = (notifId: string) => {
    setNotificationVal((prev) =>
      prev.filter((notif) => notif.notifId !== notifId)
    );
  };

  // instantiating the value in the context hook
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

// notification component where this will handle what notification will be shown
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

const Notification: FC<NotificationValType> = ({
  message,
  type,
  notifId,
}): ReactElement | null => {
  const notifRef = useRef<HTMLDivElement>(null);
  const { handleRemoveNotification } = useNotification();

  return (
    <div ref={notifRef} className={`notification animate-toLeft ${type}`}>
      <Logo type={type} />
      <p>{message}</p>
      <button
        onClick={() =>
          removeNotif(notifRef.current as HTMLDivElement, () =>
            handleRemoveNotification(notifId as string)
          )
        }
      >
        <X className="logo notification-close-logo" />
      </button>
    </div>
  );
};

// a function called Logo that returns a component logo and its color depends in the type of the notification
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
