
import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FilterOption {
  name: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

interface FilterBarProps {
  children?: React.ReactNode;
  className?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  filters?: FilterOption[];
}

export function FilterBar({ 
  children,
  className,
  searchPlaceholder = "Search...",
  onSearchChange,
  filters
}: FilterBarProps) {
  return (
    <Card className={cn(
      "p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center flex-wrap gap-3",
      className
    )}>
      {onSearchChange && (
        <div className="w-full sm:w-auto flex-1">
          <Input
            placeholder={searchPlaceholder}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full"
          />
        </div>
      )}
      
      {filters && filters.map((filter, index) => (
        <div key={index} className="flex items-center gap-2">
          <Select
            value={filter.value}
            onValueChange={filter.onChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={`Filter by ${filter.name.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {filter.options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
      
      {children}
    </Card>
  );
}
