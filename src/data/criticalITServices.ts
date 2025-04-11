
export interface ConfigItem {
  id: number;
  assetId: number;
  name: string;
  manufacturer: string;
  eolDate: string;
  eowDate: string;
  rma: string;
  inUse: number;
  inStock: number;
}

export interface Asset {
  id: number;
  name: string;
  description: string;
  serviceId: number;
  siteId: number;
  criticality: 'High' | 'Medium' | 'Low';
  owner: string;
  vendor: string;
  type: string; // This property is required in the interface
}

// Add the Service interface that's being used but wasn't exported before
export interface Service {
  id: number;
  name: string;
  description: string;
  category: string;
  businessImpact: string;
  responsible: string;
}

// Sample Services Data
export const criticalITServices: Service[] = [
  {
    id: 1,
    name: "Core Network Infrastructure",
    description: "Essential networking services for all operations",
    category: "Infrastructure",
    businessImpact: "Critical",
    responsible: "Network Team"
  },
  {
    id: 2,
    name: "Internet Connectivity",
    description: "External connectivity services",
    category: "Infrastructure",
    businessImpact: "Critical",
    responsible: "Network Team"
  },
  {
    id: 3,
    name: "Network Services",
    description: "Core network services (DHCP, DNS, etc.)",
    category: "Infrastructure",
    businessImpact: "Critical",
    responsible: "Infrastructure Team"
  },
  {
    id: 4,
    name: "Meeting Room Systems",
    description: "All meeting room equipment and services",
    category: "End User",
    businessImpact: "High",
    responsible: "IT Support"
  },
  {
    id: 5,
    name: "End User Computing",
    description: "Employee computing devices and mobile services",
    category: "End User",
    businessImpact: "High",
    responsible: "IT Support"
  },
  {
    id: 6,
    name: "Facility Infrastructure",
    description: "Physical facility IT infrastructure",
    category: "Facilities",
    businessImpact: "High",
    responsible: "Facilities"
  }
];

// Convert existing assets to the new structure
import { criticalITAssets } from './criticalITAssets';

// Map assets to services
export const serviceAssets: Asset[] = criticalITAssets.map(asset => {
  let serviceId = 1; // Default to Core Network Infrastructure
  
  if (asset.type === "Network" && ["Internet Circuit", "Internet Gateway"].some(term => asset.name.includes(term))) {
    serviceId = 2; // Internet Connectivity
  } else if (["DHCP", "DNS", "Cache", "Firewall"].some(term => asset.name.includes(term))) {
    serviceId = 3; // Network Services
  } else if (["Meeting room", "TV screen", "Digital Signage", "Speaker", "MCU"].some(term => asset.name.includes(term))) {
    serviceId = 4; // Meeting Room Systems
  } else if (["Laptop", "Mobile", "Airtime", "Printer"].some(term => asset.name.includes(term))) {
    serviceId = 5; // End User Computing
  } else if (["Cabling", "UPS", "Environmental"].some(term => asset.name.includes(term))) {
    serviceId = 6; // Facility Infrastructure
  }
  
  // Make sure to include all properties from the original asset including type
  return {
    ...asset,
    serviceId
  };
});

export const getAssetsByService = (serviceId: number): Asset[] => {
  return serviceAssets.filter(asset => asset.serviceId === serviceId);
};

export const getAssetsByServiceAndSite = (serviceId: number, siteId: number): Asset[] => {
  return serviceAssets.filter(asset => asset.serviceId === serviceId && asset.siteId === siteId);
};

// Interface for formula settings
export interface FormulaSettings {
  useDimensionWeightage: boolean;
  useAssetCriticality: boolean;
  dimensionWeightageMultiplier: number;
  criticalityMultipliers: {
    High: number;
    Medium: number;
    Low: number;
  };
}

/**
 * Calculate the weighted dimension score using a customizable formula.
 * DR Dimension score = ((DR Parameter 1 score*Weightage %)+(DR Parameter 2 score*Weightage %)+(DR Parameter n score*Weightage %))/n
 * 
 * @param parameterScores - Array of parameter scores and weightages
 * @param formulaSettings - Optional settings to customize the formula
 * @param assetCriticality - Optional asset criticality to factor into the calculation
 * @returns The calculated weighted dimension score
 */
export const calculateWeightedDimensionScore = (
  parameterScores: { score: number, weightage: number }[],
  formulaSettings?: FormulaSettings,
  assetCriticality?: 'High' | 'Medium' | 'Low'
): number => {
  if (!parameterScores.length) return 0;
  
  const settings = formulaSettings || {
    useDimensionWeightage: true,
    useAssetCriticality: false,
    dimensionWeightageMultiplier: 1.0,
    criticalityMultipliers: {
      High: 1.2,
      Medium: 1.0,
      Low: 0.8,
    }
  };
  
  let score = 0;
  
  if (settings.useDimensionWeightage) {
    const totalWeight = parameterScores.reduce((sum, param) => sum + param.weightage, 0);
    
    if (totalWeight === 0) return 0;
    
    score = parameterScores.reduce((sum, param) => sum + (param.score * param.weightage / 100), 0);
    
    // Apply dimension weightage multiplier
    score *= settings.dimensionWeightageMultiplier;
  } else {
    // Simple average if not using weightage
    score = parameterScores.reduce((sum, param) => sum + param.score, 0) / parameterScores.length;
  }
  
  // Apply criticality multiplier if enabled and criticality is provided
  if (settings.useAssetCriticality && assetCriticality) {
    score *= settings.criticalityMultipliers[assetCriticality];
  }
  
  return parseFloat(score.toFixed(1));
};

// Sample Configuration Items data
export const configItems: ConfigItem[] = [
  {
    id: 1,
    assetId: 1,
    name: "Cisco Catalyst 9500",
    manufacturer: "Cisco",
    eolDate: "2026-12-31",
    eowDate: "2025-06-30",
    rma: "Yes",
    inUse: 24,
    inStock: 4
  },
  {
    id: 2,
    assetId: 2,
    name: "Cisco Catalyst 9300",
    manufacturer: "Cisco",
    eolDate: "2025-03-31",
    eowDate: "2024-09-30",
    rma: "Yes",
    inUse: 48,
    inStock: 6
  },
  {
    id: 3,
    assetId: 4,
    name: "Aruba 9800 Controller",
    manufacturer: "Aruba",
    eolDate: "2027-09-30",
    eowDate: "2026-03-31",
    rma: "Yes",
    inUse: 8,
    inStock: 2
  },
  {
    id: 4,
    assetId: 7,
    name: "VeloCloud Edge 640",
    manufacturer: "VMware",
    eolDate: "2026-05-15",
    eowDate: "2025-05-15",
    rma: "Yes",
    inUse: 6,
    inStock: 2
  },
  {
    id: 5,
    assetId: 12,
    name: "Palo Alto PA-5250",
    manufacturer: "Palo Alto",
    eolDate: "2028-12-31",
    eowDate: "2027-12-31",
    rma: "Yes",
    inUse: 4,
    inStock: 1
  }
];

export const getConfigItemsByAsset = (assetId: number): ConfigItem[] => {
  return configItems.filter(item => item.assetId === assetId);
};

export default criticalITServices;
