import { createContext, useCallback, useContext, type ReactNode } from "react";
import { useAuth } from "../authContext/authContext";

type RetryType = {
  autoRetry: (
    params: any,
    callback: (args: any) => Promise<any>,
  ) => Promise<any>;
};

const RetryContext = createContext<RetryType | null>(null);

export function AutoRetryProvider({ children }: { children: ReactNode }) {
  const { accessToken, setAccessToken, refresh } = useAuth();

  const autoRetry = useCallback(
    async (params: any, callback: (args: any) => Promise<any>) => {
      const arg = { ...params, accessToken };

      const res = await callback(arg);

      if (res.success === false && res.error === "TokenExpiredError") {
        const refreshedToken = await refresh();

        if (refreshedToken.success === true) {
          setAccessToken(refreshedToken.accessToken);
          return await callback({
            ...arg,
            accessToken: refreshedToken.accessToken,
          });
        }

        return refreshedToken;
      }

      return res;
    },
    [accessToken, refresh, setAccessToken],
  );

  const value: RetryType = { autoRetry };

  return (
    <RetryContext.Provider value={value}>{children}</RetryContext.Provider>
  );
}

export const useRetry = () => {
  const context = useContext(RetryContext);
  if (!context) {
    throw new Error("useRetry must be used within AutoRetryProvider");
  }
  return context;
};
