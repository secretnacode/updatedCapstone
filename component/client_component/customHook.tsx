import { searchParamValue } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export const useSearchParam = () => {
  const router = useRouter();
  const params = useSearchParams();

  const getParams = useCallback((name: string) => params.get(name), [params]);

  const setParams = useCallback(
    (name: string, value: searchParamValue) => {
      const current = new URLSearchParams(Array.from(params.entries()));

      current.set(name, String(value));

      const search = current.toString();
      const query = search ? `?${search}` : "";

      router.replace(`${window.location.pathname}${query}`, { scroll: false });
    },
    [params, router]
  );

  const deleteParams = useCallback(
    (name: string) => {
      const current = new URLSearchParams(Array.from(params.entries()));

      current.delete(name);

      const search = current.toString();
      const query = search ? `?${search}` : "";

      router.push(`${window.location.pathname}${query}`, { scroll: false });
    },
    [params, router]
  );

  return { getParams, setParams, deleteParams };
};
