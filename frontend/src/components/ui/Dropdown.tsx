import { FiChevronDown } from "react-icons/fi";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface DropdownProps {
  title: string;
  children: React.ReactNode;
}

function Dropdown({ title, children }: DropdownProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="bg-gray-90 hover:bg-gray-80 flex h-7 cursor-pointer items-center justify-between gap-2 rounded px-2 py-1.5 transition-colors">
          <p>{title}</p>
          <FiChevronDown size={16} className="text-gray-20" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="mt-2 w-[200px] p-1" side="top" align="start">
        {children}
      </PopoverContent>
    </Popover>
  );
}

export default Dropdown;
