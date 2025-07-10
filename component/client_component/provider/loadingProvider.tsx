"use client";

import { LoadingContextType } from "@/types";
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

/**
 * cretion of loading context where also defining the default value of the loading context
 */
const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  loadingMessage: "",
  handleIsLoading: () => {},
  handleDoneLoading: () => {},
});

/**
 * custom hook that uses the loading context
 * @returns useContext of loadingContext
 */
export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider: FC<Readonly<{ children: ReactNode }>> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");

  console.log(`loading context`);

  const handleIsLoading = useCallback((message: string) => {
    setLoadingMessage(message);
    setIsLoading(true);
  }, []);

  const handleDoneLoading = useCallback(() => {
    setLoadingMessage("");
    setIsLoading(false);
  }, []);

  return (
    <LoadingContext.Provider
      value={{ isLoading, loadingMessage, handleIsLoading, handleDoneLoading }}
    >
      <LoadingComponent />
      {children}
    </LoadingContext.Provider>
  );
};

const LoadingComponent: FC = () => {
  const { isLoading, loadingMessage } = useLoading();
  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-700">{loadingMessage}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/**
 * used to hide/stop the loading animation in the screen
 * `preferably` use in every page that will be called in the user redirection
 * @returns
 */
export const LoadingManager: FC = () => {
  const { isLoading, handleDoneLoading } = useLoading();
  useEffect(() => {
    if (isLoading) handleDoneLoading();
  }, [handleDoneLoading, isLoading]);

  return null;
};
