
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Eye, FileText, Star, ChevronDown, ChevronRight, FileSpreadsheet, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import * as XLSX from 'xlsx';

export interface PastAssessment {
  id: string;
  site: string;
  date: Date;
  score: string;
  assessedBy: string;
  assessedOn: string;
  status: 'completed' | 'in-progress';
  dimensions?: {
    name: string;
    score: number;
    assets?: {
      id: number;
      name: string;
      type: string;
      score: number;
      parameters?: {
        id: number;
        name: string;
        score: number;
        value?: string;
        notes?: string;
        lastUpdated?: string;
      }[];
    }[];
  }[];
}

interface PastAssessmentsListProps {
  assessments: PastAssessment[];
  onViewDetails: (assessmentId: string) => void;
  onContinueAssessment: (assessmentId: string) => void;
}

const PastAssessmentsList: React.FC<PastAssessmentsListProps> = ({
  assessments,
  onViewDetails,
  onContinueAssessment,
}) => {
  const { toast } = useToast();
  const [selectedAssessment, setSelectedAssessment] = useState<PastAssessment | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expandedDimensions, setExpandedDimensions] = useState<Record<string, boolean>>({});
  const [expandedAssets, setExpandedAssets] = useState<Record<string, boolean>>({});
  const [expandedParameters, setExpandedParameters] = useState<Record<string, boolean>>({});

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'bg-green-100 text-green-800';
    if (score >= 3.5) return 'bg-blue-100 text-blue-800';
    if (score >= 2.5) return 'bg-yellow-100 text-yellow-800';
    if (score >= 1.5) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const handleViewDetailedAssessment = (assessment: PastAssessment) => {
    setSelectedAssessment(assessment);
    setDialogOpen(true);
  };

  const toggleDimension = (dimensionName: string) => {
    setExpandedDimensions(prev => ({
      ...prev,
      [dimensionName]: !prev[dimensionName]
    }));
  };

  const toggleAsset = (assetId: string) => {
    setExpandedAssets(prev => ({
      ...prev,
      [assetId]: !prev[assetId]
    }));
  };

  const toggleParameter = (paramId: string) => {
    setExpandedParameters(prev => ({
      ...prev,
      [paramId]: !prev[paramId]
    }));
  };

  const exportToExcel = (assessment: PastAssessment) => {
    if (!assessment.dimensions) {
      toast({
        title: "Cannot export",
        description: "No detailed data available for export",
        variant: "destructive"
      });
      return;
    }

    const excelData: any[] = [];
    
    // Add assessment metadata
    excelData.push({
      AssessmentId: assessment.id,
      Site: assessment.site,
      Date: format(assessment.date, 'yyyy-MM-dd'),
      Score: assessment.score,
      AssessedBy: assessment.assessedBy,
      AssessedOn: assessment.assessedOn,
      Status: assessment.status
    });
    
    // Add a separator
    excelData.push({});
    
    // Add detailed data
    assessment.dimensions.forEach(dimension => {
      if (dimension.assets) {
        dimension.assets.forEach(asset => {
          if (asset.parameters) {
            asset.parameters.forEach(param => {
              excelData.push({
                Dimension: dimension.name,
                DimensionScore: dimension.score,
                AssetName: asset.name,
                AssetType: asset.type,
                AssetScore: asset.score,
                ParameterName: param.name,
                ParameterScore: param.score,
                ParameterValue: param.value || 'N/A',
                Notes: param.notes || 'N/A',
                LastUpdated: param.lastUpdated ? format(new Date(param.lastUpdated), 'yyyy-MM-dd HH:mm:ss') : 'N/A'
              });
            });
          }
        });
      }
    });
    
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Assessment Data');
    
    const fileName = `assessment-${assessment.site.replace(/\s+/g, '-').toLowerCase()}-${format(assessment.date, 'yyyy-MM-dd')}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    toast({
      title: "Assessment exported",
      description: "The assessment data has been exported as an Excel file"
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Past Maturity Assessments</CardTitle>
      </CardHeader>
      <CardContent>
        {assessments.length === 0 ? (
          <div className="text-center p-6 text-muted-foreground">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground/30 mb-3" />
            <h3 className="text-lg font-medium">No completed assessments</h3>
            <p className="mt-1 mb-4">Complete an assessment to see it listed here.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Site</TableHead>
                <TableHead>Assessment Period</TableHead>
                <TableHead>Maturity Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assessed By</TableHead>
                <TableHead>Assessed On</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assessments.map((assessment) => (
                <TableRow key={assessment.id}>
                  <TableCell className="font-medium">{assessment.site}</TableCell>
                  <TableCell>{format(assessment.date, 'MMMM yyyy')}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge className={getScoreColor(parseFloat(assessment.score))}>
                        <div className="flex items-center gap-1">
                          <span>{assessment.score}</span>
                          <Star className="h-3 w-3 fill-current" />
                        </div>
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={assessment.status === 'completed' ? 'default' : 'outline'}>
                      {assessment.status === 'completed' ? 'Completed' : 'In Progress'}
                    </Badge>
                  </TableCell>
                  <TableCell>{assessment.assessedBy}</TableCell>
                  <TableCell>{assessment.assessedOn}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      {assessment.status === 'completed' ? (
                        <>
                          <Button variant="outline" size="sm" onClick={() => handleViewDetailedAssessment(assessment)}>
                            <Eye className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                          <Button variant="default" size="sm" onClick={() => onViewDetails(assessment.id)}>
                            View Full
                          </Button>
                        </>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => onContinueAssessment(assessment.id)}>
                          Continue
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {selectedAssessment && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedAssessment.site} - Comprehensive Assessment Data</DialogTitle>
              <DialogDescription>
                Assessment Period: {format(selectedAssessment.date, 'MMMM yyyy')} | 
                Overall Score: {selectedAssessment.score}/5.0
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="dimensions">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="dimensions">Dimensions & Assets</TabsTrigger>
                <TabsTrigger value="summary">Assessment Summary</TabsTrigger>
                <TabsTrigger value="comprehensive">Comprehensive Data</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dimensions" className="space-y-4">
                {selectedAssessment.dimensions && selectedAssessment.dimensions.length > 0 ? (
                  selectedAssessment.dimensions.map((dimension, idx) => (
                    <Collapsible 
                      key={`dim-${idx}`}
                      open={expandedDimensions[dimension.name]}
                      onOpenChange={() => toggleDimension(dimension.name)}
                      className="border rounded-md overflow-hidden"
                    >
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50">
                        <div className="flex items-center gap-3">
                          <Badge className={getScoreColor(dimension.score)}>
                            {dimension.score.toFixed(1)}
                          </Badge>
                          <h3 className="text-lg font-medium">{dimension.name}</h3>
                        </div>
                        {expandedDimensions[dimension.name] ? (
                          <ChevronDown className="h-5 w-5" />
                        ) : (
                          <ChevronRight className="h-5 w-5" />
                        )}
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent>
                        <div className="p-4 pt-0 space-y-4">
                          {dimension.assets && dimension.assets.length > 0 ? (
                            dimension.assets.map((asset, assetIdx) => (
                              <Collapsible
                                key={`asset-${asset.id}`}
                                open={expandedAssets[`${dimension.name}-${asset.id}`]}
                                onOpenChange={() => toggleAsset(`${dimension.name}-${asset.id}`)}
                                className="border rounded-md overflow-hidden bg-accent/20"
                              >
                                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-accent/30">
                                  <div className="flex items-center gap-3">
                                    <Badge className={getScoreColor(asset.score)}>
                                      {asset.score.toFixed(1)}
                                    </Badge>
                                    <div>
                                      <h4 className="font-medium">{asset.name}</h4>
                                      <p className="text-sm text-muted-foreground">{asset.type}</p>
                                    </div>
                                  </div>
                                  {expandedAssets[`${dimension.name}-${asset.id}`] ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </CollapsibleTrigger>
                                
                                <CollapsibleContent>
                                  <div className="p-3 pt-0">
                                    {asset.parameters && asset.parameters.length > 0 ? (
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Parameter</TableHead>
                                            <TableHead>Score</TableHead>
                                            <TableHead>Value</TableHead>
                                            <TableHead>Notes</TableHead>
                                            <TableHead>Last Updated</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {asset.parameters.map((param) => (
                                            <TableRow key={`param-${param.id}`}>
                                              <TableCell>{param.name}</TableCell>
                                              <TableCell>
                                                <Badge className={getScoreColor(param.score)}>
                                                  {param.score.toFixed(1)}
                                                </Badge>
                                              </TableCell>
                                              <TableCell>
                                                {param.value || 'Not specified'}
                                              </TableCell>
                                              <TableCell className="max-w-md break-words">
                                                {param.notes || 'No notes provided'}
                                              </TableCell>
                                              <TableCell>
                                                {param.lastUpdated ? 
                                                  format(new Date(param.lastUpdated), 'yyyy-MM-dd HH:mm') : 
                                                  'N/A'}
                                              </TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    ) : (
                                      <p className="text-center text-muted-foreground py-3">
                                        No parameter data available
                                      </p>
                                    )}
                                  </div>
                                </CollapsibleContent>
                              </Collapsible>
                            ))
                          ) : (
                            <p className="text-center text-muted-foreground py-3">
                              No asset data available for this dimension
                            </p>
                          )}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))
                ) : (
                  <div className="text-center p-6 text-muted-foreground">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground/30 mb-3" />
                    <h3 className="text-lg font-medium">No detailed data available</h3>
                    <p className="mt-1">Detailed dimension data is not available for this assessment.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="summary">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h3 className="font-medium">Assessment Details</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-sm font-medium">Site:</p>
                        <p className="text-sm">{selectedAssessment.site}</p>
                        
                        <p className="text-sm font-medium">Period:</p>
                        <p className="text-sm">{format(selectedAssessment.date, 'MMMM yyyy')}</p>
                        
                        <p className="text-sm font-medium">Score:</p>
                        <Badge className={getScoreColor(parseFloat(selectedAssessment.score))}>
                          {selectedAssessment.score}/5.0
                        </Badge>
                        
                        <p className="text-sm font-medium">Status:</p>
                        <Badge variant={selectedAssessment.status === 'completed' ? 'default' : 'outline'}>
                          {selectedAssessment.status === 'completed' ? 'Completed' : 'In Progress'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium">Assessment Metadata</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-sm font-medium">Assessed By:</p>
                        <p className="text-sm">{selectedAssessment.assessedBy}</p>
                        
                        <p className="text-sm font-medium">Assessed On:</p>
                        <p className="text-sm">{selectedAssessment.assessedOn}</p>
                        
                        <p className="text-sm font-medium">Dimensions:</p>
                        <p className="text-sm">{selectedAssessment.dimensions?.length || 0}</p>
                        
                        <p className="text-sm font-medium">Total Assets:</p>
                        <p className="text-sm">
                          {selectedAssessment.dimensions?.reduce((sum, dim) => sum + (dim.assets?.length || 0), 0) || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {selectedAssessment.dimensions && selectedAssessment.dimensions.length > 0 && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Dimension</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Asset Count</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedAssessment.dimensions.map((dim, idx) => (
                          <TableRow key={`sum-dim-${idx}`}>
                            <TableCell>{dim.name}</TableCell>
                            <TableCell>
                              <Badge className={getScoreColor(dim.score)}>
                                {dim.score.toFixed(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>{dim.assets?.length || 0}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="comprehensive">
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => exportToExcel(selectedAssessment)}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Export to Excel
                    </Button>
                  </div>
                  
                  {selectedAssessment.dimensions && selectedAssessment.dimensions.length > 0 ? (
                    <Accordion type="multiple" className="w-full">
                      {selectedAssessment.dimensions.map((dimension, dimIdx) => (
                        <AccordionItem key={`comp-dim-${dimIdx}`} value={`dim-${dimIdx}`}>
                          <AccordionTrigger className="hover:bg-muted/50 px-4">
                            <div className="flex items-center gap-3">
                              <Badge className={getScoreColor(dimension.score)}>
                                {dimension.score.toFixed(1)}
                              </Badge>
                              <span className="text-lg font-medium">{dimension.name}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4">
                            {dimension.assets && dimension.assets.length > 0 ? (
                              <div className="space-y-4">
                                {dimension.assets.map((asset, assetIdx) => (
                                  <Card key={`comp-asset-${assetIdx}`} className="border shadow-sm">
                                    <CardHeader className="py-3">
                                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                        <div className="flex items-center gap-3">
                                          <Badge className={getScoreColor(asset.score)}>
                                            {asset.score.toFixed(1)}
                                          </Badge>
                                          <CardTitle className="text-md">{asset.name}</CardTitle>
                                          <Badge variant="outline">{asset.type}</Badge>
                                        </div>
                                      </div>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                      {asset.parameters && asset.parameters.length > 0 ? (
                                        <div className="space-y-4">
                                          {asset.parameters.map((param, paramIdx) => (
                                            <Collapsible
                                              key={`comp-param-${paramIdx}`}
                                              open={expandedParameters[`${asset.id}-${param.id}`]}
                                              onOpenChange={() => toggleParameter(`${asset.id}-${param.id}`)}
                                              className="border rounded-md overflow-hidden"
                                            >
                                              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted/50">
                                                <div className="flex items-center gap-3">
                                                  <Badge className={getScoreColor(param.score)}>
                                                    {param.score.toFixed(1)}
                                                  </Badge>
                                                  <div className="font-medium">{param.name}</div>
                                                </div>
                                                {expandedParameters[`${asset.id}-${param.id}`] ? (
                                                  <ChevronDown className="h-4 w-4" />
                                                ) : (
                                                  <ChevronRight className="h-4 w-4" />
                                                )}
                                              </CollapsibleTrigger>
                                              
                                              <CollapsibleContent>
                                                <div className="p-4 pt-2 bg-muted/20">
                                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                      <h4 className="text-sm font-medium mb-2">Parameter Value</h4>
                                                      <div className="p-3 bg-white rounded-md border min-h-[80px]">
                                                        {param.value || 'No value provided'}
                                                      </div>
                                                    </div>
                                                    <div>
                                                      <h4 className="text-sm font-medium mb-2">Assessment Notes</h4>
                                                      <div className="p-3 bg-white rounded-md border min-h-[80px]">
                                                        {param.notes || 'No notes provided'}
                                                      </div>
                                                    </div>
                                                  </div>
                                                  {param.lastUpdated && (
                                                    <div className="mt-3 text-xs text-muted-foreground">
                                                      Last updated: {format(new Date(param.lastUpdated), 'PPpp')}
                                                    </div>
                                                  )}
                                                </div>
                                              </CollapsibleContent>
                                            </Collapsible>
                                          ))}
                                        </div>
                                      ) : (
                                        <p className="text-center text-muted-foreground py-3">
                                          No parameter data available
                                        </p>
                                      )}
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            ) : (
                              <p className="text-center text-muted-foreground py-3">
                                No asset data available for this dimension
                              </p>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <div className="text-center p-6 text-muted-foreground">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground/30 mb-3" />
                      <h3 className="text-lg font-medium">No comprehensive data available</h3>
                      <p className="mt-1">Detailed asset and parameter data is not available for this assessment.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Close
              </Button>
              <div className="flex gap-2">
                <Button onClick={() => {
                  setDialogOpen(false);
                  onViewDetails(selectedAssessment.id);
                }}>
                  View Full Assessment
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default PastAssessmentsList;
