
import React, { useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { officeSites } from '@/data/officeSites';
import { maturityTrendData } from '@/data/dashboardData';

interface SiteSelectorProps {
  selectedSiteId: number | null;
  onChange: (siteId: number | null) => void;
}

const SiteSelector = ({ selectedSiteId, onChange }: SiteSelectorProps) => {
  // Get only the sites that have data in maturityTrendData
  const sitesWithData = useMemo(() => {
    const uniqueSiteIds = [...new Set(maturityTrendData.map(item => item.siteId))];
    return officeSites.filter(site => uniqueSiteIds.includes(site.id));
  }, []);

  return (
    <Select 
      value={selectedSiteId ? selectedSiteId.toString() : "all"}
      onValueChange={(value) => onChange(value === "all" ? null : parseInt(value))}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a site" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Sites</SelectItem>
        {sitesWithData.map(site => (
          <SelectItem key={site.id} value={site.id.toString()}>
            {site.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SiteSelector;
