
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { lowestScoringSites } from '@/data/dashboardData';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type Dimension = {
  dimension: string;
  score: number;
};

const sitesWithDimensions = lowestScoringSites.map(site => ({
  ...site,
  dimensions: [
    { dimension: "Internal Support", score: site.score * (Math.random() * 0.4 + 0.8) },
    { dimension: "External Support", score: site.score * (Math.random() * 0.4 + 0.8) },
    { dimension: "Support Metrics", score: site.score * (Math.random() * 0.4 + 0.8) },
    { dimension: "Redundancy", score: site.score * (Math.random() * 0.4 + 0.8) },
    { dimension: "Inventory Management", score: site.score * (Math.random() * 0.4 + 0.8) },
    { dimension: "Alerting", score: site.score * (Math.random() * 0.4 + 0.8) },
    { dimension: "Monitoring", score: site.score * (Math.random() * 0.4 + 0.8) },
    { dimension: "Maintenance", score: site.score * (Math.random() * 0.4 + 0.8) },
    { dimension: "Testing", score: site.score * (Math.random() * 0.4 + 0.8) }
  ]
}));

const generateSiteServices = (siteId: number) => {
  return [
    {
      id: 1,
      name: "Email",
      score: 2.5 + Math.random(),
      assets: [
        { id: 1, name: "Exchange Server", type: "Server", criticality: "High" },
        { id: 2, name: "Email Gateway", type: "Security", criticality: "Medium" }
      ]
    },
    {
      id: 2,
      name: "File Storage",
      score: 2.2 + Math.random(),
      assets: [
        { id: 3, name: "File Server", type: "Server", criticality: "Medium" },
        { id: 4, name: "Backup System", type: "Storage", criticality: "High" }
      ]
    },
    {
      id: 3,
      name: "Directory Services",
      score: 2.7 + Math.random(),
      assets: [
        { id: 5, name: "Domain Controller", type: "Server", criticality: "Critical" },
        { id: 6, name: "LDAP Server", type: "Server", criticality: "High" }
      ]
    }
  ];
};

// Helper to generate dimension scores for assets
const generateAssetDimensionScores = (assetId: number, baseSiteScore: number) => {
  return [
    { dimension: "Internal Support", score: baseSiteScore * (0.8 + Math.random() * 0.4) },
    { dimension: "External Support", score: baseSiteScore * (0.8 + Math.random() * 0.4) },
    { dimension: "Support Metrics", score: baseSiteScore * (0.8 + Math.random() * 0.4) },
    { dimension: "Redundancy", score: baseSiteScore * (0.8 + Math.random() * 0.4) },
    { dimension: "Inventory Management", score: baseSiteScore * (0.8 + Math.random() * 0.4) },
    { dimension: "Alerting", score: baseSiteScore * (0.8 + Math.random() * 0.4) },
    { dimension: "Monitoring", score: baseSiteScore * (0.8 + Math.random() * 0.4) },
    { dimension: "Maintenance", score: baseSiteScore * (0.8 + Math.random() * 0.4) },
    { dimension: "Testing", score: baseSiteScore * (0.8 + Math.random() * 0.4) }
  ];
};

