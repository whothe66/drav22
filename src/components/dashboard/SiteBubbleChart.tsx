
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Plot from 'react-plotly.js';
import SiteBubbleChartFilters, { BubbleChartFilters } from './SiteBubbleChartFilters';

interface BubbleChartProps {
  data: Array<{
    siteId: number;
    siteName: string;
    activeRisksIssues: number;
    employeeCount: number;
    maturityScore: number;
    tier: number;
    // Adding optional fields for filtering
    dimensionId?: number;
    parameterId?: number;
    serviceId?: number;
    assetId?: number;
  }>;
  className?: string;
}

// Function to determine bubble color based on maturity score
const getBubbleColor = (score: number) => {
  if (score < 2.5) return "#ea384c"; // Red
  if (score >= 2.5 && score < 4) return "#FEF7CD"; // Soft Yellow
  return "#F2FCE2"; // Soft Green
};

// Function to determine bubble size based on tier
const getBubbleSize = (tier: number) => {
  switch(tier) {
    case 1: return 25; // Biggest bubble for Tier 1
    case 2: return 18; // Medium bubble for Tier 2
    default: return 12; // Smallest bubble for Tier 3 and others
  }
};

const SiteBubbleChart: React.FC<BubbleChartProps> = ({ data, className }) => {
  // Initialize filters
  const [filters, setFilters] = useState<BubbleChartFilters>({
    dimension: null,
    parameter: null,
    service: null,
    asset: null,
    showFilters: false
  });

  // Filter data based on selected filters
  const filteredData = data.filter(site => {
    // Check each filter
    if (filters.dimension && site.dimensionId !== filters.dimension) return false;
    if (filters.parameter && site.parameterId !== filters.parameter) return false;
    if (filters.service && site.serviceId !== filters.service) return false;
    if (filters.asset && site.assetId !== filters.asset) return false;
    
    return true;
  });

  // Prepare data for Plotly
  const plotData = [{
    x: filteredData.map(site => site.activeRisksIssues),
    y: filteredData.map(site => site.maturityScore),
    text: filteredData.map(site => 
      `${site.siteName}<br>Maturity Score: ${site.maturityScore.toFixed(1)}<br>Risks & Issues: ${site.activeRisksIssues}<br>Tier: ${site.tier}`
    ),
    mode: 'markers' as const,
    marker: {
      size: filteredData.map(site => getBubbleSize(site.tier)),
      color: filteredData.map(site => getBubbleColor(site.maturityScore)),
      line: {
        color: 'rgba(0,0,0,0.3)',
        width: 1
      },
      opacity: 0.8
    },
    type: 'scatter' as const,
    hoverinfo: 'text' as const,
    showlegend: false // Hide the trace 0 legend
  }];

  // Add legend data for bubble colors
  const colorLegendData = [
    {
      x: [null],
      y: [null],
      mode: 'markers' as const,
      marker: {
        size: 10,
        color: '#ea384c'
      },
      name: 'Low Maturity (< 2.5)',
      showlegend: true,
      type: 'scatter' as const,
      hoverinfo: 'none' as const,
      legendgroup: 'color'
    },
    {
      x: [null],
      y: [null],
      mode: 'markers' as const,
      marker: {
        size: 10,
        color: '#FEF7CD'
      },
      name: 'Medium Maturity (2.5 - 4.0)',
      showlegend: true,
      type: 'scatter' as const,
      hoverinfo: 'none' as const,
      legendgroup: 'color'
    },
    {
      x: [null],
      y: [null],
      mode: 'markers' as const,
      marker: {
        size: 10,
        color: '#F2FCE2'
      },
      name: 'High Maturity (> 4.0)',
      showlegend: true,
      type: 'scatter' as const,
      hoverinfo: 'none' as const,
      legendgroup: 'color'
    }
  ];

  // Add legend data for bubble sizes
  const sizeLegendData = [
    {
      x: [null],
      y: [null],
      mode: 'markers' as const,
      marker: {
        size: 25,
        color: 'rgba(150,150,150,0.5)'
      },
      name: 'Tier 1 (Critical)',
      showlegend: true,
      type: 'scatter' as const,
      hoverinfo: 'none' as const,
      legendgroup: 'size'
    },
    {
      x: [null],
      y: [null],
      mode: 'markers' as const,
      marker: {
        size: 18,
        color: 'rgba(150,150,150,0.5)'
      },
      name: 'Tier 2 (Important)',
      showlegend: true,
      type: 'scatter' as const,
      hoverinfo: 'none' as const,
      legendgroup: 'size'
    },
    {
      x: [null],
      y: [null],
      mode: 'markers' as const,
      marker: {
        size: 12,
        color: 'rgba(150,150,150,0.5)'
      },
      name: 'Tier 3 (Standard)',
      showlegend: true,
      type: 'scatter' as const,
      hoverinfo: 'none' as const,
      legendgroup: 'size'
    }
  ];

  // Combine all data sets
  const allPlotData = [...plotData, ...colorLegendData, ...sizeLegendData];

  const layout = {
    height: 450, // Increased height to accommodate legends
    margin: { t: 10, b: 80, l: 70, r: 20 },
    xaxis: {
      title: {
        text: 'Number of Active Risks & Issues',
        font: {
          size: 14,
          color: '#333',
          family: 'Arial, sans-serif',
          weight: 600
        },
        standoff: 20
      },
      zeroline: false,
      gridcolor: 'rgba(0,0,0,0.1)'
    },
    yaxis: {
      title: {
        text: 'DR Maturity Score',
        font: {
          size: 14,
          color: '#333',
          family: 'Arial, sans-serif',
          weight: 600
        },
        standoff: 20
      },
      range: [0, 5],
      zeroline: false,
      gridcolor: 'rgba(0,0,0,0.1)'
    },
    hovermode: 'closest' as const,
    showlegend: true,
    legend: {
      orientation: 'h' as const,
      y: -0.2,
      x: 0.5,
      xanchor: 'center' as const,
      traceorder: 'grouped' as 'grouped' | 'normal' | 'reversed' | 'reversed+grouped'
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)'
  };

  const config = {
    responsive: true,
    displayModeBar: false
  };

  return (
    <Card className={`col-span-12 ${className}`}>
      <CardHeader>
        <CardTitle>Site Risk Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <SiteBubbleChartFilters
          filters={filters}
          onFilterChange={setFilters}
        />
        <Plot
          data={allPlotData}
          layout={layout}
          config={config}
          style={{ width: '100%' }}
        />
      </CardContent>
    </Card>
  );
};

export default SiteBubbleChart;
