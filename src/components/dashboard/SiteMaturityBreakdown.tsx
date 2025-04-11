import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { siteMaturityBreakdowns, lowestScoringSites } from '@/data/dashboardData';
import { criticalITServices, serviceAssets } from '@/data/criticalITServices';
import { ExternalLink, AlertTriangle, AlertCircle, Server, Calendar, Clock, ChevronDown, User } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDistanceToNow, format, parseISO } from 'date-fns';

interface Risk {
  id: number;
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  likelihood: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Mitigated' | 'Closed';
  siteId: number;
  openedDate: string;
  dueDate: string;
  complexity: 'High' | 'Medium' | 'Low';
  type: 'Technical' | 'Operational' | 'Strategic';
  owner: string;
}

interface Issue {
  id: number;
  title: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  siteId: number;
  openedDate: string;
  dueDate: string;
  complexity: 'High' | 'Medium' | 'Low';
  type: 'Technical' | 'Operational' | 'Strategic';
  owner: string;
}

const mockRisks: Risk[] = [
  {
    id: 1,
    title: "Single Point of Failure in Core Network",
    description: "No redundancy in core switches",
    impact: "High",
    likelihood: "Medium",
    status: "Open",
    siteId: 1,
    openedDate: "2024-01-15T00:00:00Z",
    dueDate: "2024-06-30T00:00:00Z",
    complexity: "High",
    type: "Technical",
    owner: "John Smith"
  },
  {
    id: 2,
    title: "Outdated UPS Batteries",
    description: "UPS batteries are past their recommended replacement date",
    impact: "High",
    likelihood: "High",
    status: "Open",
    siteId: 1,
    openedDate: "2024-02-10T00:00:00Z",
    dueDate: "2024-05-20T00:00:00Z",
    complexity: "Medium",
    type: "Operational",
    owner: "Sarah Johnson"
  },
  {
    id: 3,
    title: "Limited Internet Redundancy",
    description: "Only one ISP connection available",
    impact: "Medium",
    likelihood: "Medium",
    status: "Open",
    siteId: 2,
    openedDate: "2023-11-08T00:00:00Z",
    dueDate: "2024-07-15T00:00:00Z",
    complexity: "Medium",
    type: "Strategic",
    owner: "Michael Brown"
  }
];

const mockIssues: Issue[] = [
  {
    id: 1,
    title: "Intermittent Network Outages",
    description: "Users reporting random network disconnections",
    severity: "High",
    status: "In Progress",
    siteId: 1,
    openedDate: "2024-03-05T00:00:00Z",
    dueDate: "2024-05-15T00:00:00Z",
    complexity: "High",
    type: "Technical",
    owner: "Robert Davis"
  },
  {
    id: 2,
    title: "Meeting Room AV Systems Unreliable",
    description: "Video conferencing systems failing during important meetings",
    severity: "Medium",
    status: "Open",
    siteId: 1,
    openedDate: "2024-02-18T00:00:00Z",
    dueDate: "2024-06-01T00:00:00Z",
    complexity: "Low",
    type: "Operational",
    owner: "Lisa Wilson"
  },
  {
    id: 3,
    title: "WiFi Dead Zones on 3rd Floor",
    description: "No wireless coverage in northeast corner",
    severity: "Medium",
    status: "Open",
    siteId: 2,
    openedDate: "2024-01-22T00:00:00Z",
    dueDate: "2024-05-28T00:00:00Z",
    complexity: "Medium",
    type: "Technical",
    owner: "James Taylor"
  }
];

