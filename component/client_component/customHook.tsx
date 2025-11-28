"use client";

import {
  searchParamValue,
  sortColType,
  useFilterSortValueParamType,
  useSortColumnHandlerReturnType,
} from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

/**
 * custom hook about the param /home?name=john
 *
 *
 * @returns
 */
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

/**
 * custom hook for sorting and filtering the table value
 * @param param0
 * @returns sorted, filterized, normal value
 */
export function useFilterSortTable<
  T extends Record<string, string | number | Date | boolean | null>
>({ obj, filterCol, searchVal, sortCol }: useFilterSortValueParamType<T>): T[] {
  const filter = useMemo(() => {
    if (!filterCol) return obj;

    // console.log(filterCol.col);

    return obj.filter((objVal) => objVal[filterCol.col] === filterCol.val);
  }, [filterCol, obj]);

  const search = useMemo(() => {
    if (!searchVal) return filter;

    return filter.filter((objVal) =>
      Object.keys(objVal).some((colVal) =>
        String(objVal[colVal]).toLowerCase().includes(searchVal.toLowerCase())
      )
    );
  }, [searchVal, filter]);

  const sort = useMemo(() => {
    if (!sortCol) return search;

    return [...search].sort((a, b) => {
      const aV = String(a[sortCol.column]).toLowerCase();
      const bV = String(b[sortCol.column]).toLowerCase();

      if (aV < bV) return sortCol.sortType === "asc" ? -1 : 1;

      if (aV > bV) return sortCol.sortType === "asc" ? 1 : -1;

      return 0;
    });
  }, [sortCol, search]);

  return sort;
}

/**
 * custom hook for setting how the table will be sorted(asc or desc, what column of the table)
 * @param param0
 * @returns
 */
export function useSortColumnHandler<T>(): useSortColumnHandlerReturnType<T> {
  const [sortCol, setSortCol] = useState<sortColType<T>>(null);

  const handleSortCol = useCallback(
    (col: keyof T) => {
      console.log(col);
      if (sortCol?.sortType === "asc" && sortCol.column === col)
        return setSortCol({ column: col, sortType: "desc" });

      if (sortCol?.sortType === "desc" && sortCol.column === col)
        return setSortCol(null);

      return setSortCol({ column: col, sortType: "asc" });
    },
    [sortCol]
  );

  return { sortCol, handleSortCol, setSortCol };
}
