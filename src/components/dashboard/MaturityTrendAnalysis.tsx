
import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { maturityTrendData } from '@/data/dashboardData';
import { format, parseISO, subMonths } from 'date-fns';
import { Button } from '@/components/ui/button';
import SiteSelector from '@/components/dashboard/SiteSelector';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { officeSites } from '@/data/officeSites';
import { toast } from 'sonner';

type TimePeriod = '3m' | '6m' | '1y';

// Create sample data for sites that don't have data
const generateSampleDataForSite = (siteId: number) => {
  const now = new Date();
  const months = 7; // Generate 7 months of data
  const dimensions = [
    'Internal Support', 'External Support', 'Support Metrics', 
    'Redundancy', 'Inventory Management', 'Alerting', 
    'Monitoring', 'Maintenance', 'Testing'
  ];
  
  const result = [];
  
  for (let i = 0; i < months; i++) {
    const date = format(subMonths(now, 6 - i), 'yyyy-MM-dd');
    const baseScore = 2 + (i * 0.2); // Scores start at 2.0 and increase by 0.2 each month
    
    const dimensionsData = dimensions.map(dim => ({
      dimension: dim,
      score: baseScore + Math.random() * 0.5 // Add some randomness
    }));
    
    result.push({
      siteId,
      date,
      score: baseScore + 0.3, // Overall score slightly higher
      dimensions: dimensionsData
    });
  }
  
  return result;
};

