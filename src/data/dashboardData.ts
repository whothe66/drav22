import { officeSites } from './officeSites';
import { criticalITServices } from './criticalITServices';

// Define types for our dashboard data
export interface MaturityScore {
  siteId: number;
  siteName: string;
  score: number;
  date: string;
  dimensions?: DimensionScore[];
}

export interface DimensionScore {
  dimension: string;
  score: number;
}

export interface ServiceDimensionScore {
  dimension: string;
  score: number;
}

export interface ServiceMaturity {
  serviceId: number;
  dimensionScores: ServiceDimensionScore[];
  overallScore: number;
}

export interface SiteMaturityBreakdown {
  siteId: number;
  siteName: string;
  city: string;
  country: string;
  tier: string;
  dimensions: DimensionScore[];
  overallScore: number;
  services?: ServiceMaturity[];
}

// Generate a list of unassessed sites (30% of sites as example)
export const unassessedSites = officeSites
  .filter((_, index) => index % 3 === 0)
  .map(site => ({
    id: site.id,
    name: site.name,
    city: site.city,
    country: site.country,
    tier: site.tier || 'Unspecified',
    lastAssessment: 'Never'
  }));

// Generate maturity trend data (last 6 months for 5 sites)
export const maturityTrendData: MaturityScore[] = [
  // Kaleidoscope trends
  { 
    siteId: 1, 
    siteName: 'Kaleidoscope', 
    score: 2.5, 
    date: '2023-11-15',
    dimensions: [
      { dimension: 'Internal Support', score: 2.8 },
      { dimension: 'External Support', score: 2.5 },
      { dimension: 'Support Metrics', score: 2.3 },
      { dimension: 'Redundancy', score: 2.2 },
      { dimension: 'Inventory Management', score: 2.7 },
      { dimension: 'Alerting', score: 2.6 },
      { dimension: 'Monitoring', score: 2.4 },
      { dimension: 'Maintenance', score: 2.4 },
      { dimension: 'Testing', score: 2.3 },
    ] 
  },
  { 
    siteId: 1, 
    siteName: 'Kaleidoscope', 
    score: 2.8, 
    date: '2023-12-15',
    dimensions: [
      { dimension: 'Internal Support', score: 3.0 },
      { dimension: 'External Support', score: 2.7 },
      { dimension: 'Support Metrics', score: 2.6 },
      { dimension: 'Redundancy', score: 2.5 },
      { dimension: 'Inventory Management', score: 3.0 },
      { dimension: 'Alerting', score: 2.9 },
      { dimension: 'Monitoring', score: 2.7 },
      { dimension: 'Maintenance', score: 2.7 },
      { dimension: 'Testing', score: 2.5 },
    ] 
  },
  { 
    siteId: 1, 
    siteName: 'Kaleidoscope', 
    score: 3.1, 
    date: '2024-01-15',
    dimensions: [
      { dimension: 'Internal Support', score: 3.4 },
      { dimension: 'External Support', score: 3.0 },
      { dimension: 'Support Metrics', score: 3.0 },
      { dimension: 'Redundancy', score: 2.9 },
      { dimension: 'Inventory Management', score: 3.2 },
      { dimension: 'Alerting', score: 3.1 },
      { dimension: 'Monitoring', score: 3.0 },
      { dimension: 'Maintenance', score: 3.0 },
      { dimension: 'Testing', score: 2.8 },
    ] 
  },
  { 
    siteId: 1, 
    siteName: 'Kaleidoscope', 
    score: 3.3, 
    date: '2024-02-15',
    dimensions: [
      { dimension: 'Internal Support', score: 3.6 },
      { dimension: 'External Support', score: 3.3 },
      { dimension: 'Support Metrics', score: 3.2 },
      { dimension: 'Redundancy', score: 3.1 },
      { dimension: 'Inventory Management', score: 3.5 },
      { dimension: 'Alerting', score: 3.3 },
      { dimension: 'Monitoring', score: 3.2 },
      { dimension: 'Maintenance', score: 3.2 },
      { dimension: 'Testing', score: 3.0 },
    ] 
  },
  { 
    siteId: 1, 
    siteName: 'Kaleidoscope', 
    score: 3.5, 
    date: '2024-03-15',
    dimensions: [
      { dimension: 'Internal Support', score: 3.9 },
      { dimension: 'External Support', score: 3.5 },
      { dimension: 'Support Metrics', score: 3.5 },
      { dimension: 'Redundancy', score: 3.5 },
      { dimension: 'Inventory Management', score: 3.6 },
      { dimension: 'Alerting', score: 3.4 },
      { dimension: 'Monitoring', score: 3.4 },
      { dimension: 'Maintenance', score: 3.3 },
      { dimension: 'Testing', score: 3.1 },
    ] 
  },
  { 
    siteId: 1, 
    siteName: 'Kaleidoscope', 
    score: 3.7, 
    date: '2024-04-15',
    dimensions: [
      { dimension: 'Internal Support', score: 4.2 },
      { dimension: 'External Support', score: 3.8 },
      { dimension: 'Support Metrics', score: 3.9 },
      { dimension: 'Redundancy', score: 4.1 },
      { dimension: 'Inventory Management', score: 3.7 },
      { dimension: 'Alerting', score: 3.5 },
      { dimension: 'Monitoring', score: 3.6 },
      { dimension: 'Maintenance', score: 3.4 },
      { dimension: 'Testing', score: 3.3 },
    ] 
  },
  
  // London Soho Works trends
  { 
    siteId: 2, 
    siteName: 'London Soho Works 180 Strand', 
    score: 2.6, 
    date: '2023-12-15',
    dimensions: [
      { dimension: 'Internal Support', score: 2.9 },
      { dimension: 'External Support', score: 2.7 },
      { dimension: 'Support Metrics', score: 2.5 },
      { dimension: 'Redundancy', score: 2.3 },
      { dimension: 'Inventory Management', score: 2.8 },
      { dimension: 'Alerting', score: 2.6 },
      { dimension: 'Monitoring', score: 2.4 },
      { dimension: 'Maintenance', score: 2.5 },
      { dimension: 'Testing', score: 2.4 },
    ]  
  },
  { 
    siteId: 2, 
    siteName: 'London Soho Works 180 Strand', 
    score: 2.7, 
    date: '2024-01-15',
    dimensions: [
      { dimension: 'Internal Support', score: 3.0 },
      { dimension: 'External Support', score: 2.9 },
      { dimension: 'Support Metrics', score: 2.6 },
      { dimension: 'Redundancy', score: 2.5 },
      { dimension: 'Inventory Management', score: 2.9 },
      { dimension: 'Alerting', score: 2.7 },
      { dimension: 'Monitoring', score: 2.5 },
      { dimension: 'Maintenance', score: 2.6 },
      { dimension: 'Testing', score: 2.5 },
    ]
  },
  { 
    siteId: 2, 
    siteName: 'London Soho Works 180 Strand', 
    score: 3.0, 
    date: '2024-02-15',
    dimensions: [
      { dimension: 'Internal Support', score: 3.3 },
      { dimension: 'External Support', score: 3.1 },
      { dimension: 'Support Metrics', score: 2.9 },
      { dimension: 'Redundancy', score: 2.8 },
      { dimension: 'Inventory Management', score: 3.2 },
      { dimension: 'Alerting', score: 3.0 },
      { dimension: 'Monitoring', score: 2.8 },
      { dimension: 'Maintenance', score: 2.9 },
      { dimension: 'Testing', score: 2.7 },
    ]
  },
  { 
    siteId: 2, 
    siteName: 'London Soho Works 180 Strand', 
    score: 3.2, 
    date: '2024-03-15',
    dimensions: [
      { dimension: 'Internal Support', score: 3.5 },
      { dimension: 'External Support', score: 3.3 },
      { dimension: 'Support Metrics', score: 3.2 },
      { dimension: 'Redundancy', score: 3.1 },
      { dimension: 'Inventory Management', score: 3.3 },
      { dimension: 'Alerting', score: 3.1 },
      { dimension: 'Monitoring', score: 3.0 },
      { dimension: 'Maintenance', score: 3.0 },
      { dimension: 'Testing', score: 2.9 },
    ]
  },
  { 
    siteId: 2, 
    siteName: 'London Soho Works 180 Strand', 
    score: 3.4, 
    date: '2024-04-15',
    dimensions: [
      { dimension: 'Internal Support', score: 3.7 },
      { dimension: 'External Support', score: 3.5 },
      { dimension: 'Support Metrics', score: 3.5 },
      { dimension: 'Redundancy', score: 3.6 },
      { dimension: 'Inventory Management', score: 3.4 },
      { dimension: 'Alerting', score: 3.2 },
      { dimension: 'Monitoring', score: 3.3 },
      { dimension: 'Maintenance', score: 3.1 },
      { dimension: 'Testing', score: 3.0 },
    ]
  },
  { 
    siteId: 2, 
    siteName: 'London Soho Works 180 Strand', 
    score: 3.6, 
    date: '2024-05-15',
    dimensions: [
      { dimension: 'Internal Support', score: 3.9 },
      { dimension: 'External Support', score: 3.7 },
      { dimension: 'Support Metrics', score: 3.8 },
      { dimension: 'Redundancy', score: 4.0 },
      { dimension: 'Inventory Management', score: 3.6 },
      { dimension: 'Alerting', score: 3.4 },
      { dimension: 'Monitoring', score: 3.5 },
      { dimension: 'Maintenance', score: 3.3 },
      { dimension: 'Testing', score: 3.2 },
    ]
  },
  
  // Dublin TSO trends with dimensions
  { 
    siteId: 5, 
    siteName: 'Dublin The Sorting Office (TSO)', 
    score: 2.2, 
    date: '2023-12-15',
    dimensions: [
      { dimension: 'Internal Support', score: 2.4 },
      { dimension: 'External Support', score: 2.2 },
      { dimension: 'Support Metrics', score: 2.0 },
      { dimension: 'Redundancy', score: 1.9 },
      { dimension: 'Inventory Management', score: 2.5 },
      { dimension: 'Alerting', score: 2.3 },
      { dimension: 'Monitoring', score: 2.1 },
      { dimension: 'Maintenance', score: 2.2 },
      { dimension: 'Testing', score: 2.0 },
    ]
  },
  { 
    siteId: 5, 
    siteName: 'Dublin The Sorting Office (TSO)', 
    score: 2.4, 
    date: '2024-01-15',
    dimensions: [
      { dimension: 'Internal Support', score: 2.6 },
      { dimension: 'External Support', score: 2.4 },
      { dimension: 'Support Metrics', score: 2.3 },
      { dimension: 'Redundancy', score: 2.2 },
      { dimension: 'Inventory Management', score: 2.7 },
      { dimension: 'Alerting', score: 2.5 },
      { dimension: 'Monitoring', score: 2.3 },
      { dimension: 'Maintenance', score: 2.4 },
      { dimension: 'Testing', score: 2.2 },
    ]
  },
  { 
    siteId: 5, 
    siteName: 'Dublin The Sorting Office (TSO)', 
    score: 2.7, 
    date: '2024-02-15',
    dimensions: [
      { dimension: 'Internal Support', score: 2.8 },
      { dimension: 'External Support', score: 2.6 },
      { dimension: 'Support Metrics', score: 2.5 },
      { dimension: 'Redundancy', score: 2.4 },
      { dimension: 'Inventory Management', score: 2.9 },
      { dimension: 'Alerting', score: 2.7 },
      { dimension: 'Monitoring', score: 2.4 },
      { dimension: 'Maintenance', score: 2.5 },
      { dimension: 'Testing', score: 2.3 },
    ]
  },
  { 
    siteId: 5, 
    siteName: 'Dublin The Sorting Office (TSO)', 
    score: 3.0, 
    date: '2024-03-15',
    dimensions: [
      { dimension: 'Internal Support', score: 3.0 },
      { dimension: 'External Support', score: 2.8 },
      { dimension: 'Support Metrics', score: 2.7 },
      { dimension: 'Redundancy', score: 2.6 },
      { dimension: 'Inventory Management', score: 3.1 },
      { dimension: 'Alerting', score: 2.9 },
      { dimension: 'Monitoring', score: 2.5 },
      { dimension: 'Maintenance', score: 2.6 },
      { dimension: 'Testing', score: 2.4 },
    ]
  },
  { 
    siteId: 5, 
    siteName: 'Dublin The Sorting Office (TSO)', 
    score: 3.1, 
    date: '2024-04-15',
    dimensions: [
      { dimension: 'Internal Support', score: 3.2 },
      { dimension: 'External Support', score: 3.0 },
      { dimension: 'Support Metrics', score: 2.8 },
      { dimension: 'Redundancy', score: 2.7 },
      { dimension: 'Inventory Management', score: 3.2 },
      { dimension: 'Alerting', score: 3.0 },
      { dimension: 'Monitoring', score: 2.6 },
      { dimension: 'Maintenance', score: 2.7 },
      { dimension: 'Testing', score: 2.5 },
    ]
  },
  { 
    siteId: 5, 
    siteName: 'Dublin The Sorting Office (TSO)', 
    score: 3.2, 
    date: '2024-05-15',
    dimensions: [
      { dimension: 'Internal Support', score: 3.4 },
      { dimension: 'External Support', score: 3.2 },
      { dimension: 'Support Metrics', score: 2.9 },
      { dimension: 'Redundancy', score: 2.8 },
      { dimension: 'Inventory Management', score: 3.3 },
      { dimension: 'Alerting', score: 3.1 },
      { dimension: 'Monitoring', score: 2.7 },
      { dimension: 'Maintenance', score: 2.8 },
      { dimension: 'Testing', score: 2.6 },
    ]
  },
  
  // Dubai Business Central Towers trends
  { 
    siteId: 7, 
    siteName: 'Dubai Business Central Towers', 
    score: 1.8, 
    date: '2023-12-15',
    dimensions: [
      { dimension: 'Internal Support', score: 2.0 },
      { dimension: 'External Support', score: 1.8 },
      { dimension: 'Support Metrics', score: 1.6 },
      { dimension: 'Redundancy', score: 1.4 },
      { dimension: 'Inventory Management', score: 1.9 },
      { dimension: 'Alerting', score: 1.7 },
      { dimension: 'Monitoring', score: 1.5 },
      { dimension: 'Maintenance', score: 1.4 },
      { dimension: 'Testing', score: 1.3 },
    ]
  },
  { 
    siteId: 7, 
    siteName: 'Dubai Business Central Towers', 
    score: 2.0, 
    date: '2024-01-15',
    dimensions: [
      { dimension: 'Internal Support', score: 2.2 },
      { dimension: 'External Support', score: 2.0 },
      { dimension: 'Support Metrics', score: 2.1 },
      { dimension: 'Redundancy', score: 2.0 },
      { dimension: 'Inventory Management', score: 2.3 },
      { dimension: 'Alerting', score: 2.2 },
      { dimension: 'Monitoring', score: 2.1 },
      { dimension: 'Maintenance', score: 2.0 },
      { dimension: 'Testing', score: 2.0 },
    ]
  },
  { 
    siteId: 7, 
    siteName: 'Dubai Business Central Towers', 
    score: 2.3, 
    date: '2024-02-15',
    dimensions: [
      { dimension: 'Internal Support', score: 2.4 },
      { dimension: 'External Support', score: 2.2 },
      { dimension: 'Support Metrics', score: 2.3 },
      { dimension: 'Redundancy', score: 2.1 },
      { dimension: 'Inventory Management', score: 2.5 },
      { dimension: 'Alerting', score: 2.4 },
      { dimension: 'Monitoring', score: 2.2 },
      { dimension: 'Maintenance', score: 2.1 },
      { dimension: 'Testing', score: 2.1 },
    ]
  },
  { 
    siteId: 7, 
    siteName: 'Dubai Business Central Towers', 
    score: 2.5, 
    date: '2024-03-15',
    dimensions: [
      { dimension: 'Internal Support', score: 2.6 },
      { dimension: 'External Support', score: 2.4 },
      { dimension: 'Support Metrics', score: 2.5 },
      { dimension: 'Redundancy', score: 2.2 },
      { dimension: 'Inventory Management', score: 2.7 },
      { dimension: 'Alerting', score: 2.6 },
      { dimension: 'Monitoring', score: 2.3 },
      { dimension: 'Maintenance', score: 2.2 },
      { dimension: 'Testing', score: 2.2 },
    ]
  },
  { 
    siteId: 7, 
    siteName: 'Dubai Business Central Towers', 
    score: 2.8, 
    date: '2024-04-15',
    dimensions: [
      { dimension: 'Internal Support', score: 2.8 },
      { dimension: 'External Support', score: 2.6 },
      { dimension: 'Support Metrics', score: 2.7 },
      { dimension: 'Redundancy', score: 2.3 },
      { dimension: 'Inventory Management', score: 2.9 },
      { dimension: 'Alerting', score: 2.8 },
      { dimension: 'Monitoring', score: 2.4 },
      { dimension: 'Maintenance', score: 2.3 },
      { dimension: 'Testing', score: 2.3 },
    ]
  },
  { 
    siteId: 7, 
    siteName: 'Dubai Business Central Towers', 
    score: 3.0, 
    date: '2024-05-15',
    dimensions: [
      { dimension: 'Internal Support', score: 3.0 },
      { dimension: 'External Support', score: 2.8 },
      { dimension: 'Support Metrics', score: 2.9 },
      { dimension: 'Redundancy', score: 2.4 },
      { dimension: 'Inventory Management', score: 3.1 },
      { dimension: 'Alerting', score: 3.0 },
      { dimension: 'Monitoring', score: 2.5 },
      { dimension: 'Maintenance', score: 2.4 },
      { dimension: 'Testing', score: 2.4 },
    ]
  },
  
  // Berlin Stralauer Allee trends
  { 
    siteId: 11, 
    siteName: 'Berlin Stralauer Allee 2', 
    score: 2.1, 
    date: '2023-12-15',
    dimensions: [
      { dimension: 'Internal Support', score: 2.3 },
      { dimension: 'External Support', score: 2.1 },
      { dimension: 'Support Metrics', score: 2.0 },
      { dimension: 'Redundancy', score: 1.8 },
      { dimension: 'Inventory Management', score: 2.4 },
      { dimension: 'Alerting', score: 2.2 },
      { dimension: 'Monitoring', score: 2.0 },
      { dimension: 'Maintenance', score: 1.9 },
      { dimension: 'Testing', score: 1.8 },
    ]
  },
  { 
    siteId: 11, 
    siteName: 'Berlin Stralauer Allee 2', 
    score: 2.3, 
    date: '2024-01-15',
    dimensions: [
      { dimension: 'Internal Support', score: 2.5 },
      { dimension: 'External Support', score: 2.3 },
      { dimension: 'Support Metrics', score: 2.2 },
      { dimension: 'Redundancy', score: 2.1 },
      { dimension: 'Inventory Management', score: 2.6 },
      { dimension: 'Alerting', score: 2.4 },
      { dimension: 'Monitoring', score: 2.1 },
      { dimension: 'Maintenance', score: 2.0 },
      { dimension: 'Testing', score: 2.0 },
    ]
  },
  { 
    siteId: 11, 
    siteName: 'Berlin Stralauer Allee 2', 
    score: 2.5, 
    date: '2024-02-15',
    dimensions: [
      { dimension: 'Internal Support', score: 2.7 },
      { dimension: 'External Support', score: 2.5 },
      { dimension: 'Support Metrics', score: 2.4 },
      { dimension: 'Redundancy', score: 2.3 },
      { dimension: 'Inventory Management', score: 2.8 },
      { dimension: 'Alerting', score: 2.6 },
      { dimension: 'Monitoring', score: 2.2 },
      { dimension: 'Maintenance', score: 2.1 },
      { dimension: 'Testing', score: 2.1 },
    ]
  },
  { 
    siteId: 11, 
    siteName: 'Berlin Stralauer Allee 2', 
    score: 2.8, 
    date: '2024-03-15',
    dimensions: [
      { dimension: 'Internal Support', score: 2.9 },
      { dimension: 'External Support', score: 2.7 },
      { dimension: 'Support Metrics', score: 2.5 },
      { dimension: 'Redundancy', score: 2.4 },
      { dimension: 'Inventory Management', score: 3.0 },
      { dimension: 'Alerting', score: 2.8 },
      { dimension: 'Monitoring', score: 2.3 },
      { dimension: 'Maintenance', score: 2.2 },
      { dimension: 'Testing', score: 2.2 },
    ]
  },
  { 
    siteId: 11, 
    siteName: 'Berlin Stralauer Allee 2', 
    score: 3.0, 
    date: '2024-04-15',
    dimensions: [
      { dimension: 'Internal Support', score: 3.1 },
      { dimension: 'External Support', score: 2.9 },
      { dimension: 'Support Metrics', score: 2.6 },
      { dimension: 'Redundancy', score: 2.5 },
      { dimension: 'Inventory Management', score: 3.2 },
      { dimension: 'Alerting', score: 3.0 },
      { dimension: 'Monitoring', score: 2.4 },
      { dimension: 'Maintenance', score: 2.3 },
      { dimension: 'Testing', score: 2.3 },
    ]
  },
  { 
    siteId: 11, 
    siteName: 'Berlin Stralauer Allee 2', 
    score: 3.3, 
    date: '2024-05-15',
    dimensions: [
      { dimension: 'Internal Support', score: 3.3 },
      { dimension: 'External Support', score: 3.1 },
      { dimension: 'Support Metrics', score: 2.7 },
      { dimension: 'Redundancy', score: 2.6 },
      { dimension: 'Inventory Management', score: 3.4 },
      { dimension: 'Alerting', score: 3.2 },
      { dimension: 'Monitoring', score: 2.5 },
      { dimension: 'Maintenance', score: 2.4 },
      { dimension: 'Testing', score: 2.4 },
    ]
  },
  
  // New York Tech Hub trends
  { 
    siteId: 3, 
    siteName: 'New York Tech Hub', 
    score: 2.3, 
    date: '2023-11-15',
    dimensions: [
      { dimension: 'Internal Support', score: 2.5 },
      { dimension: 'External Support', score: 2.2 },
      { dimension: 'Support Metrics', score: 2.1 },
      { dimension: 'Redundancy', score: 2.0 },
      { dimension: 'Inventory Management', score: 2.4 },
      { dimension: 'Alerting', score: 2.3 },
      { dimension: 'Monitoring', score: 2.1 },
      { dimension: 'Maintenance', score: 2.2 },
      { dimension: 'Testing', score: 2.0 },
    ] 
  },
  { 
    siteId: 3, 
    siteName: 'New York Tech Hub', 
    score: 2.6, 
    date: '2023-12-15',
    dimensions: [
      { dimension: 'Internal Support', score: 2.7 },
      { dimension: 'External Support', score: 2.5 },
      { dimension: 'Support Metrics', score: 2.4 },
      { dimension: 'Redundancy', score: 2.3 },
      { dimension: 'Inventory Management', score: 2.6 },
      { dimension: 'Alerting', score: 2.5 },
      { dimension: 'Monitoring', score: 2.3 },
      { dimension: 'Maintenance', score: 2.4 },
      { dimension: 'Testing', score: 2.2 },
    ] 
  },
  { 
    siteId: 3, 
    siteName: 'New York Tech Hub', 
    score: 2.9, 
    date: '2024-01-15',
    dimensions: [
      { dimension: 'Internal Support', score: 3.0 },
      { dimension: 'External Support', score: 2.7 },
      { dimension: 'Support Metrics', score: 2.6 },
      { dimension: 'Redundancy', score: 2.5 },
      { dimension: 'Inventory Management', score: 2.8 },
      { dimension: 'Alerting', score: 2.7 },
      { dimension: 'Monitoring', score: 2.5 },
      { dimension: 'Maintenance', score: 2.6 },
      { dimension: 'Testing', score: 2.4 },
    ] 
  },
  { 
    siteId: 3, 
    siteName: 'New York Tech Hub', 
    score: 3.2, 
    date: '2024-02-15',
    dimensions: [
      { dimension: 'Internal Support', score: 3.3 },
      { dimension: 'External Support', score: 3.0 },
      { dimension: 'Support Metrics', score: 2.9 },
      { dimension: 'Redundancy', score: 2.8 },
      { dimension: 'Inventory Management', score: 3.1 },
      { dimension: 'Alerting', score: 3.0 },
      { dimension: 'Monitoring', score: 2.7 },
      { dimension: 'Maintenance', score: 2.8 },
      { dimension: 'Testing', score: 2.6 },
    ] 
  },
  { 
    siteId: 3, 
    siteName: 'New York Tech Hub', 
    score: 3.5, 
    date: '2024-03-15',
    dimensions: [
      { dimension: 'Internal Support', score: 3.6 },
      { dimension: 'External Support', score: 3.3 },
      { dimension: 'Support Metrics', score: 3.2 },
      { dimension: 'Redundancy', score: 3.1 },
      { dimension: 'Inventory Management', score: 3.4 },
      { dimension: 'Alerting', score: 3.3 },
      { dimension: 'Monitoring', score: 3.0 },
      { dimension: 'Maintenance', score: 3.1 },
      { dimension: 'Testing', score: 2.9 },
    ] 
  },
  { 
    siteId: 3, 
    siteName: 'New York Tech Hub', 
    score: 3.7, 
    date: '2024-04-15',
    dimensions: [
      { dimension: 'Internal Support', score: 3.8 },
      { dimension: 'External Support', score: 3.5 },
      { dimension: 'Support Metrics', score: 3.4 },
      { dimension: 'Redundancy', score: 3.3 },
      { dimension: 'Inventory Management', score: 3.6 },
      { dimension: 'Alerting', score: 3.5 },
      { dimension: 'Monitoring', score: 3.2 },
      { dimension: 'Maintenance', score: 3.3 },
      { dimension: 'Testing', score: 3.1 },
    ] 
  },
];

