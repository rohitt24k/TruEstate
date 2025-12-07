import { useEffect, useState } from "react";
import KpiCard from "./ui/KpiCard";

const SalesCards = ({
  totalAmount,
  totalDiscount,
  totalUnitsSold,
  isLoading,
}: {
  totalUnitsSold?: number;
  totalAmount?: number;
  totalDiscount?: number;
  isLoading?: boolean;
}) => {
  const [kpiData, setKpiData] = useState({
    totalUnitsSold,
    totalAmount,
    totalDiscount,
  });
  useEffect(() => {
    if (totalUnitsSold) {
      setKpiData((prev) => ({ ...prev, totalUnitsSold }));
    }
    if (totalAmount) {
      setKpiData((prev) => ({ ...prev, totalAmount }));
    }
    if (totalDiscount) {
      setKpiData((prev) => ({ ...prev, totalDiscount }));
    }
  }, [totalUnitsSold, totalAmount, totalDiscount]);
  return (
    <div className="flex flex-wrap gap-4 px-4">
      <KpiCard
        title="Total units sold"
        value={kpiData.totalUnitsSold?.toString() ?? "0"}
        description="Total units sold"
        isLoading={isLoading}
      />
      <KpiCard
        title="Total amount"
        value={kpiData.totalAmount?.toString() ?? "0"}
        description="Total amount"
        isLoading={isLoading}
      />
      <KpiCard
        title="Total discount"
        value={kpiData.totalDiscount?.toString() ?? "0"}
        description="Total discount"
        isLoading={isLoading}
      />
    </div>
  );
};

export default SalesCards;
