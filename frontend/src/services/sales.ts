import { useQuery } from "@tanstack/react-query";
import { api } from "./api";
import type { T_GetSalesDataFilters, T_Sales } from "../types/sales";
import type { T_PAGINATED_API_RESPONSE } from "@/types";

function useGetSalesData(filters: T_GetSalesDataFilters) {
  return useQuery({
    queryKey: ["sales", filters],
    queryFn: () =>
      api.get("/sales", { params: filters }).then(
        (res) =>
          res.data as T_PAGINATED_API_RESPONSE<{
            paginatedData: T_Sales[];
            kpiData: {
              totalUnitsSold: number;
              totalAmount: number;
              totalDiscount: number;
            };
          }>,
      ),
  });
}

export const salesService = { useGetSalesData };