// Generate lowest scoring sites
export const lowestScoringSites = [
  { id: 28, name: 'Almaty Regus Dialin House', score: 1.8, city: 'Almaty', country: 'Kazakhstan', tier: 'Tier 3' },
  { id: 29, name: 'Astana', score: 1.9, city: 'Astana', country: 'Kazakhstan', tier: 'Tier 3' },
  { id: 23, name: 'Lagos Africa Works', score: 2.0, city: 'Lagos', country: 'Nigeria', tier: 'Tier 3' },
  { id: 20, name: 'Business Front', score: 2.1, city: 'Riyadh', country: 'Saudi Arabia', tier: 'Tier 3' },
  { id: 19, name: 'Johannesburg Wework-The Link', score: 2.2, city: 'Johannesburg', country: 'South Africa', tier: 'Tier 3' },
];

// Generate sample service maturity data for each site
const generateServiceMaturityData = (siteId: number): ServiceMaturity[] => {
  // Generate scores for a subset of services
  return criticalITServices.slice(0, 4).map((service, idx) => {
    // Generate dimension scores - slightly different for each service
    const dimensionScores: ServiceDimensionScore[] = [
      { dimension: 'Internal Support', score: 3.5 + (idx * 0.2) % 1.5 },
      { dimension: 'External Support', score: 3.2 + (idx * 0.3) % 1.5 },
      { dimension: 'Support Metrics', score: 3.3 + (idx * 0.1) % 1.5 },
      { dimension: 'Redundancy', score: 3.6 + (idx * 0.3) % 1.5 },
      { dimension: 'Inventory Management', score: 3.0 + (idx * 0.2) % 1.5 },
      { dimension: 'Alerting', score: 2.8 + (idx * 0.3) % 1.5 },
      { dimension: 'Monitoring', score: 3.1 + (idx * 0.2) % 1.5 },
      { dimension: 'Maintenance', score: 2.9 + (idx * 0.1) % 1.5 },
      { dimension: 'Testing', score: 2.7 + (idx * 0.3) % 1.5 },
    ];
    
    // Calculate the average score for this service
    const overallScore = dimensionScores.reduce((sum, dim) => sum + dim.score, 0) / dimensionScores.length;
    
    return {
      serviceId: service.id,
      dimensionScores,
      overallScore
    };
  });
};