const LowestScoringSites = () => {
  const navigate = useNavigate();
  const [sites, setSites] = useState(sitesWithDimensions);
  const [sortField, setSortField] = useState<keyof typeof sites[0] | 'location'>('score');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedSite, setSelectedSite] = useState<(typeof sites[0]) | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSort = (field: keyof typeof sites[0] | 'location') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedSites = [...sites].sort((a, b) => {
    let aValue, bValue;
    
    if (sortField === 'location') {
      aValue = `${a.city}, ${a.country}`;
      bValue = `${b.city}, ${b.country}`;
    } else {
      aValue = a[sortField];
      bValue = b[sortField];
    }
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    return sortDirection === 'asc' 
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });

  const getDimensionChartData = (dimensions: Dimension[]) => {
    return dimensions.map(dim => ({
      name: dim.dimension,
      score: parseFloat(dim.score.toFixed(1))
    }));
  };

  const openSiteDetails = (site: typeof sites[0]) => {
    setSelectedSite(site);
    setDialogOpen(true);
  };

  const renderSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-1 h-4 w-4 inline" />;
    }
    return sortDirection === 'asc' 
      ? <ChevronUp className="ml-1 h-4 w-4 inline" /> 
      : <ChevronDown className="ml-1 h-4 w-4 inline" />;
  };

  const viewFullAssessment = (siteId: number) => {
    setDialogOpen(false);
    navigate(`/maturity-assessment?id=${siteId}`);
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score < 2.0) return "destructive";
    if (score < 3.0) return "outline";
    return "secondary";
  };

  return (
    <Card className="col-span-12 xl:col-span-6">
      <CardHeader>
        <CardTitle>Lowest Scoring Sites</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  Site {renderSortIcon('name')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('location')}
                >
                  Location {renderSortIcon('location')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('tier')}
                >
                  Tier {renderSortIcon('tier')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('score')}
                >
                  Score {renderSortIcon('score')}
                </TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedSites.map((site) => (
                <TableRow key={site.id}>
                  <TableCell className="font-medium">{site.name}</TableCell>
                  <TableCell>{`${site.city}, ${site.country}`}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {site.tier}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={site.score < 2.5 ? "destructive" : "outline"} className="text-xs">
                      {site.score.toFixed(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => openSiteDetails(site)}>
                      <Eye className="h-4 w-4 mr-1" /> Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {selectedSite && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedSite.name} - Detailed Assessment</DialogTitle>
              <DialogDescription>
                {selectedSite.city}, {selectedSite.country} - Tier {selectedSite.tier}
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="dimensions">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="dimensions">DR Dimensions</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="assets">Assets</TabsTrigger>
                <TabsTrigger value="parameters">DR Parameters</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dimensions" className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Dimension Scores</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Dimension</TableHead>
                          <TableHead>Score</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedSite.dimensions.map((dim) => (
                          <TableRow key={dim.dimension}>
                            <TableCell>{dim.dimension}</TableCell>
                            <TableCell>
                              <Badge variant={
                                dim.score < 2.0 ? "destructive" : 
                                dim.score < 3.0 ? "outline" : 
                                "secondary"
                              }>
                                {dim.score.toFixed(1)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="h-80">
                    <h3 className="text-lg font-medium mb-4">Dimension Chart</h3>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={getDimensionChartData(selectedSite.dimensions)}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 5]} />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip formatter={(value) => [`${value}`, 'Score']} />
                        <Bar dataKey="score" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="services" className="p-4 max-h-[70vh] overflow-y-auto">
                <div className="space-y-6">
                  {generateSiteServices(selectedSite.id).map(service => (
                    <div key={service.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">{service.name}</h3>
                        <Badge variant={
                          service.score < 2.0 ? "destructive" : 
                          service.score < 3.0 ? "outline" : 
                          "secondary"
                        }>
                          Score: {service.score.toFixed(1)}
                        </Badge>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Related Assets</h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Asset</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Criticality</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {service.assets.map(asset => (
                              <TableRow key={asset.id}>
                                <TableCell>{asset.name}</TableCell>
                                <TableCell>{asset.type}</TableCell>
                                <TableCell>
                                  <Badge variant={
                                    asset.criticality === "Critical" ? "destructive" :
                                    asset.criticality === "High" ? "outline" :
                                    "secondary"
                                  }>
                                    {asset.criticality}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="assets" className="p-4 max-h-[70vh] overflow-y-auto">
                <div className="space-y-6">
                  {generateSiteServices(selectedSite.id).flatMap(service => 
                    service.assets.map(asset => (
                      <div key={`${service.id}-${asset.id}`} className="border rounded-md p-4">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <h3 className="text-lg font-medium">{asset.name}</h3>
                            <p className="text-sm text-muted-foreground">{asset.type} • {service.name}</p>
                          </div>
                          <Badge variant={
                            asset.criticality === "Critical" ? "destructive" :
                            asset.criticality === "High" ? "outline" :
                            "secondary"
                          }>
                            {asset.criticality}
                          </Badge>
                        </div>
                        
                        <h4 className="text-sm font-medium mb-2">DR Dimension Scores</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Dimension</TableHead>
                                <TableHead>Score</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {generateAssetDimensionScores(asset.id, selectedSite.score).map((dimScore) => (
                                <TableRow key={`${asset.id}-${dimScore.dimension}`}>
                                  <TableCell>{dimScore.dimension}</TableCell>
                                  <TableCell>
                                    <Badge variant={getScoreBadgeVariant(dimScore.score)}>
                                      {dimScore.score.toFixed(1)}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={generateAssetDimensionScores(asset.id, selectedSite.score).map(dim => ({
                                  name: dim.dimension,
                                  score: parseFloat(dim.score.toFixed(1))
                                }))}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" domain={[0, 5]} />
                                <YAxis dataKey="name" type="category" width={60} tick={{ fontSize: 10 }} />
                                <Tooltip formatter={(value) => [`${value}`, 'Score']} />
                                <Bar dataKey="score" fill="#8884d8" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="parameters" className="p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parameter</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Recovery Time Objective (RTO)</TableCell>
                      <TableCell>4 hours</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Meeting Target
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Recovery Point Objective (RPO)</TableCell>
                      <TableCell>15 minutes</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Meeting Target
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Maximum Tolerable Downtime (MTD)</TableCell>
                      <TableCell>8 hours</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                          At Risk
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Work Recovery Time (WRT)</TableCell>
                      <TableCell>2 hours</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-red-100 text-red-800">
                          Exceeding Target
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Maximum Tolerable Period of Disruption (MTPD)</TableCell>
                      <TableCell>24 hours</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Meeting Target
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button onClick={() => viewFullAssessment(selectedSite.id)}>
                View Full Assessment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default LowestScoringSites;
