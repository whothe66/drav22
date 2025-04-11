
import React from 'react';
import { Filter } from 'lucide-react';
import { FilterBar } from '@/components/ui/FilterBar';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Toggle } from '@/components/ui/toggle';
import { Dimension, drDimensions } from '@/data/drParameters';

// Flatten parameters from all dimensions
const allParameters = drDimensions.flatMap(dimension => 
  dimension.parameters.map(param => ({
    id: param.id,
    name: param.name,
    dimensionId: dimension.id,
    dimensionName: dimension.name
  }))
);

// Mock critical services and assets for demo purposes
// In a real app, these would come from your data sources
const criticalServices = [
  { id: 1, name: "ERP System" },
  { id: 2, name: "CRM Platform" },
  { id: 3, name: "Email Services" },
  { id: 4, name: "File Storage" },
  { id: 5, name: "Database Services" }
];

const criticalAssets = [
  { id: 1, name: "Primary Data Center" },
  { id: 2, name: "Secondary Data Center" },
  { id: 3, name: "Cloud Infrastructure" },
  { id: 4, name: "Network Equipment" },
  { id: 5, name: "Server Hardware" }
];

export interface BubbleChartFilters {
  dimension: number | null;
  parameter: number | null;
  service: number | null;
  asset: number | null;
  showFilters: boolean;
}

interface SiteBubbleChartFiltersProps {
  filters: BubbleChartFilters;
  onFilterChange: (filters: BubbleChartFilters) => void;
}

const SiteBubbleChartFilters: React.FC<SiteBubbleChartFiltersProps> = ({ 
  filters, 
  onFilterChange 
}) => {
  // Filter parameters based on selected dimension
  const filteredParameters = filters.dimension 
    ? allParameters.filter(param => param.dimensionId === filters.dimension)
    : allParameters;
  
  const handleDimensionChange = (value: string) => {
    const dimensionId = parseInt(value);
    onFilterChange({ 
      ...filters, 
      dimension: dimensionId, 
      // Reset parameter when dimension changes
      parameter: null 
    });
  };

  const handleParameterChange = (value: string) => {
    onFilterChange({ 
      ...filters, 
      parameter: parseInt(value) 
    });
  };

  const handleServiceChange = (value: string) => {
    onFilterChange({ 
      ...filters, 
      service: parseInt(value) 
    });
  };

  const handleAssetChange = (value: string) => {
    onFilterChange({ 
      ...filters, 
      asset: parseInt(value) 
    });
  };

  const toggleFilters = () => {
    onFilterChange({
      ...filters,
      showFilters: !filters.showFilters
    });
  };

  // Reset all filters
  const resetFilters = () => {
    onFilterChange({
      dimension: null,
      parameter: null,
      service: null,
      asset: null,
      showFilters: filters.showFilters
    });
  };

  // Only render dropdown options if filters are shown
  return (
    <div className="mb-2">
      <div className="flex justify-between items-center mb-2">
        <Toggle 
          pressed={filters.showFilters} 
          onPressedChange={toggleFilters}
          className="flex items-center gap-2" 
          aria-label="Toggle filters"
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </Toggle>
        
        {filters.showFilters && (
          <button 
            onClick={resetFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Reset
          </button>
        )}
      </div>

      {filters.showFilters && (
        <FilterBar>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
            <Select 
              value={filters.dimension?.toString() || undefined} 
              onValueChange={handleDimensionChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="DR Dimension" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dimensions</SelectItem>
                {drDimensions.map(dimension => (
                  <SelectItem key={dimension.id} value={dimension.id.toString()}>
                    {dimension.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={filters.parameter?.toString() || undefined} 
              onValueChange={handleParameterChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="DR Parameter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Parameters</SelectItem>
                {filteredParameters.map(parameter => (
                  <SelectItem key={parameter.id} value={parameter.id.toString()}>
                    {parameter.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={filters.service?.toString() || undefined} 
              onValueChange={handleServiceChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Critical Service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                {criticalServices.map(service => (
                  <SelectItem key={service.id} value={service.id.toString()}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={filters.asset?.toString() || undefined} 
              onValueChange={handleAssetChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Critical Asset" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assets</SelectItem>
                {criticalAssets.map(asset => (
                  <SelectItem key={asset.id} value={asset.id.toString()}>
                    {asset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </FilterBar>
      )}
    </div>
  );
};

export default SiteBubbleChartFilters;
