import { ChevronDown } from "lucide-react";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./dropdown-menu";

interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function MultiSelect({ options, selected, onChange }: MultiSelectProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm capitalize ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
        >
          {selected.length
            ? selected.length === options.length
              ? "All"
              : selected.length > 2
                ? `${selected.length} selected`
                : selected.join(", ")
            : "Select"}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit">
        <DropdownMenuCheckboxItem
          checked={selected.length === options.length}
          onCheckedChange={(checked) => {
            if (checked) {
              onChange(options);
            } else {
              options[0] ? onChange([options[0]]) : onChange([]);
            }
          }}
        >
          Select All
        </DropdownMenuCheckboxItem>
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option}
            checked={selected.includes(option)}
            onCheckedChange={(checked) => {
              if (checked) {
                onChange([...selected, option]);
              } else {
                onChange(selected.filter((item) => item !== option));
              }
            }}
          >
            {option}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
