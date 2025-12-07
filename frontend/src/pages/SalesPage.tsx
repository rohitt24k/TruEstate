import Sidebar from "@/components/Sidebar";
import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ApiService } from "@/services";
import SalesTable from "@/components/SalesTable";
import type { T_GetSalesDataFilters } from "@/types/sales";
import SalesFilters from "@/components/SalesFilters";
import {
  CATEGORIES,
  GENDERS,
  PAYMENT_METHODS,
  REGIONS,
  SORT_BY,
  TAGS,
} from "@/utils/constants";
import { z } from "zod";
import SalesCards from "@/components/SalesCards";
import PaginationData from "@/components/PaginationData";
import SalesHeader from "@/components/SalesHeader";

const DEFAULT_LIMIT = 50;

function SalesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showSidebar, setShowSidebar] = useState(false);

  // Derive filters from search params
  const filters: T_GetSalesDataFilters = useMemo(() => {
    const salesFiltersSchema = z.object({
      page: z.coerce.number().int().positive().default(1),
      limit: z.coerce.number().int().positive().default(DEFAULT_LIMIT),
      search: z.string().default(""),
      sortBy: z.enum(SORT_BY).default("name"),
      sortOrder: z.enum(["asc", "desc"]).default("asc"),
      region: z.array(z.enum(REGIONS)).default([]),
      gender: z.array(z.enum(GENDERS)).default([]),
      category: z.array(z.enum(CATEGORIES)).default([]),
      tag: z.array(z.enum(TAGS)).default([]),
      paymentMethod: z.array(z.enum(PAYMENT_METHODS)).default([]),
      minAge: z.coerce.number().int().min(0).max(100).optional(),
      maxAge: z.coerce.number().int().min(0).max(100).optional(),
    });

    const parsedSearchParams: Record<string, string | string[]> = {};
    for (const [key, value] of searchParams.entries()) {
      if (
        ["region", "gender", "category", "tag", "paymentMethod"].includes(key)
      ) {
        parsedSearchParams[key] = searchParams.getAll(key);
      } else {
        parsedSearchParams[key] = value;
      }
    }

    let result = salesFiltersSchema.safeParse(parsedSearchParams);

    if (!result.success) {
      const cleanData = structuredClone(parsedSearchParams);

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        const index = issue.path[1];

        if (Array.isArray(cleanData[field]) && typeof index === "number") {
          cleanData[field].splice(index, 1);
        } else {
          delete cleanData[field];
        }
      });

      result = salesFiltersSchema.safeParse(cleanData);
      if (!result.success) return salesFiltersSchema.parse({});
    }

    if (result.data?.minAge && result.data?.maxAge) {
      result.data.maxAge = Math.max(result.data.minAge, result.data.maxAge);
    }

    return result.data;
  }, [searchParams]);

  const { data: getSalesData, isLoading } =
    ApiService.sales.useGetSalesData(filters);

  const salesData = useMemo(
    () => getSalesData?.data?.paginatedData ?? [],
    [getSalesData],
  );

  const kpiData = useMemo(() => getSalesData?.data?.kpiData, [getSalesData]);
  const paginationData = useMemo(
    () => getSalesData?.pagination,
    [getSalesData],
  );

  const setFilters = useCallback(
    (
      update:
        | T_GetSalesDataFilters
        | ((prev: T_GetSalesDataFilters) => T_GetSalesDataFilters),
      resetPagination: boolean = false,
    ) => {
      setSearchParams((prevParams) => {
        const currentFilters: T_GetSalesDataFilters = {
          page: resetPagination ? 1 : Number(prevParams.get("page")) || 1,
          limit: Number(prevParams.get("limit")) || DEFAULT_LIMIT,
          search: prevParams.get("search") || "",
          sortBy: prevParams.get("sortBy") as T_GetSalesDataFilters["sortBy"],
          sortOrder: prevParams.get(
            "sortOrder",
          ) as T_GetSalesDataFilters["sortOrder"],
          region: prevParams.getAll(
            "region",
          ) as T_GetSalesDataFilters["region"],
          gender: prevParams.getAll(
            "gender",
          ) as T_GetSalesDataFilters["gender"],
          category: prevParams.getAll(
            "category",
          ) as T_GetSalesDataFilters["category"],
          tag: prevParams.getAll("tag") as T_GetSalesDataFilters["tag"],
          paymentMethod: prevParams.getAll(
            "paymentMethod",
          ) as T_GetSalesDataFilters["paymentMethod"],
          minAge: prevParams.get("minAge")
            ? Number(prevParams.get("minAge"))
            : undefined,
          maxAge: prevParams.get("maxAge")
            ? Number(prevParams.get("maxAge"))
            : undefined,
        };

        const newFilters =
          typeof update === "function" ? update(currentFilters) : update;

        const newParams = new URLSearchParams();

        // Helper to append params
        Object.entries(newFilters).forEach(([key, value]) => {
          if (value === undefined || value === null || value === "") return;
          if (Array.isArray(value)) {
            value.forEach((v) => newParams.append(key, String(v)));
          } else {
            newParams.set(key, String(value));
          }
        });

        return newParams;
      });
    },
    [setSearchParams],
  );

  const onPageChange = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  const onLimitChange = (limit: number) => {
    setFilters((prev) => ({
      ...prev,
      limit,
    }));
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        showSidebar={showSidebar}
        onCloseSidebar={() => setShowSidebar(false)}
      />
      <div className="flex flex-1 flex-col gap-4 overflow-auto">
        <SalesHeader
          search={filters.search ?? ""}
          onSearchChange={(search: string) => {
            setFilters((prev) => ({ ...prev, search }), true);
          }}
          setShowSidebar={setShowSidebar}
        />
        <SalesFilters filters={filters} setFilters={setFilters} />
        <SalesCards {...kpiData} isLoading={isLoading} />
        <SalesTable
          salesData={salesData}
          isLoading={isLoading}
          pageSize={filters.limit ?? DEFAULT_LIMIT}
        />
        <PaginationData
          paginationData={paginationData}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default SalesPage;
