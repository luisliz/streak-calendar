import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ViewSelectorProps {
  value: "monthRow" | "monthGrid" | "yearRow";
  onChange: (value: "monthRow" | "monthGrid" | "yearRow") => void;
}

export const ViewSelector = ({ value, onChange }: ViewSelectorProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select view" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="monthRow">Monthly Row</SelectItem>
        <SelectItem value="monthGrid">Monthly Grid</SelectItem>
        <SelectItem value="yearRow">Yearly Row</SelectItem>
      </SelectContent>
    </Select>
  );
};
