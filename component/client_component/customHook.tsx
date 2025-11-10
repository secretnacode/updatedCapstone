"use client";

import { searchParamValue, useFilterSortValueParamType } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

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
      // name value that was pass is undefined
      if (!name) return;

      // name doesnt exist in the param
      if (!params.has(name)) return;

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

export function useFilterSortValue<T extends Record<string, string>>({
  obj,
  searchVal,
  sortCol,
}: useFilterSortValueParamType<T>) {
  const search = useMemo(() => {
    if (!searchVal) return obj;

    return obj.filter((objVal) =>
      Object.keys(objVal).some((colVal) =>
        String(objVal[colVal]).toLowerCase().includes(searchVal.toLowerCase())
      )
    );
  }, [searchVal, obj]);

  const sort = useMemo(() => {
    if (!sortCol) return search;

    return [...search].sort((a, b) => {
      const aV = a[sortCol.column];
      const bV = b[sortCol.column];

      if (aV < bV) return sortCol.sortType === "asc" ? -1 : 1;

      if (aV > bV) return sortCol.sortType === "asc" ? 1 : -1;

      return 0;
    });
  }, [sortCol, search]);

  return sort;
}
