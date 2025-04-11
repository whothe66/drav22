import React, { useState, useCallback, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageTitle } from '@/components/ui/PageTitle';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FilterBar } from '@/components/ui/FilterBar';
import { format } from 'date-fns';

// Sample data for risks
const riskData = [
  {
    id: "R1",
    title: "Network Equipment Failure",
    description: "Risk of critical network equipment failure due to aging infrastructure",
    category: "Infrastructure",
    impact: "High",
    probability: "Medium",
    owner: "Network Team",
    mitigationPlan: "Implement redundant systems and regular maintenance schedule",
    status: "Open",
    createdDate: new Date('2023-10-15'),
    dueDate: new Date('2024-08-30'),
  },
  {
    id: "R2",
    title: "Data Center Power Outage",
    description: "Risk of extended power outage affecting primary data center",
    category: "Facilities",
    impact: "Critical",
    probability: "Low",
    owner: "Facilities Manager",
    mitigationPlan: "Ensure UPS systems are tested monthly and generator has sufficient fuel",
    status: "Mitigated",
    createdDate: new Date('2023-11-05'),
    dueDate: new Date('2024-06-15'),
  },
  {
    id: "R3",
    title: "Cloud Service Provider Downtime",
    description: "Risk of extended downtime from primary cloud service provider",
    category: "Cloud",
    impact: "High",
    probability: "Low",
    owner: "Cloud Architecture Team",
    mitigationPlan: "Implement multi-cloud strategy for critical systems",
    status: "Open",
    createdDate: new Date('2024-01-20'),
    dueDate: new Date('2024-09-30'),
  },
  {
    id: "R4",
    title: "Insufficient Backup Coverage",
    description: "Risk of data loss due to gaps in backup strategy",
    category: "Data Management",
    impact: "High",
    probability: "Medium",
    owner: "Infrastructure Team",
    mitigationPlan: "Review and update backup policies and test recovery procedures",
    status: "Open",
    createdDate: new Date('2024-02-10'),
    dueDate: new Date('2024-07-15'),
  },
  {
    id: "R5",
    title: "Outdated Recovery Documentation",
    description: "Risk of delayed recovery due to outdated or incomplete recovery procedures",
    category: "Process",
    impact: "Medium",
    probability: "High",
    owner: "DR Coordinator",
    mitigationPlan: "Schedule quarterly review and updates of all recovery documentation",
    status: "Mitigated",
    createdDate: new Date('2023-09-30'),
    dueDate: new Date('2024-05-30'),
  }
];

// Sample data for issues
const issueData = [
  {
    id: "I1",
    title: "Backup System Failure",
    description: "Nightly backups for financial systems failing intermittently",
    category: "Data Management",
    impact: "High",
    owner: "Infrastructure Team",
    resolutionPlan: "Upgrade backup software and increase storage capacity",
    status: "In Progress",
    createdDate: new Date('2024-03-10'),
    dueDate: new Date('2024-05-15'),
  },
  {
    id: "I2",
    title: "Recovery Test Failure",
    description: "Quarterly recovery test revealed issues with database restoration",
    category: "Process",
    impact: "Medium",
    owner: "Database Team",
    resolutionPlan: "Revise database recovery procedures and schedule additional test",
    status: "Resolved",
    createdDate: new Date('2024-02-20'),
    dueDate: new Date('2024-04-10'),
  },
  {
    id: "I3",
    title: "Insufficient DR Environment Capacity",
    description: "DR environment storage capacity insufficient for current data volume",
    category: "Infrastructure",
    impact: "High",
    owner: "Infrastructure Manager",
    resolutionPlan: "Provision additional storage for DR environment",
    status: "Open",
    createdDate: new Date('2024-03-05'),
    dueDate: new Date('2024-06-30'),
  },
  {
    id: "I4",
    title: "VPN Connection Problems",
    description: "Intermittent VPN connection issues affecting remote DR testing",
    category: "Network",
    impact: "Low",
    owner: "Network Team",
    resolutionPlan: "Troubleshoot VPN configuration and implement monitoring",
    status: "In Progress",
    createdDate: new Date('2024-03-15'),
    dueDate: new Date('2024-04-30'),
  },
  {
    id: "I5",
    title: "Missing Recovery Point Documentation",
    description: "Recovery point objectives not defined for several new systems",
    category: "Process",
    impact: "Medium",
    owner: "DR Coordinator",
    resolutionPlan: "Work with system owners to document RPO requirements",
    status: "Open",
    createdDate: new Date('2024-03-01'),
    dueDate: new Date('2024-05-31'),
  }
];

