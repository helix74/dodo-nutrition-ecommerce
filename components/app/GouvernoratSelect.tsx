"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GOUVERNORATS, DEFAULT_GOUVERNORAT, type Gouvernorat } from "@/lib/constants/gouvernorats";

interface GouvernoratSelectProps {
  value?: string;
  onValueChange: (value: Gouvernorat) => void;
  disabled?: boolean;
  className?: string;
}

export function GouvernoratSelect({
  value,
  onValueChange,
  disabled = false,
  className,
}: GouvernoratSelectProps) {
  return (
    <Select
      value={value ?? DEFAULT_GOUVERNORAT}
      onValueChange={(v) => onValueChange(v as Gouvernorat)}
      disabled={disabled}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder="Sélectionnez un gouvernorat" />
      </SelectTrigger>
      <SelectContent>
        {GOUVERNORATS.map((gouvernorat) => (
          <SelectItem key={gouvernorat} value={gouvernorat}>
            {gouvernorat}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
