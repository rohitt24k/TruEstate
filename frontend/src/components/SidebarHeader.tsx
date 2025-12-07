import React from "react";
import { FiChevronDown } from "react-icons/fi";
import { IoCube } from "react-icons/io5";

interface SidebarHeaderProps {
  title?: string;
  subtitle?: string;
  onClick?: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  title = "Vault",
  subtitle = "Anurag Yadav",
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="border-gray-80 hover:bg-gray-90 mx-4 my-1 flex items-center justify-between rounded border bg-white px-2 py-1 transition-colors"
    >
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black text-white">
          <IoCube size={18} className="text-blue-700" />
        </div>

        <div className="flex flex-col items-start">
          <span className="text-sm leading-[21px] font-bold">{title}</span>
          <span className="text-gray-20 text-[13px] leading-5 font-normal">
            {subtitle}
          </span>
        </div>
      </div>

      <FiChevronDown size={16} className="text-gray-40" />
    </button>
  );
};