// Generate site maturity breakdown data
export const siteMaturityBreakdowns: SiteMaturityBreakdown[] = [
  {
    siteId: 1,
    siteName: 'Kaleidoscope',
    city: 'London',
    country: 'United Kingdom',
    tier: 'Tier 1',
    dimensions: [
      { dimension: 'Internal Support', score: 4.2 },
      { dimension: 'External Support', score: 3.8 },
      { dimension: 'Support Metrics', score: 3.9 },
      { dimension: 'Redundancy', score: 4.1 },
      { dimension: 'Inventory Management', score: 3.7 },
      { dimension: 'Alerting', score: 3.5 },
      { dimension: 'Monitoring', score: 3.6 },
      { dimension: 'Maintenance', score: 3.4 },
      { dimension: 'Testing', score: 3.3 },
    ],
    overallScore: 3.7,
    services: generateServiceMaturityData(1)
  },
  {
    siteId: 2,
    siteName: 'London Soho Works 180 Strand',
    city: 'London',
    country: 'United Kingdom',
    tier: 'Tier 1',
    dimensions: [
      { dimension: 'Internal Support', score: 3.9 },
      { dimension: 'External Support', score: 3.7 },
      { dimension: 'Support Metrics', score: 3.8 },
      { dimension: 'Redundancy', score: 4.0 },
      { dimension: 'Inventory Management', score: 3.6 },
      { dimension: 'Alerting', score: 3.4 },
      { dimension: 'Monitoring', score: 3.5 },
      { dimension: 'Maintenance', score: 3.3 },
      { dimension: 'Testing', score: 3.2 },
    ],
    overallScore: 3.6,
    services: generateServiceMaturityData(2)
  },
  {
    siteId: 5,
    siteName: 'Dublin The Sorting Office (TSO)',
    city: 'Dublin',
    country: 'Ireland',
    tier: 'Tier 1',
    dimensions: [
      { dimension: 'Internal Support', score: 3.6 },
      { dimension: 'External Support', score: 3.4 },
      { dimension: 'Support Metrics', score: 3.5 },
      { dimension: 'Redundancy', score: 3.7 },
      { dimension: 'Inventory Management', score: 3.3 },
      { dimension: 'Alerting', score: 3.0 },
      { dimension: 'Monitoring', score: 3.1 },
      { dimension: 'Maintenance', score: 2.9 },
      { dimension: 'Testing', score: 2.8 },
    ],
    overallScore: 3.2,
    services: generateServiceMaturityData(5)
  },
  {
    siteId: 7,
    siteName: 'Dubai Business Central Towers',
    city: 'Dubai',
    country: 'United Emirates',
    tier: 'Tier 1',
    dimensions: [
      { dimension: 'Internal Support', score: 3.3 },
      { dimension: 'External Support', score: 3.0 },
      { dimension: 'Support Metrics', score: 3.1 },
      { dimension: 'Redundancy', score: 3.2 },
      { dimension: 'Inventory Management', score: 3.0 },
      { dimension: 'Alerting', score: 2.8 },
      { dimension: 'Monitoring', score: 2.9 },
      { dimension: 'Maintenance', score: 2.7 },
      { dimension: 'Testing', score: 2.6 },
    ],
    overallScore: 3.0,
    services: generateServiceMaturityData(7)
  },
  {
    siteId: 11,
    siteName: 'Berlin Stralauer Allee 2',
    city: 'Berlin',
    country: 'Germany',
    tier: 'Tier 1',
    dimensions: [
      { dimension: 'Internal Support', score: 3.7 },
      { dimension: 'External Support', score: 3.5 },
      { dimension: 'Support Metrics', score: 3.6 },
      { dimension: 'Redundancy', score: 3.8 },
      { dimension: 'Inventory Management', score: 3.4 },
      { dimension: 'Alerting', score: 3.2 },
      { dimension: 'Monitoring', score: 3.3 },
      { dimension: 'Maintenance', score: 3.0 },
      { dimension: 'Testing', score: 2.9 },
    ],
    overallScore: 3.3,
    services: generateServiceMaturityData(11)
  },
];

