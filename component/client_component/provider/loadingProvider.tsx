"use client";

import { LoadingContextType } from "@/types";
import { createContext, FC, ReactNode, useContext, useState } from "react";

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

  const handleIsLoading = (message: string) => {
    setLoadingMessage(message);
    setIsLoading(true);
  };

  const handleDoneLoading = () => {
    setLoadingMessage("");
    setIsLoading(false);
  };

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
