
// Define the types for the DR parameters
export interface Parameter {
  id: number;
  name: string;
  description: string;
  type: 'text' | 'dropdown' | 'percentage' | 'number' | 'hyperlink' | 'counter';
  options?: string[];
  scorable: boolean;
  weightage?: number;
  unit?: string;
}

export interface Dimension {
  id: number;
  name: string;
  description: string;
  scorable: boolean;
  parameters: Parameter[];
}

// Create the DR parameters data
export const drDimensions: Dimension[] = [
  {
    id: 1,
    name: "Internal Support",
    description: "Internal support structure and processes for disaster recovery",
    scorable: true,
    parameters: [
      { 
        id: 1, 
        name: "Primary support POC", 
        description: "Primary point of contact for support", 
        type: "text", 
        scorable: true, 
        weightage: 25 
      },
      { 
        id: 2, 
        name: "Secondary support - backup POC", 
        description: "Backup point of contact for support", 
        type: "text", 
        scorable: true, 
        weightage: 25 
      },
      { 
        id: 3, 
        name: "Escalation POC", 
        description: "Point of contact for escalations", 
        type: "text", 
        scorable: true, 
        weightage: 20 
      },
      { 
        id: 4, 
        name: "Shared Services Support during business hours", 
        description: "Level of support available during business hours", 
        type: "dropdown", 
        options: ["Remote L1 support", "Remote L2 support", "Not Available"], 
        scorable: true, 
        weightage: 10 
      },
      { 
        id: 5, 
        name: "Out of hours support", 
        description: "Level of support available outside business hours", 
        type: "dropdown", 
        options: ["Onsite L1 Support", "Onsite L2 Support", "Remote L1 support", "Remote L2 support", "Not Available"], 
        scorable: true, 
        weightage: 7.5 
      },
      { 
        id: 6, 
        name: "OOB (Out of Band) Management available", 
        description: "Availability of out of band management", 
        type: "dropdown", 
        options: ["Yes", "No", "Not Applicable"], 
        scorable: true, 
        weightage: 10 
      },
      { 
        id: 7, 
        name: "OOO roster for key personnel available", 
        description: "Availability of out of office roster for key personnel", 
        type: "dropdown", 
        options: ["Yes", "No", "Not Applicable"], 
        scorable: true, 
        weightage: 7.5 
      }
    ]
  },
  {
    id: 2,
    name: "External Support",
    description: "External support arrangements and vendors for disaster recovery",
    scorable: true,
    parameters: [
      { 
        id: 8, 
        name: "3rd party Managed Services support in place", 
        description: "Whether third-party managed services support is in place", 
        type: "dropdown", 
        options: ["Yes", "No", "Not Applicable"], 
        scorable: true, 
        weightage: 40 
      },
      { 
        id: 9, 
        name: "Support duration", 
        description: "Duration of the support agreement in years", 
        type: "counter", 
        scorable: false
      },
      { 
        id: 10, 
        name: "3rd Party Managed Services support vendor", 
        description: "Name of the third-party managed services vendor", 
        type: "text", 
        scorable: false 
      },
      { 
        id: 11, 
        name: "3rd Party Managed Service support primary contact", 
        description: "Primary contact for third-party managed services", 
        type: "text", 
        scorable: false
      },
      { 
        id: 12, 
        name: "3rd Party support secondary contact", 
        description: "Secondary contact for third-party support", 
        type: "text", 
        scorable: false
      },
      { 
        id: 13, 
        name: "3rd party Out of hours support available", 
        description: "Availability of third-party support outside business hours", 
        type: "dropdown", 
        options: ["Yes", "No", "Not Applicable"], 
        scorable: true, 
        weightage: 20 
      },
      { 
        id: 14, 
        name: "Is EOL Warranty tracked (per CI)?", 
        description: "Whether end-of-life warranty is tracked per configuration item", 
        type: "dropdown", 
        options: ["Yes", "No", "Not Applicable"], 
        scorable: true, 
        weightage: 40 
      }
    ]
  },
  {
    id: 3,
    name: "Support Metrics",
    description: "Metrics and SLAs for disaster recovery support",
    scorable: true,
    parameters: [
      { 
        id: 15, 
        name: "Asset Uptime", 
        description: "Percentage of time the asset is operational", 
        type: "percentage", 
        scorable: true, 
        weightage: 15, 
        unit: "%" 
      },
      { 
        id: 16, 
        name: "RTO Recovery Time Objective", 
        description: "Target time for the recovery of the asset", 
        type: "number", 
        scorable: true, 
        weightage: 15, 
        unit: "minutes" 
      },
      { 
        id: 17, 
        name: "RPO Recovery Point Objective", 
        description: "Maximum targeted period in which data might be lost", 
        type: "number", 
        scorable: true, 
        weightage: 15, 
        unit: "minutes" 
      },
      { 
        id: 18, 
        name: "Response SLA - P0", 
        description: "Service level agreement for P0 incidents", 
        type: "percentage", 
        scorable: true, 
        weightage: 15, 
        unit: "%" 
      },
      { 
        id: 19, 
        name: "Response SLA - P1", 
        description: "Service level agreement for P1 incidents", 
        type: "percentage", 
        scorable: true, 
        weightage: 15, 
        unit: "%" 
      },
      { 
        id: 20, 
        name: "Resolution SLA - P0", 
        description: "Service level agreement for resolving P0 incidents", 
        type: "percentage", 
        scorable: true, 
        weightage: 5, 
        unit: "%" 
      },
      { 
        id: 21, 
        name: "Resolution SLA - P1", 
        description: "Service level agreement for resolving P1 incidents", 
        type: "percentage", 
        scorable: true, 
        weightage: 5, 
        unit: "%" 
      },
      { 
        id: 22, 
        name: "RMA - Return Material authorisation available", 
        description: "Availability of return material authorization", 
        type: "dropdown", 
        options: ["Yes", "No", "Not Applicable"], 
        scorable: true, 
        weightage: 15 
      }
    ]
  },
  {
    id: 4,
    name: "Redundancy",
    description: "Redundancy arrangements for disaster recovery",
    scorable: true,
    parameters: [
      { 
        id: 23, 
        name: "Primary device", 
        description: "Status of the primary device", 
        type: "dropdown", 
        options: ["Active", "Hot Standby", "Cold Standby", "No", "Not Applicable"], 
        scorable: false
      },
      { 
        id: 24, 
        name: "Secondary backup", 
        description: "Status of the secondary backup", 
        type: "dropdown", 
        options: ["Active", "Hot Standby", "Cold Standby", "No", "Not Applicable"], 
        scorable: true, 
        weightage: 100 
      }
    ]
  },
  {
    id: 5,
    name: "Inventory Management",
    description: "Inventory management for disaster recovery",
    scorable: true,
    parameters: [
      { 
        id: 25, 
        name: "Spares maintained onsite", 
        description: "Whether spares are maintained onsite", 
        type: "dropdown", 
        options: ["Yes", "No", "Not Applicable"], 
        scorable: true, 
        weightage: 50 
      },
      { 
        id: 26, 
        name: "Spares Management Policy", 
        description: "Link to the spares management policy", 
        type: "hyperlink", 
        scorable: true, 
        weightage: 50 
      }
    ]
  },
  {
    id: 6,
    name: "Alerting",
    description: "Alerting systems and processes for disaster recovery",
    scorable: true,
    parameters: [
      { 
        id: 27, 
        name: "Alerting available for all CIs", 
        description: "Availability of alerting for all configuration items", 
        type: "dropdown", 
        options: ["Yes", "Available for some CIs", "No", "Not Applicable"], 
        scorable: true, 
        weightage: 100
      },
      { 
        id: 28, 
        name: "Alerting tool", 
        description: "Tool used for alerting", 
        type: "text", 
        scorable: false
      }
    ]
  },
  {
    id: 7,
    name: "Monitoring",
    description: "Monitoring systems and processes for disaster recovery",
    scorable: true,
    parameters: [
      { 
        id: 29, 
        name: "Realtime monitoring available for all CIs", 
        description: "Availability of real-time monitoring for all configuration items", 
        type: "dropdown", 
        options: ["Yes", "Available for some CIs", "No", "Not Applicable"], 
        scorable: true, 
        weightage: 50
      },
      { 
        id: 30, 
        name: "Realtime monitoring tool", 
        description: "Tool used for real-time monitoring", 
        type: "text", 
        scorable: false
      },
      { 
        id: 31, 
        name: "Trend Analysis", 
        description: "Availability of trend analysis", 
        type: "dropdown", 
        options: ["Yes", "Available for some CIs", "No", "Not Applicable"], 
        scorable: true, 
        weightage: 50
      },
      { 
        id: 32, 
        name: "Trend Analysis tool", 
        description: "Tool used for trend analysis", 
        type: "text", 
        scorable: false
      }
    ]
  },
  {
    id: 8,
    name: "Maintenance",
    description: "Maintenance procedures and documentation for disaster recovery",
    scorable: true,
    parameters: [
      { 
        id: 33, 
        name: "Asset covered in Network Architecture Map?", 
        description: "Whether the asset is covered in the network architecture map", 
        type: "dropdown", 
        options: ["Yes all CIs covered", "Some CIs covered", "No", "Not Applicable"], 
        scorable: true, 
        weightage: 30
      },
      { 
        id: 34, 
        name: "Network Architecture Map Link", 
        description: "Link to the network architecture map", 
        type: "hyperlink", 
        scorable: false
      },
      { 
        id: 35, 
        name: "Maintenance SOPs available?", 
        description: "Availability of standard operating procedures for maintenance", 
        type: "dropdown", 
        options: ["Yes", "No", "Not Applicable"], 
        scorable: true, 
        weightage: 15
      },
      { 
        id: 36, 
        name: "Maintenance SOP Link", 
        description: "Link to the maintenance standard operating procedures", 
        type: "hyperlink", 
        scorable: false
      },
      { 
        id: 37, 
        name: "Hardware Maintenance Schedule", 
        description: "Link to the hardware maintenance schedule", 
        type: "hyperlink", 
        scorable: true, 
        weightage: 15
      },
      { 
        id: 38, 
        name: "Patching SOP available?", 
        description: "Availability of standard operating procedures for patching", 
        type: "dropdown", 
        options: ["Yes", "No", "Not Applicable"], 
        scorable: true, 
        weightage: 20
      },
      { 
        id: 39, 
        name: "Patching SOP link", 
        description: "Link to the patching standard operating procedures", 
        type: "hyperlink", 
        scorable: false
      },
      { 
        id: 40, 
        name: "Patching Schedule", 
        description: "Link to the patching schedule", 
        type: "hyperlink", 
        scorable: true, 
        weightage: 20
      }
    ]
  },
  {
    id: 9,
    name: "Testing",
    description: "Testing procedures and documentation for disaster recovery",
    scorable: true,
    parameters: [
      { 
        id: 41, 
        name: "Failover testing schedule available?", 
        description: "Availability of a failover testing schedule", 
        type: "dropdown", 
        options: ["Yes", "No", "Not Applicable"], 
        scorable: true, 
        weightage: 50
      },
      { 
        id: 42, 
        name: "Failover testing schedule", 
        description: "Link to the failover testing schedule", 
        type: "hyperlink", 
        scorable: false
      },
      { 
        id: 43, 
        name: "Failover SOP available, including scenario modeling?", 
        description: "Availability of standard operating procedures for failover, including scenario modeling", 
        type: "dropdown", 
        options: ["Yes", "No", "Not Applicable"], 
        scorable: true, 
        weightage: 50
      },
      { 
        id: 44, 
        name: "Failover SOP link", 
        description: "Link to the failover standard operating procedures", 
        type: "hyperlink", 
        scorable: false
      }
    ]
  }
];
