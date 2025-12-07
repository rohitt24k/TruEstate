import { Checkbox } from "./checkbox";

interface MultiSelectProps {
  options: readonly string[];
  selectedOptions: string[];
  onSelectionChange: (selected: string[]) => void;
}

function MultiSelect({
  options,
  selectedOptions,
  onSelectionChange,
}: MultiSelectProps) {
  const handleOptionChange = (option: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedOptions, option]);
    } else {
      onSelectionChange(selectedOptions.filter((o) => o !== option));
    }
  };

  return (
    <div className="flex flex-col">
      {options.map((option) => (
        <label key={option}>
          <div className="hover:bg-gray-90 flex items-center space-x-2 rounded px-2 py-1.5 transition-colors">
            <Checkbox
              checked={selectedOptions.includes(option)}
              onCheckedChange={(checked) =>
                handleOptionChange(option, checked as boolean)
              }
            />

            <p className="text-gray-20 text-sm leading-none font-medium capitalize peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {option}
            </p>
          </div>
        </label>
      ))}
    </div>
  );
}

export default MultiSelect;
