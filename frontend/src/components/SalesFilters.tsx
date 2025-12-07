import MultiSelect from "@/components/ui/MultiSelect";
import {
  CATEGORIES,
  GENDERS,
  PAYMENT_METHODS,
  REGIONS,
  TAGS,
} from "@/utils/constants";
import Dropdown from "@/components/ui/Dropdown";
import RangeFilter from "@/components/ui/RangeFilter";
import { RiResetLeftLine } from "react-icons/ri";
import type {
  T_Category,
  T_Gender,
  T_GetSalesDataFilters,
  T_PaymentMethod,
  T_Region,
  T_Tags,
} from "@/types/sales";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { FiFilter } from "react-icons/fi";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type FiltersProps = {
  filters: T_GetSalesDataFilters;
  setFilters: React.Dispatch<React.SetStateAction<T_GetSalesDataFilters>>;
  resetPagination: () => void;
};

function FilterInputs({
  filters,
  setFilters,
  resetPagination,
  className,
}: FiltersProps & { className?: string }) {
  const selectedRegions = filters.region || [];
  const selectedGenders = filters.gender || [];
  const selectedCategories = filters.category || [];
  const selectedTags = filters.tag || [];
  const selectedPaymentMethods = filters.paymentMethod || [];

  const handleChangeFilters = (filters: Partial<T_GetSalesDataFilters>) => {
    resetPagination();
    setFilters((prev) => ({ ...prev, ...filters }));
  };

  return (
    <div className={className}>
      <button
        onClick={() =>
          handleChangeFilters({
            region: [],
            gender: [],
            category: [],
            tag: [],
            page: 1,
            paymentMethod: [],
            minAge: undefined,
            maxAge: undefined,
          })
        }
        className="bg-gray-90 hover:bg-gray-80 h-7 w-fit cursor-pointer rounded px-2 py-1.5 transition-colors"
        title="Reset Filters"
      >
        <RiResetLeftLine size={16} className="text-gray-20" />
      </button>
      <Dropdown
        title={`Customer Region ${selectedRegions.length > 0 ? `(${selectedRegions.length})` : ""}`}
      >
        <MultiSelect
          options={REGIONS}
          selectedOptions={selectedRegions}
          onSelectionChange={(val) =>
            handleChangeFilters({ region: val as T_Region[] })
          }
        />
      </Dropdown>
      <Dropdown
        title={`Gender ${selectedGenders.length > 0 ? `(${selectedGenders.length})` : ""}`}
      >
        <MultiSelect
          options={GENDERS}
          selectedOptions={selectedGenders}
          onSelectionChange={(val) =>
            handleChangeFilters({ gender: val as T_Gender[] })
          }
        />
      </Dropdown>
      <Dropdown title="Age Range">
        <RangeFilter
          minLimit={18}
          maxLimit={100}
          initialStartValue={filters.minAge ?? 18}
          initialEndValue={filters.maxAge ?? 100}
          onRangeChange={(start, end) =>
            handleChangeFilters({ minAge: start, maxAge: end })
          }
        />
      </Dropdown>
      <Dropdown
        title={`Product Categories ${selectedCategories.length > 0 ? `(${selectedCategories.length})` : ""}`}
      >
        <MultiSelect
          options={CATEGORIES}
          selectedOptions={selectedCategories}
          onSelectionChange={(val) =>
            handleChangeFilters({ category: val as T_Category[] })
          }
        />
      </Dropdown>
      <Dropdown
        title={`Tags ${selectedTags.length > 0 ? `(${selectedTags.length})` : ""}`}
      >
        <MultiSelect
          options={TAGS}
          selectedOptions={selectedTags}
          onSelectionChange={(val) =>
            handleChangeFilters({ tag: val as T_Tags[] })
          }
        />
      </Dropdown>
      <Dropdown
        title={`Payment Method ${selectedPaymentMethods.length > 0 ? `(${selectedPaymentMethods.length})` : ""}`}
      >
        <MultiSelect
          options={PAYMENT_METHODS}
          selectedOptions={selectedPaymentMethods}
          onSelectionChange={(val) =>
            handleChangeFilters({ paymentMethod: val as T_PaymentMethod[] })
          }
        />
      </Dropdown>
    </div>
  );
}

function SalesFilters({ filters, setFilters, resetPagination }: FiltersProps) {
  const getSortValue = () => {
    const { sortBy, sortOrder } = filters;
    if (!sortBy) return "Customer Name (A-Z)";
    const sort = sortBy;
    if (sort === "name")
      return sortOrder === "desc"
        ? "Customer Name (Z-A)"
        : "Customer Name (A-Z)";
    if (sort === "date")
      return sortOrder === "asc"
        ? "Order Date (Oldest First)"
        : "Order Date (Newest First)";
    if (sort === "amount")
      return sortOrder === "asc"
        ? "Total Amount (Low to High)"
        : "Total Amount (High to Low)";
    if (sort === "quantity")
      return sortOrder === "asc"
        ? "Quantity (Low to High)"
        : "Quantity (High to Low)";
    return "Customer Name (A-Z)";
  };

  const currentSort = getSortValue();

  const handleSortChange = (value: string) => {
    let change: Partial<T_GetSalesDataFilters> = {};
    switch (value) {
      case "Customer Name (A-Z)":
        change = { sortBy: "name", sortOrder: "asc" };
        break;
      case "Customer Name (Z-A)":
        change = { sortBy: "name", sortOrder: "desc" };
        break;
      case "Order Date (Newest First)":
        change = { sortBy: "date", sortOrder: "desc" };
        break;
      case "Order Date (Oldest First)":
        change = { sortBy: "date", sortOrder: "asc" };
        break;
      case "Total Amount (High to Low)":
        change = { sortBy: "amount", sortOrder: "desc" };
        break;
      case "Total Amount (Low to High)":
        change = { sortBy: "amount", sortOrder: "asc" };
        break;
      case "Quantity (High to Low)":
        change = { sortBy: "quantity", sortOrder: "desc" };
        break;
      case "Quantity (Low to High)":
        change = { sortBy: "quantity", sortOrder: "asc" };
        break;
      default:
        break;
    }
    setFilters((prev) => ({ ...prev, ...change }));
  };

  return (
    <div className="flex flex-col gap-4 px-4">
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          {/* Mobile Filter Sheet */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="h-7 gap-2 rounded shadow-none"
                >
                  <FiFilter className="h-3.5 w-3.5" />
                  <span className="text-xs">Filters</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>

                <div className="px-4">
                  <FilterInputs
                    filters={filters}
                    setFilters={setFilters}
                    className="flex flex-col gap-4"
                    resetPagination={resetPagination}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Filter Inputs */}
          <FilterInputs
            filters={filters}
            setFilters={setFilters}
            className="flex flex-1 flex-wrap items-center gap-2.5 max-md:hidden"
            resetPagination={resetPagination}
          />
        </div>

        {/* sorting */}
        <div>
          <Select onValueChange={handleSortChange} defaultValue={currentSort}>
            <SelectTrigger className="bg-gray-90 h-7! rounded! border-none shadow-none">
              <SelectValue
                placeholder={<p className="text-gray-20 text-base">Sort By</p>}
                className="text-gray-20 text-base font-medium!"
              />
            </SelectTrigger>
            <SelectContent>
              {[
                "Customer Name (A-Z)",
                "Customer Name (Z-A)",
                "Order Date (Newest First)",
                "Order Date (Oldest First)",
                "Total Amount (High to Low)",
                "Total Amount (Low to High)",
                "Quantity (High to Low)",
                "Quantity (Low to High)",
              ].map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

export default SalesFilters;