// Combine risk and issue data with type information
const combinedData = [
  ...riskData.map(item => ({ ...item, type: 'Risk' })), 
  ...issueData.map(item => ({ ...item, type: 'Issue' }))
];

// Define impact colors
const impactColors = {
  'Low': 'bg-green-100 text-green-800',
  'Medium': 'bg-yellow-100 text-yellow-800',
  'High': 'bg-orange-100 text-orange-800',
  'Critical': 'bg-red-100 text-red-800'
};

// Define status colors
const statusColors = {
  'Open': 'bg-blue-100 text-blue-800',
  'In Progress': 'bg-purple-100 text-purple-800',
  'Mitigated': 'bg-green-100 text-green-800',
  'Resolved': 'bg-green-100 text-green-800',
  'Closed': 'bg-gray-100 text-gray-800'
};

// Type definition for risk items
interface RiskItem {
  id: string;
  title: string;
  description: string;
  category: string;
  impact: string;
  probability: string;
  owner: string;
  mitigationPlan: string;
  status: string;
  createdDate: Date;
  dueDate: Date;
  type: 'Risk';
}

// Type definition for issue items
interface IssueItem {
  id: string;
  title: string;
  description: string;
  category: string;
  impact: string;
  owner: string;
  resolutionPlan: string;
  status: string;
  createdDate: Date;
  dueDate: Date;
  type: 'Issue';
}

// Combined type for both risks and issues
type RegisterItem = RiskItem | IssueItem;

