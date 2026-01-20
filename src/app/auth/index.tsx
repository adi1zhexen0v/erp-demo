import { useEffect, useState } from "react";
import { useGetMeQuery } from "@/features/auth/api";
import { logout, setAuth } from "@/features/auth/slice";
import { Loader } from "@/shared/components";
import { useAppDispatch } from "@/shared/hooks";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  const { data, isError, isLoading, isSuccess } = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [isAuthResolved, setAuthResolved] = useState(false);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);

  useEffect(() => {
    if (!isLoading && !hasInitialLoad) {
      setHasInitialLoad(true);
      if (import.meta.env.DEV && isError) {
        console.warn("getMe failed on initial load. Possible Safari ITP / third-party cookie issue.");
      }
    }
  }, [isLoading, hasInitialLoad, isError]);

  useEffect(() => {
    if (!isLoading && hasInitialLoad) {
      if (isSuccess && data) {
        dispatch(setAuth(data));
        setAuthResolved(true);
      } else if (isError) {
        dispatch(logout());
        setAuthResolved(true);
      }
    }
  }, [isLoading, hasInitialLoad, isSuccess, isError, data, dispatch]);

  if (!isAuthResolved || isLoading) {
    return <Loader isFullPage />;
  }

  return children;
}