const MaturityTrendAnalysis = () => {
  const [selectedSiteId, setSelectedSiteId] = useState<number | null>(null); // Default to All Sites
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('6m');
  const [expandedData, setExpandedData] = useState<any[]>([]);
  const [hiddenDimensions, setHiddenDimensions] = useState<string[]>([]);

  useEffect(() => {
    // Debug the available site IDs in the data
    const uniqueSiteIds = [...new Set(maturityTrendData.map(item => item.siteId))];
    console.log("Available site IDs in maturityTrendData:", uniqueSiteIds);
    
    // Create expanded dataset with generated data for each site
    const sitesWithData = new Set(uniqueSiteIds);
    const sitesToAddDataFor = officeSites
      .filter(site => !sitesWithData.has(site.id))
      .map(site => site.id);
    
    let newData = [...maturityTrendData];
    sitesToAddDataFor.forEach(siteId => {
      const sampleData = generateSampleDataForSite(siteId);
      newData = [...newData, ...sampleData];
    });
    
    setExpandedData(newData);
  }, []);

  // Filter data based on selected site and time period
  const filteredData = useMemo(() => {
    console.log("Selected Site ID:", selectedSiteId);
    console.log("Time Period:", timePeriod);
    
    const dataToUse = expandedData.length > 0 ? expandedData : maturityTrendData;
    
    if (selectedSiteId === null) {
      console.log("No site selected, showing all data");
      const now = new Date();
      let cutoffDate: Date;
      
      if (timePeriod === '3m') cutoffDate = subMonths(now, 3);
      else if (timePeriod === '6m') cutoffDate = subMonths(now, 6);
      else cutoffDate = subMonths(now, 12);
      
      return dataToUse
        .filter(item => new Date(item.date) >= cutoffDate)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    
    const now = new Date();
    let cutoffDate: Date;
    
    if (timePeriod === '3m') cutoffDate = subMonths(now, 3);
    else if (timePeriod === '6m') cutoffDate = subMonths(now, 6);
    else cutoffDate = subMonths(now, 12);
    
    const filtered = dataToUse
      .filter(item => 
        item.siteId === selectedSiteId && 
        new Date(item.date) >= cutoffDate
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    console.log(`Filtered Data for site ${selectedSiteId}:`, filtered);
    
    if (filtered.length === 0 && selectedSiteId !== null) {
      // Notify user if no data is available for this site
      toast.info(`No data available for the selected site in this time period. Generated sample data will be shown.`);
      
      // Generate sample data for this site if none exists
      const sampleData = generateSampleDataForSite(selectedSiteId)
        .filter(item => new Date(item.date) >= cutoffDate);
      
      return sampleData;
    }
    
    return filtered;
  }, [selectedSiteId, timePeriod, expandedData]);

  // Prepare dimension-based data for the selected site
  const chartData = useMemo(() => {
    if (!filteredData.length) {
      console.log("No filtered data available for chart");
      return [];
    }
    
    // Group data by date
    const result = filteredData.reduce((result: any[], item) => {
      const existingPoint = result.find(point => point.date === item.date);
      
      if (existingPoint) {
        existingPoint['Overall'] = item.score;
        
        if (item.dimensions) {
          item.dimensions.forEach((dim: any) => {
            existingPoint[dim.dimension] = dim.score;
          });
        }
      } else {
        const newPoint: any = { date: item.date, 'Overall': item.score };
        
        if (item.dimensions) {
          item.dimensions.forEach((dim: any) => {
            newPoint[dim.dimension] = dim.score;
          });
        }
        
        result.push(newPoint);
      }
      
      return result;
    }, []);
    
    console.log("Chart Data:", result);
    return result;
  }, [filteredData]);

  // Generate dimension lines dynamically
  const dimensionLines = useMemo(() => {
    if (!chartData.length) {
      console.log("No chart data available for dimension lines");
      return [];
    }
    
    // Get all dimensions from the first data point
    const dimensions = Object.keys(chartData[0]).filter(key => key !== 'date');
    console.log("Dimensions found:", dimensions);
    
    // Color palette for dimensions
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00C49F', '#FFBB28', '#FF8042', '#9370DB'];
    
    return dimensions.map((dimension, index) => ({
      dimension,
      color: colors[index % colors.length]
    }));
  }, [chartData]);

  const timeOptions = [
    { label: 'Last 3 Months', value: '3m' },
    { label: 'Last 6 Months', value: '6m' },
    { label: 'Last Year', value: '1y' },
  ];

  // Handle toggling dimensions visibility when clicking on legend
  const handleLegendClick = (dimension: string) => {
    setHiddenDimensions(current => {
      if (current.includes(dimension)) {
        return current.filter(dim => dim !== dimension);
      } else {
        return [...current, dimension];
      }
    });
  };

  // Custom legend renderer to make it clickable
  const renderLegend = (props: any) => {
    const { payload } = props;
    
    return (
      <div className="flex flex-wrap gap-2 justify-center mt-2">
        {payload.map((entry: any, index: number) => (
          <div 
            key={`legend-${index}`}
            className={`flex items-center cursor-pointer px-2 py-1 rounded ${
              hiddenDimensions.includes(entry.value) ? 'opacity-50' : 'opacity-100'
            }`}
            onClick={() => handleLegendClick(entry.value)}
          >
            <div 
              className="w-3 h-3 rounded-full mr-1" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="col-span-12">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Maturity Trend Analysis</CardTitle>
        <div className="flex items-center gap-2">
          <SiteSelector 
            selectedSiteId={selectedSiteId} 
            onChange={setSelectedSiteId} 
          />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {timeOptions.find(opt => opt.value === timePeriod)?.label || 'Time Period'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {timeOptions.map(option => (
                <DropdownMenuItem 
                  key={option.value}
                  onClick={() => setTimePeriod(option.value as TimePeriod)}
                  className={timePeriod === option.value ? "bg-muted" : ""}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => format(parseISO(date), 'MMM yyyy')}
                />
                <YAxis domain={[0, 5]} />
                <Tooltip 
                  formatter={(value) => [Number(value).toFixed(1), 'Score']}
                  labelFormatter={(date) => format(parseISO(date as string), 'MMMM d, yyyy')}
                />
                <Legend 
                  content={renderLegend}
                  onClick={(data) => handleLegendClick(data.value)}
                />
                {dimensionLines.map(({ dimension, color }) => (
                  <Line
                    key={dimension}
                    type="monotone"
                    dataKey={dimension}
                    stroke={color}
                    activeDot={{ r: 8 }}
                    name={dimension}
                    hide={hiddenDimensions.includes(dimension)}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No trend data available for the selected site and time period
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MaturityTrendAnalysis;
