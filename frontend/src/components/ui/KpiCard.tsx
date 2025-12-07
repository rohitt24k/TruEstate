import { FiAlertCircle } from "react-icons/fi";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { cn } from "@/lib/utils";

const KpiCard = ({
  title,
  value,
  description,
  isLoading = false,
}: {
  title: string;
  value: string;
  description: string;
  isLoading?: boolean;
}) => {
  return (
    <div
      className={cn(
        "flex w-fit flex-col gap-1 rounded-md border border-[#CFDBE8] px-4 py-2",
        isLoading && "animate-pulse",
      )}
    >
      <div className="flex items-center gap-2">
        <p className="text-gray-20 text-sm">{title}</p>

        <Tooltip>
          <TooltipTrigger asChild>
            <FiAlertCircle className="text-gray-20" size={16} />
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-gray-20 text-sm">{description}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <p className="text-gray-20 text-sm font-bold">{value}</p>
    </div>
  );
};

export default KpiCard;
