
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageTitle } from '@/components/ui/PageTitle';
import { StatCard } from '@/components/dashboard/StatCard';
import MaturityTrendAnalysis from '@/components/dashboard/MaturityTrendAnalysis';
import UnassessedSites from '@/components/dashboard/UnassessedSites';
import LowestScoringSites from '@/components/dashboard/LowestScoringSites';
import SiteMaturityBreakdown from '@/components/dashboard/SiteMaturityBreakdown';
import SiteBubbleChart from '@/components/dashboard/SiteBubbleChart';
import { 
  recentAssessments, 
  unassessedSites,
  siteBubbleChartData
} from '@/data/dashboardData';

// Enhanced sample data with dimension, parameter, service, and asset IDs for filtering
const enhancedBubbleChartData = siteBubbleChartData.map(site => ({
  ...site,
  // Adding random dimension, parameter, service, and asset IDs for demonstration
  dimensionId: Math.floor(Math.random() * 9) + 1, // Random dimension ID (1-9)
  parameterId: Math.floor(Math.random() * 44) + 1, // Random parameter ID (1-44)
  serviceId: Math.floor(Math.random() * 5) + 1, // Random service ID (1-5)
  assetId: Math.floor(Math.random() * 5) + 1, // Random asset ID (1-5)
}));

const Index = () => {
  return (
    <MainLayout>
      <PageTitle
        title="Disaster Recovery Dashboard"
        description="Monitor and manage disaster recovery metrics across all sites."
      />

      <div className="grid grid-cols-12 gap-4">
        {/* Stat Cards */}
        <StatCard
          title="Total Sites"
          value={29}
          description="Across 20 countries"
          icon={<div />}
          className="col-span-12 sm:col-span-6 lg:col-span-3"
        />
        <StatCard
          title="Average Maturity"
          value={3.1}
          description="Out of 5.0"
          icon={<div />}
          trend={{ value: 0.3, isPositive: true }}
          className="col-span-12 sm:col-span-6 lg:col-span-3"
        />
        <StatCard
          title="Sites Assessed"
          value={19}
          description={`${Math.round((19 / 29) * 100)}% of total sites`}
          icon={<div />}
          trend={{ value: 5, isPositive: true }}
          className="col-span-12 sm:col-span-6 lg:col-span-3"
        />
        <StatCard
          title="Sites Unassessed"
          value={unassessedSites.length}
          description="Requiring assessment"
          icon={<div />}
          trend={{ value: 3, isPositive: false }}
          className="col-span-12 sm:col-span-6 lg:col-span-3"
        />

        {/* Bubble Chart */}
        <div className="col-span-12">
          <SiteBubbleChart 
            data={enhancedBubbleChartData}
          />
        </div>

        {/* Trend Analysis */}
        <div className="col-span-12">
          <MaturityTrendAnalysis />
        </div>

        {/* Site Maturity Breakdown */}
        <div className="col-span-12">
          <SiteMaturityBreakdown />
        </div>

        {/* Lowest Scoring Sites */}
        <div className="col-span-12">
          <LowestScoringSites />
        </div>

        {/* Unassessed Sites */}
        <div className="col-span-12">
          <UnassessedSites />
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
