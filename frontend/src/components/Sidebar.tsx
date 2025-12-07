import type { IconType } from "react-icons/lib";
import { SidebarHeader } from "./SidebarHeader";
import {
  BiBarChartSquare,
  BiBookBookmark,
  BiCheckCircle,
  BiLayer,
  BiPlayCircle,
  BiUser,
  BiXCircle,
} from "react-icons/bi";
import { useState } from "react";
import { FiChevronUp, FiFile, FiFileText } from "react-icons/fi";

const Sidebar = ({
  showSidebar,
  onCloseSidebar,
}: {
  showSidebar: boolean;
  onCloseSidebar: () => void;
}) => {
  return (
    <>
      <div
        className={`fixed inset-0 z-2 md:pointer-events-none md:hidden ${showSidebar ? "bg-black/10" : "pointer-events-none bg-none"} transition-all`}
        onClick={onCloseSidebar}
      />

      <div
        className={`${showSidebar ? "max-md:max-w-[1000px]" : "max-md:max-w-0"} h-full overflow-hidden transition-all ease-in-out max-md:fixed max-md:top-0 max-md:left-0 max-md:z-10 max-md:h-screen`}
      >
        <div className="bg-gray-90 flex h-full w-[220px] flex-col max-md:w-[280px] max-md:max-w-[80vw]">
          <SidebarHeader />
          <div className="mx-4 my-2 flex flex-col gap-1.5">
            <SidebarOption label="Dashboard" icon={BiBarChartSquare} />
            <SidebarOption label="Nexus" icon={BiUser} />
            <SidebarOption label="Intake" icon={BiPlayCircle} />
            <SidebarSection
              title="Services"
              icon={BiBookBookmark}
              isExpanded={true}
            >
              <SidebarOption label="Pre-active" icon={BiPlayCircle} />
              <SidebarOption label="Active" icon={BiLayer} />
              <SidebarOption label="Blocked" icon={BiXCircle} />
              <SidebarOption label="Closed" icon={BiCheckCircle} />
            </SidebarSection>
            <SidebarSection
              title="Invoices"
              icon={FiFileText}
              isExpanded={true}
            >
              <SidebarOption label="Proforma Invoices" icon={FiFile} isActive />
              <SidebarOption label="Final Invoices" icon={FiFile} />
            </SidebarSection>
          </div>
        </div>
      </div>
    </>
  );
};

const SidebarOption: React.FC<{
  label: string;
  icon: IconType;
  isActive?: boolean;
}> = ({
  label = "Dashboard",
  icon: Icon = BiBarChartSquare,
  isActive = false,
}) => {
  return (
    <button
      className={`flex h-6 w-full cursor-pointer items-center gap-2 rounded px-2 py-1 transition-colors ${isActive ? "" : "hover:bg-gray-80 bg-transparent"} `}
    >
      <Icon size={16} className="text-gray-40 shrink-0" />

      <span
        className={`text-gray-30 truncate text-left font-sans text-[13px] leading-5 font-normal ${isActive ? "font-semibold" : "hover:bg-gray-80 bg-transparent"}`}
      >
        {label}
      </span>
    </button>
  );
};

const SidebarSection: React.FC<{
  title?: string;
  icon: IconType;
  isExpanded?: boolean;
  children?: React.ReactNode;
}> = ({ title = "Services", icon: Icon, isExpanded = true, children }) => {
  const [isOpen, setIsOpen] = useState(isExpanded);

  return (
    <div className="flex flex-col gap-2 rounded bg-white p-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-6 w-full cursor-pointer items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Icon size={16} className="text-gray-40" />

          <span className="text-gray-30 font-sans text-[13px] leading-5 font-normal">
            {title}
          </span>
        </div>

        <FiChevronUp
          size={16}
          className={`text-gray-40 ${isOpen ? "rotate-180" : ""} transition-transform`}
        />
      </button>

      {isOpen && <div className="flex flex-col gap-[6px] pl-3">{children}</div>}
    </div>
  );
};

export default Sidebar;
