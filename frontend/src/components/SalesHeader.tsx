import useDebounce from "@/hooks/useDebounce";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { FiMenu, FiSearch } from "react-icons/fi";

function SalesHeader({
  onSearchChange,
  search,
  setShowSidebar,
}: {
  search: string;
  onSearchChange: (s: string) => void;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [searchValue, setSearchValue] = useState(search);

  useEffect(() => {
    setSearchValue(search);
  }, [search]);

  const debouncedSearch = useDebounce(searchValue, 500);

  useEffect(() => {
    if (debouncedSearch !== search) {
      onSearchChange(debouncedSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);
  return (
    <div className="flex justify-between gap-2 px-[18px] py-1.5 pt-4 max-md:flex-col md:items-center">
      <div className="flex items-center gap-2">
        <Button
          onClick={() => setShowSidebar((prev) => !prev)}
          variant={"outline"}
          size={"icon"}
          className="size-7 rounded shadow-none md:hidden"
        >
          <FiMenu size={20} />
        </Button>
        <h3 className="font-medium">Sales Management System</h3>
      </div>
      <div className="border-gray-80 bg-gray-90 flex w-full items-center gap-1.5 rounded border px-3 py-1.5 md:max-w-[400px]">
        <FiSearch size={16} className="text-gray-20" />
        <input
          className="w-full border-none bg-transparent outline-none"
          placeholder="Name, Phone no."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
    </div>
  );
}

export default SalesHeader;