// Overall maturity scores by tier for the dashboard
export const tierMaturityScores = [
  { tier: 'Tier 1', avgScore: 3.4 },
  { tier: 'Tier 2', avgScore: 2.7 },
  { tier: 'Tier 3', avgScore: 2.1 },
];

// Recent assessments for dashboard
export const recentAssessments = [
  { id: 1, siteName: 'Kaleidoscope', date: '2024-05-15', score: 3.7, auditor: 'John Smith' },
  { id: 2, siteName: 'London Soho Works 180 Strand', date: '2024-05-12', score: 3.6, auditor: 'Emma Williams' },
  { id: 3, siteName: 'London Hylo', date: '2024-05-10', score: 3.5, auditor: 'James Brown' },
  { id: 4, siteName: 'Dublin The Sorting Office (TSO)', date: '2024-05-07', score: 3.2, auditor: 'Sarah Johnson' },
  { id: 5, siteName: 'Berlin Stralauer Allee 2', date: '2024-05-05', score: 3.3, auditor: 'Michael Davis' },
];

// Site data for bubble chart (includes active risks/issues and employee count)
export const siteBubbleChartData = [
  { 
    siteId: 1, 
    siteName: 'Kaleidoscope', 
    activeRisksIssues: 12, 
    employeeCount: 425, 
    maturityScore: 3.7,
    tier: 1
  },
  { 
    siteId: 2, 
    siteName: 'London Soho Works 180 Strand', 
    activeRisksIssues: 8, 
    employeeCount: 320, 
    maturityScore: 3.6,
    tier: 1 
  },
  { 
    siteId: 3, 
    siteName: 'New York Tech Hub', 
    activeRisksIssues: 15, 
    employeeCount: 380, 
    maturityScore: 3.7,
    tier: 1 
  },
  { 
    siteId: 5, 
    siteName: 'Dublin The Sorting Office (TSO)', 
    activeRisksIssues: 6, 
    employeeCount: 210, 
    maturityScore: 3.2,
    tier: 1 
  },
  { 
    siteId: 7, 
    siteName: 'Dubai Business Central Towers', 
    activeRisksIssues: 9, 
    employeeCount: 175, 
    maturityScore: 3.0,
    tier: 1 
  },
  { 
    siteId: 11, 
    siteName: 'Berlin Stralauer Allee 2', 
    activeRisksIssues: 7, 
    employeeCount: 230, 
    maturityScore: 3.3,
    tier: 1 
  },
  { 
    siteId: 19, 
    siteName: 'Johannesburg Wework-The Link', 
    activeRisksIssues: 18, 
    employeeCount: 140, 
    maturityScore: 2.2,
    tier: 3 
  },
  { 
    siteId: 20, 
    siteName: 'Business Front', 
    activeRisksIssues: 21, 
    employeeCount: 120, 
    maturityScore: 2.1,
    tier: 3 
  },
  { 
    siteId: 23, 
    siteName: 'Lagos Africa Works', 
    activeRisksIssues: 24, 
    employeeCount: 95, 
    maturityScore: 2.0,
    tier: 3 
  },
  { 
    siteId: 28, 
    siteName: 'Almaty Regus Dialin House', 
    activeRisksIssues: 27, 
    employeeCount: 75, 
    maturityScore: 1.8,
    tier: 3 
  },
  { 
    siteId: 29, 
    siteName: 'Astana', 
    activeRisksIssues: 25, 
    employeeCount: 80, 
    maturityScore: 1.9,
    tier: 3 
  },
  { 
    siteId: 12, 
    siteName: 'Amsterdam Singel 542', 
    activeRisksIssues: 4, 
    employeeCount: 190, 
    maturityScore: 4.1,
    tier: 3 
  },
  { 
    siteId: 14, 
    siteName: 'San Francisco Data Center', 
    activeRisksIssues: 2, 
    employeeCount: 85, 
    maturityScore: 4.5,
    tier: 2 
  },
];