const SiteMaturityBreakdown = () => {
  const [selectedSiteId, setSelectedSiteId] = useState(siteMaturityBreakdowns[0].siteId.toString());
  const [selectedView, setSelectedView] = useState<'general' | 'byService' | 'risks'>('general');
  
  const selectedSite = siteMaturityBreakdowns.find(
    site => site.siteId.toString() === selectedSiteId
  );
  
  if (!selectedSite) {
    return <div>Site not found</div>;
  }

  const siteRisks = mockRisks.filter(risk => risk.siteId === selectedSite.siteId);
  const siteIssues = mockIssues.filter(issue => issue.siteId === selectedSite.siteId);

  const serviceData = selectedSite.services?.map(service => {
    const serviceName = criticalITServices.find(s => s.id === service.serviceId)?.name || 'Unknown Service';
    
    const assets = serviceAssets.filter(asset => 
      asset.serviceId === service.serviceId && 
      asset.siteId === selectedSite.siteId
    );
    
    const sortedAssets = [...assets].sort((a, b) => {
      const criticalityOrder = { "Critical": 0, "High": 1, "Medium": 2, "Low": 3 };
      const aOrder = criticalityOrder[a.criticality as keyof typeof criticalityOrder] || 4;
      const bOrder = criticalityOrder[b.criticality as keyof typeof criticalityOrder] || 4;
      return aOrder - bOrder;
    });
    
    const serviceScores = selectedSite.dimensions.map(dim => ({
      dimension: dim.dimension,
      score: service.dimensionScores?.find(d => d.dimension === dim.dimension)?.score || 0
    }));
    
    return {
      serviceId: service.serviceId,
      serviceName,
      scores: serviceScores,
      overallScore: service.overallScore,
      assets: sortedAssets
    };
  }) || [];

  const radarData = selectedView === 'general' 
    ? selectedSite.dimensions 
    : selectedSite.dimensions.map(dim => {
        const dimData: any = { dimension: dim.dimension };
        
        serviceData.forEach(service => {
          const serviceScore = service.scores.find(s => s.dimension === dim.dimension);
          dimData[service.serviceName] = serviceScore?.score || 0;
        });
        
        return dimData;
      });

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-200 text-red-800 border-red-300';
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-red-100 text-red-800 border-red-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Mitigated': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Resolved': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Closed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="col-span-12">
      <CardHeader>
        <CardTitle>Site Maturity Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Select value={selectedSiteId} onValueChange={setSelectedSiteId}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select a site" />
            </SelectTrigger>
            <SelectContent>
              {siteMaturityBreakdowns.map((site) => (
                <SelectItem key={site.siteId} value={site.siteId.toString()}>
                  {site.siteName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="mb-4">
          <Tabs defaultValue="general" onValueChange={(value) => setSelectedView(value as 'general' | 'byService' | 'risks')}>
            <TabsList>
              <TabsTrigger value="general">General View</TabsTrigger>
              <TabsTrigger value="byService">By Service</TabsTrigger>
              <TabsTrigger value="risks">Risks & Issues</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1">
            <div className="bg-muted p-4 rounded-md mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium">{selectedSite.siteName}</h3>
                <Badge variant="outline">{selectedSite.tier}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedSite.city}, {selectedSite.country}
              </p>
              <div className="mt-2">
                <p className="text-sm font-medium">Overall Maturity Score</p>
                <div className="flex items-center gap-2">
                  <div className="text-3xl font-bold">{selectedSite.overallScore.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground">/ 5.0</div>
                </div>
              </div>
            </div>

            {selectedView === 'general' && (
              <div className="space-y-3">
                {selectedSite.dimensions.map((dim) => (
                  <div key={dim.dimension} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{dim.dimension}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">{dim.score.toFixed(1)}</span>
                      <div 
                        className="h-2 w-16 bg-muted rounded-full overflow-hidden" 
                        title={`${dim.score} out of 5`}
                      >
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${(dim.score / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedView === 'byService' && (
              <div className="space-y-4 mt-4">
                <h4 className="text-md font-medium">Service Scores</h4>
                {serviceData.length > 0 ? (
                  serviceData.map(service => (
                    <div key={service.serviceId} className="rounded-lg border p-3">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">{service.serviceName}</div>
                        <div className="flex items-center gap-1">
                          <span className="text-lg font-bold text-primary">{service.overallScore.toFixed(1)}</span>
                          <span className="text-xs text-muted-foreground">/ 5.0</span>
                        </div>
                      </div>
                      
                      <div className="mb-3 border-b pb-3">
                        <h5 className="text-sm font-medium mb-2">Assets (sorted by criticality)</h5>
                        {service.assets.length > 0 ? (
                          <div className="space-y-2">
                            {service.assets.map(asset => (
                              <div key={asset.id} className="flex flex-col gap-1 p-2 border rounded-md bg-muted/30">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <Server className="h-3 w-3 text-muted-foreground" />
                                    <div className="font-medium">{asset.name}</div>
                                  </div>
                                  <Badge 
                                    variant="outline"
                                    className={`text-xs ${getCriticalityColor(asset.criticality)}`}
                                  >
                                    {asset.criticality}
                                  </Badge>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {asset.type} • {asset.vendor}
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                  <span className="text-xs">Asset Score</span>
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs font-medium">{(service.overallScore * (
                                      asset.criticality === 'High' ? 1.1 : 
                                      asset.criticality === 'Low' ? 0.9 : 
                                      1.0
                                    )).toFixed(1)}</span>
                                    <div className="h-1.5 w-12 bg-muted rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-primary" 
                                        style={{ width: `${(service.overallScore * (
                                          asset.criticality === 'High' ? 1.1 : 
                                          asset.criticality === 'Low' ? 0.9 : 
                                          1.0
                                        ) / 5) * 100}%` }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center text-muted-foreground p-4">
                            No assets configured for this service at this site
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        {service.scores.map(score => (
                          <div key={score.dimension} className="flex items-center justify-between">
                            <span className="text-xs">{score.dimension}</span>
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-medium">{score.score.toFixed(1)}</span>
                              <div 
                                className="h-1.5 w-12 bg-muted rounded-full overflow-hidden" 
                              >
                                <div 
                                  className="h-full bg-primary" 
                                  style={{ width: `${(score.score / 5) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground p-4 border rounded-md">
                    No service data available for this site
                  </div>
                )}
              </div>
            )}

            {selectedView === 'risks' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-md font-medium flex items-center mb-2">
                    <AlertTriangle className="h-4 w-4 mr-1 text-yellow-500" />
                    Active Risks
                  </h4>
                  {siteRisks.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Risk</TableHead>
                          <TableHead>Complexity</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Created Date</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Owner</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {siteRisks.map(risk => (
                          <TableRow key={risk.id}>
                            <TableCell>
                              <div className="font-medium text-sm">{risk.title}</div>
                              <div className="text-xs text-muted-foreground">{risk.description}</div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline"
                                className={getCriticalityColor(risk.complexity)}
                              >
                                {risk.complexity}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">
                                {risk.type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-sm">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                {format(parseISO(risk.openedDate), 'MMM d, yyyy')}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-sm">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                {format(parseISO(risk.dueDate), 'MMM d, yyyy')}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-sm">
                                <User className="h-3 w-3 text-muted-foreground" />
                                {risk.owner}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline"
                                className={getStatusColor(risk.status)}
                              >
                                {risk.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center text-muted-foreground p-4 border rounded-md">
                      No active risks for this site
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-md font-medium flex items-center mb-2">
                    <AlertCircle className="h-4 w-4 mr-1 text-red-500" />
                    Active Issues
                  </h4>
                  {siteIssues.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Issue</TableHead>
                          <TableHead>Complexity</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Created Date</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Owner</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {siteIssues.map(issue => (
                          <TableRow key={issue.id}>
                            <TableCell>
                              <div className="font-medium text-sm">{issue.title}</div>
                              <div className="text-xs text-muted-foreground">{issue.description}</div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline"
                                className={getCriticalityColor(issue.complexity)}
                              >
                                {issue.complexity}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">
                                {issue.type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-sm">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                {format(parseISO(issue.openedDate), 'MMM d, yyyy')}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-sm">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                {format(parseISO(issue.dueDate), 'MMM d, yyyy')}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-sm">
                                <User className="h-3 w-3 text-muted-foreground" />
                                {issue.owner}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline"
                                className={getStatusColor(issue.status)}
                              >
                                {issue.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center text-muted-foreground p-4 border rounded-md">
                      No active issues for this site
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex-1 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={90} data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 5]} />
                
                {selectedView === 'general' ? (
                  <Radar
                    name="Maturity Score"
                    dataKey="score"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                ) : (
                  serviceData.map((service, index) => {
                    const colors = [
                      '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', 
                      '#d53e4f', '#4a6fc9', '#e78ac3', '#66c2a5', '#fc8d62'
                    ];
                    return (
                      <Radar
                        key={service.serviceId}
                        name={service.serviceName}
                        dataKey={service.serviceName}
                        stroke={colors[index % colors.length]}
                        fill={colors[index % colors.length]}
                        fillOpacity={0.3}
                      />
                    );
                  })
                )}
                
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SiteMaturityBreakdown;