const RiskIssueRegister = () => {
  const [activeTab, setActiveTab] = useState('combined');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState<RegisterItem[]>(combinedData as RegisterItem[]);

  // Get unique categories
  const categories = Array.from(new Set(combinedData.map(item => item.category)));
  
  // Get unique statuses
  const statuses = Array.from(new Set(combinedData.map(item => item.status)));

  // Filter data based on search term, category, and status
  const filterData = useCallback(() => {
    let filtered = combinedData as RegisterItem[];

    // Filter by tab
    if (activeTab === 'risks') {
      filtered = filtered.filter(item => item.type === 'Risk');
    } else if (activeTab === 'issues') {
      filtered = filtered.filter(item => item.type === 'Issue');
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(term) || 
        item.description.toLowerCase().includes(term) ||
        item.id.toLowerCase().includes(term)
      );
    }

    // Filter by category
    if (categoryFilter) {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    setFilteredData(filtered);
  }, [activeTab, searchTerm, categoryFilter, statusFilter]);

  // Update filtered data when filters change
  useEffect(() => {
    filterData();
  }, [filterData]);

  return (
    <MainLayout>
      <PageTitle 
        title="Risk & Issue Register" 
        description="Track and manage disaster recovery risks and issues." 
      />

      <Card className="mb-6">
        <CardContent className="p-6">
          <Tabs defaultValue="combined" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="combined">All Items</TabsTrigger>
                <TabsTrigger value="risks">Risks</TabsTrigger>
                <TabsTrigger value="issues">Issues</TabsTrigger>
              </TabsList>
            </div>

            <FilterBar
              searchPlaceholder="Search by title or ID..."
              onSearchChange={setSearchTerm}
              filters={[
                {
                  name: "Category",
                  options: ["All", ...categories],
                  value: categoryFilter || "All",
                  onChange: (value) => setCategoryFilter(value === "All" ? null : value)
                },
                {
                  name: "Status",
                  options: ["All", ...statuses],
                  value: statusFilter || "All",
                  onChange: (value) => setStatusFilter(value === "All" ? null : value)
                }
              ]}
            />

            <TabsContent value="combined" className="m-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead className="w-[80px]">Type</TableHead>
                    <TableHead className="w-[250px]">Title</TableHead>
                    <TableHead className="w-[120px]">Category</TableHead>
                    <TableHead className="w-[100px]">Impact</TableHead>
                    <TableHead className="w-[120px]">Owner</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="w-[120px]">Created Date</TableHead>
                    <TableHead className="w-[120px]">Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                      <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="font-medium">{item.id}</TableCell>
                        <TableCell>
                          <Badge variant={item.type === 'Risk' ? 'default' : 'secondary'}>
                            {item.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{item.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">{item.description.substring(0, 60)}...</div>
                        </TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${impactColors[item.impact as keyof typeof impactColors] || 'bg-gray-100 text-gray-800'}`}>
                            {item.impact}
                          </span>
                        </TableCell>
                        <TableCell>{item.owner}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[item.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
                            {item.status}
                          </span>
                        </TableCell>
                        <TableCell>{format(item.createdDate, 'MMM d, yyyy')}</TableCell>
                        <TableCell>{format(item.dueDate, 'MMM d, yyyy')}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-4">
                        No items found matching your filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="risks" className="m-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead className="w-[250px]">Title</TableHead>
                    <TableHead className="w-[120px]">Category</TableHead>
                    <TableHead className="w-[100px]">Impact</TableHead>
                    <TableHead className="w-[100px]">Probability</TableHead>
                    <TableHead className="w-[120px]">Owner</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="w-[120px]">Created Date</TableHead>
                    <TableHead className="w-[120px]">Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.filter(item => item.type === 'Risk').length > 0 ? (
                    filteredData.filter(item => item.type === 'Risk').map((risk) => (
                      <TableRow key={risk.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="font-medium">{risk.id}</TableCell>
                        <TableCell>
                          <div className="font-medium">{risk.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">{risk.description.substring(0, 60)}...</div>
                        </TableCell>
                        <TableCell>{risk.category}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${impactColors[risk.impact as keyof typeof impactColors] || 'bg-gray-100 text-gray-800'}`}>
                            {risk.impact}
                          </span>
                        </TableCell>
                        <TableCell>{(risk as RiskItem).probability}</TableCell>
                        <TableCell>{risk.owner}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[risk.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
                            {risk.status}
                          </span>
                        </TableCell>
                        <TableCell>{format(risk.createdDate, 'MMM d, yyyy')}</TableCell>
                        <TableCell>{format(risk.dueDate, 'MMM d, yyyy')}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-4">
                        No risks found matching your filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="issues" className="m-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead className="w-[250px]">Title</TableHead>
                    <TableHead className="w-[120px]">Category</TableHead>
                    <TableHead className="w-[100px]">Impact</TableHead>
                    <TableHead className="w-[120px]">Owner</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="w-[120px]">Created Date</TableHead>
                    <TableHead className="w-[120px]">Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.filter(item => item.type === 'Issue').length > 0 ? (
                    filteredData.filter(item => item.type === 'Issue').map((issue) => (
                      <TableRow key={issue.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="font-medium">{issue.id}</TableCell>
                        <TableCell>
                          <div className="font-medium">{issue.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">{issue.description.substring(0, 60)}...</div>
                        </TableCell>
                        <TableCell>{issue.category}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${impactColors[issue.impact as keyof typeof impactColors] || 'bg-gray-100 text-gray-800'}`}>
                            {issue.impact}
                          </span>
                        </TableCell>
                        <TableCell>{issue.owner}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[issue.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
                            {issue.status}
                          </span>
                        </TableCell>
                        <TableCell>{format(issue.createdDate, 'MMM d, yyyy')}</TableCell>
                        <TableCell>{format(issue.dueDate, 'MMM d, yyyy')}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        No issues found matching your filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default RiskIssueRegister;
