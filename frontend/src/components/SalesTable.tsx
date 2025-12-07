import type { T_Sales } from "@/types/sales";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Skeleton } from "./ui/skeleton";

function SalesTable({
  salesData,
  isLoading,
  pageSize,
}: {
  salesData: T_Sales[];
  isLoading: boolean;
  pageSize: number;
}) {
  return (
    <div className="relative flex flex-1 flex-col overflow-auto">
      <ScrollArea className="flex-1 overflow-auto px-4">
        <table>
          <thead className="sticky top-0">
            <tr>
              <th className="bg-gray-90 text-gray-30 px-3 py-2.5 pr-10 text-sm font-normal text-nowrap">
                Transaction ID
              </th>
              <th className="bg-gray-90 text-gray-30 px-3 py-2.5 pr-10 text-sm font-normal text-nowrap">
                Date
              </th>
              <th className="bg-gray-90 text-gray-30 px-3 py-2.5 pr-10 text-sm font-normal text-nowrap">
                Customer ID
              </th>
              <th className="bg-gray-90 text-gray-30 px-3 py-2.5 pr-10 text-sm font-normal text-nowrap">
                Customer Name
              </th>
              <th className="bg-gray-90 text-gray-30 px-3 py-2.5 pr-10 text-sm font-normal text-nowrap">
                Phone Number
              </th>
              <th className="bg-gray-90 text-gray-30 px-3 py-2.5 pr-10 text-sm font-normal text-nowrap">
                Gender
              </th>
              <th className="bg-gray-90 text-gray-30 px-3 py-2.5 pr-10 text-sm font-normal text-nowrap">
                Age
              </th>
              <th className="bg-gray-90 text-gray-30 px-3 py-2.5 pr-10 text-sm font-normal text-nowrap">
                Product Category
              </th>
              <th className="bg-gray-90 text-gray-30 px-3 py-2.5 pr-10 text-sm font-normal text-nowrap">
                Quantity
              </th>
              <th className="bg-gray-90 text-gray-30 px-3 py-2.5 pr-10 text-sm font-normal text-nowrap">
                Total Amount
              </th>
              <th className="bg-gray-90 text-gray-30 px-3 py-2.5 pr-10 text-sm font-normal text-nowrap">
                Customer Region
              </th>
              <th className="bg-gray-90 text-gray-30 px-3 py-2.5 pr-10 text-sm font-normal text-nowrap">
                Product ID
              </th>
              <th className="bg-gray-90 text-gray-30 px-3 py-2.5 pr-10 text-sm font-normal text-nowrap">
                Product Name
              </th>
              <th className="bg-gray-90 text-gray-30 px-3 py-2.5 pr-10 text-sm font-normal text-nowrap">
                Tags
              </th>
              <th className="bg-gray-90 text-gray-30 px-3 py-2.5 pr-10 text-sm font-normal text-nowrap">
                Payment Method
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: pageSize }).map((_, idx) => (
                  <tr key={idx}>
                    <td colSpan={15}>
                      <Skeleton
                        className={`bg-gray-90/10 h-12 w-full ${idx % 2 != 0 ? "bg-gray-90/50" : ""}`}
                      />
                    </td>
                  </tr>
                ))
              : salesData.map((sale, idx) => (
                  <tr key={sale.transactionId}>
                    <td
                      className={`text-gray-30 px-3 py-3.5 ${idx % 2 != 0 ? "bg-gray-90/50" : ""} text-sm`}
                    >
                      {sale.transactionId}
                    </td>
                    <td
                      className={`text-gray-30 px-3 py-3.5 ${idx % 2 != 0 ? "bg-gray-90/50" : ""} text-sm`}
                    >
                      {new Date(sale.date).toLocaleDateString()}
                    </td>
                    <td
                      className={`text-gray-30 px-3 py-3.5 ${idx % 2 != 0 ? "bg-gray-90/50" : ""} text-sm`}
                    >
                      {sale.customerId}
                    </td>
                    <td
                      className={`text-gray-30 px-3 py-3.5 ${idx % 2 != 0 ? "bg-gray-90/50" : ""} text-sm`}
                    >
                      {sale.customerName}
                    </td>
                    <td
                      className={`text-gray-30 px-3 py-3.5 ${idx % 2 != 0 ? "bg-gray-90/50" : ""} text-sm`}
                    >
                      {sale.customerPhone}
                    </td>
                    <td
                      className={`text-gray-30 px-3 py-3.5 ${idx % 2 != 0 ? "bg-gray-90/50" : ""} text-sm`}
                    >
                      {sale.gender}
                    </td>
                    <td
                      className={`text-gray-30 px-3 py-3.5 ${idx % 2 != 0 ? "bg-gray-90/50" : ""} text-sm`}
                    >
                      {sale.age}
                    </td>
                    <td
                      className={`text-gray-30 px-3 py-3.5 ${idx % 2 != 0 ? "bg-gray-90/50" : ""} text-sm`}
                    >
                      {sale.category}
                    </td>
                    <td
                      className={`text-gray-30 px-3 py-3.5 ${idx % 2 != 0 ? "bg-gray-90/50" : ""} text-sm`}
                    >
                      {sale.quantity}
                    </td>
                    <td
                      className={`text-gray-30 px-3 py-3.5 ${idx % 2 != 0 ? "bg-gray-90/50" : ""} text-sm`}
                    >
                      {sale.totalAmount}
                    </td>
                    <td
                      className={`text-gray-30 px-3 py-3.5 ${idx % 2 != 0 ? "bg-gray-90/50" : ""} text-sm`}
                    >
                      {sale.region}
                    </td>
                    <td
                      className={`text-gray-30 px-3 py-3.5 ${idx % 2 != 0 ? "bg-gray-90/50" : ""} text-sm`}
                    >
                      {sale.productId}
                    </td>
                    <td
                      className={`text-gray-30 px-3 py-3.5 ${idx % 2 != 0 ? "bg-gray-90/50" : ""} text-sm`}
                    >
                      {sale.productName}
                    </td>
                    <td
                      className={`text-gray-30 px-3 py-3.5 ${idx % 2 != 0 ? "bg-gray-90/50" : ""} text-sm`}
                    >
                      {sale.tags}
                    </td>
                    <td
                      className={`text-gray-30 px-3 py-3.5 ${idx % 2 != 0 ? "bg-gray-90/50" : ""} text-sm`}
                    >
                      {sale.paymentMethod}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {salesData.length === 0 && !isLoading && (
        <div className="absolute top-20 left-1/2 flex flex-2 -translate-x-1/2 items-center justify-center">
          <p className="text-gray-30 text-sm font-medium">No Data Found</p>
        </div>
      )}
    </div>
  );
}

export default SalesTable;
