
export interface Asset {
  id: number;
  name: string;
  description: string;
  siteId: number;
  type: string;
  criticality: 'High' | 'Medium' | 'Low';
  owner: string;
  vendor: string;
}

export const criticalITAssets: Asset[] = [
  // Core infrastructure assets
  {
    id: 1,
    name: "Core Switches",
    description: "Core network infrastructure switches",
    siteId: 1,
    type: "Network",
    criticality: "High",
    owner: "Network Team",
    vendor: "Cisco"
  },
  {
    id: 2,
    name: "Distribution Switches",
    description: "Network distribution layer switches",
    siteId: 1,
    type: "Network",
    criticality: "High",
    owner: "Network Team",
    vendor: "Cisco"
  },
  {
    id: 3,
    name: "Access Switches",
    description: "Access layer switches for wireless, AV, Security, and Event",
    siteId: 1,
    type: "Network",
    criticality: "Medium",
    owner: "Network Team",
    vendor: "Cisco"
  },
  {
    id: 4,
    name: "WiFi: Access Controllers (MDF)",
    description: "Wireless network controllers in MDF",
    siteId: 1,
    type: "Network",
    criticality: "High",
    owner: "Network Team",
    vendor: "Aruba"
  },
  {
    id: 5,
    name: "WiFi: Access Points (Floor)",
    description: "Wireless access points deployed across floors",
    siteId: 1,
    type: "Network",
    criticality: "Medium",
    owner: "Network Team",
    vendor: "Aruba"
  },
  
  // Internet connectivity
  {
    id: 6,
    name: "Internet Circuit",
    description: "Primary Internet connectivity circuit",
    siteId: 1,
    type: "Network",
    criticality: "High",
    owner: "Network Team",
    vendor: "Various ISPs"
  },
  {
    id: 7,
    name: "Internet Gateway (SD WAN) Velo",
    description: "Primary SD-WAN internet gateway",
    siteId: 1,
    type: "Network",
    criticality: "High",
    owner: "Network Team",
    vendor: "VeloCloud"
  },
  {
    id: 8,
    name: "Internet Gateway (SD WAN) Ark",
    description: "Secondary SD-WAN internet gateway",
    siteId: 1,
    type: "Network",
    criticality: "High",
    owner: "Network Team",
    vendor: "Aruba"
  },
  
  // Network services
  {
    id: 9,
    name: "DHCP server",
    description: "Dynamic Host Configuration Protocol server",
    siteId: 1,
    type: "Server",
    criticality: "High",
    owner: "Infrastructure Team",
    vendor: "Microsoft"
  },
  {
    id: 10,
    name: "DNS servers",
    description: "Domain Name System servers",
    siteId: 1,
    type: "Server",
    criticality: "High",
    owner: "Infrastructure Team",
    vendor: "Microsoft"
  },
  {
    id: 11,
    name: "Cache servers",
    description: "Content caching servers",
    siteId: 1,
    type: "Server",
    criticality: "Medium",
    owner: "Infrastructure Team",
    vendor: "Various"
  },
  {
    id: 12,
    name: "Firewalls",
    description: "Network security firewalls",
    siteId: 1,
    type: "Security",
    criticality: "High",
    owner: "Security Team",
    vendor: "Palo Alto"
  },
  
  // Meeting room equipment
  {
    id: 13,
    name: "Meeting room iPads",
    description: "iPads used for meeting room booking and control",
    siteId: 1,
    type: "End User",
    criticality: "Medium",
    owner: "IT Support",
    vendor: "Apple"
  },
  {
    id: 14,
    name: "Meeting room Mac minis",
    description: "Mac minis used in meeting rooms for presentations",
    siteId: 1,
    type: "End User",
    criticality: "Medium",
    owner: "IT Support",
    vendor: "Apple"
  },
  {
    id: 15,
    name: "Digital Signages",
    description: "Digital display signage throughout the building",
    siteId: 1,
    type: "End User",
    criticality: "Low",
    owner: "Facilities",
    vendor: "Various"
  },
  {
    id: 16,
    name: "TV screens (meeting room)",
    description: "Display screens in meeting rooms",
    siteId: 1,
    type: "End User",
    criticality: "Medium",
    owner: "IT Support",
    vendor: "Various"
  },
  {
    id: 17,
    name: "Speakers",
    description: "Audio speakers in meeting rooms and common areas",
    siteId: 1,
    type: "AV",
    criticality: "Medium",
    owner: "IT Support",
    vendor: "Various"
  },
  {
    id: 18,
    name: "MCUs",
    description: "Multipoint Control Units for video conferencing",
    siteId: 1,
    type: "AV",
    criticality: "High",
    owner: "IT Support",
    vendor: "Cisco"
  },
  
  // End user equipment
  {
    id: 19,
    name: "Laptops",
    description: "Corporate laptops issued to employees",
    siteId: 1,
    type: "End User",
    criticality: "Medium",
    owner: "IT Support",
    vendor: "Dell/Lenovo/Apple"
  },
  {
    id: 20,
    name: "Mobile phones",
    description: "Corporate mobile phones",
    siteId: 1,
    type: "End User",
    criticality: "Medium",
    owner: "IT Support",
    vendor: "Apple/Samsung"
  },
  {
    id: 21,
    name: "Airtime Service (SIM card)",
    description: "Mobile phone service for corporate devices",
    siteId: 1,
    type: "Service",
    criticality: "Medium",
    owner: "IT Support",
    vendor: "Various Carriers"
  },
  
  // Facility equipment
  {
    id: 22,
    name: "Multi-functional Printers",
    description: "Centralized printers (2 on each floor)",
    siteId: 1,
    type: "End User",
    criticality: "Medium",
    owner: "IT Support",
    vendor: "HP/Canon"
  },
  {
    id: 23,
    name: "LV cabling (between server rooms, floors)",
    description: "Low voltage cabling infrastructure between server rooms",
    siteId: 1,
    type: "Infrastructure",
    criticality: "High",
    owner: "Facilities",
    vendor: "Various"
  },
  {
    id: 24,
    name: "LV cabling (End user eg. wire jock to the Mac mini)",
    description: "Low voltage cabling to end user devices",
    siteId: 1,
    type: "Infrastructure",
    criticality: "Medium",
    owner: "Facilities",
    vendor: "Various"
  },
  {
    id: 25,
    name: "UPS",
    description: "Uninterruptible Power Supply",
    siteId: 1,
    type: "Power",
    criticality: "High",
    owner: "Facilities",
    vendor: "APC"
  },
  {
    id: 26,
    name: "Environmental Sensor (MDF/IDF)",
    description: "Temperature and humidity sensors in server rooms",
    siteId: 1,
    type: "Facilities",
    criticality: "Medium",
    owner: "Facilities",
    vendor: "Various"
  },
  
  // Duplicate assets for other sites (for demo purposes)
  {
    id: 27,
    name: "Core Switches",
    description: "Core network infrastructure switches",
    siteId: 2,
    type: "Network",
    criticality: "High",
    owner: "Network Team",
    vendor: "Cisco"
  },
  {
    id: 28,
    name: "Firewalls",
    description: "Network security firewalls",
    siteId: 2,
    type: "Security",
    criticality: "High",
    owner: "Security Team",
    vendor: "Palo Alto"
  },
  {
    id: 29,
    name: "Internet Circuit",
    description: "Primary Internet connectivity circuit",
    siteId: 3,
    type: "Network",
    criticality: "High",
    owner: "Network Team",
    vendor: "Various ISPs"
  },
  {
    id: 30,
    name: "WiFi: Access Points (Floor)",
    description: "Wireless access points deployed across floors",
    siteId: 3,
    type: "Network",
    criticality: "Medium",
    owner: "Network Team",
    vendor: "Aruba"
  }
];

export const getAssetsBySite = (siteId: number): Asset[] => {
  return criticalITAssets.filter(asset => asset.siteId === siteId);
};

export default criticalITAssets;
