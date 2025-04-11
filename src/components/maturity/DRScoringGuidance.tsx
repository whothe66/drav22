
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dimension, Parameter } from '@/data/drParameters';
import { InfoIcon, Plus, Edit, Save } from 'lucide-react';

interface ScoringLevel {
  level: number;
  name: string;
  description: string;
}

interface ParameterGuidance {
  parameterId: number;
  parameterName: string;
  levels: ScoringLevel[];
}

interface DimensionGuidance {
  dimensionId: number;
  dimensionName: string;
  parameters: ParameterGuidance[];
}

export const defaultScoringGuidance: DimensionGuidance[] = [
  {
    dimensionId: 1,
    dimensionName: "Internal Support",
    parameters: [
      {
        parameterId: 1,
        parameterName: "Primary support POC",
        levels: [
          { level: 1, name: "Minimal", description: "No POC identified" },
          { level: 2, name: "Basic", description: "POC identified but untrained or unavailable" },
          { level: 3, name: "Established", description: "Trained POC with limited availability" },
          { level: 4, name: "Advanced", description: "Well-trained POC with good availability" },
          { level: 5, name: "Optimized", description: "Fully trained, always available POC with documented handover procedures" }
        ]
      },
      {
        parameterId: 2,
        parameterName: "Secondary support - backup POC",
        levels: [
          { level: 1, name: "Minimal", description: "No backup POC identified" },
          { level: 2, name: "Basic", description: "Backup POC identified but untrained" },
          { level: 3, name: "Established", description: "Trained backup POC with limited knowledge" },
          { level: 4, name: "Advanced", description: "Well-trained backup POC with good knowledge" },
          { level: 5, name: "Optimized", description: "Fully trained backup POC with complete knowledge parity to primary" }
        ]
      },
      // ... similar structures for other parameters
    ]
  },
  // ... similar structures for other dimensions
];

interface DRScoringGuidanceProps {
  dimensions: Dimension[];
  scoringGuidance: DimensionGuidance[];
  onUpdateGuidance?: (guidance: DimensionGuidance[]) => void;
  readOnly?: boolean;
}

const DRScoringGuidance: React.FC<DRScoringGuidanceProps> = ({
  dimensions,
  scoringGuidance,
  onUpdateGuidance,
  readOnly = false
}) => {
  const [selectedDimension, setSelectedDimension] = useState<number>(dimensions[0]?.id || 1);
  const [isAddGuidanceOpen, setIsAddGuidanceOpen] = useState(false);
  const [isEditGuidanceOpen, setIsEditGuidanceOpen] = useState(false);
  const [editingParameterId, setEditingParameterId] = useState<number | null>(null);
  const [levelDescriptions, setLevelDescriptions] = useState<{[level: number]: string}>({
    1: "",
    2: "",
    3: "",
    4: "",
    5: ""
  });
  const [levelNames, setLevelNames] = useState<{[level: number]: string}>({
    1: "Minimal",
    2: "Basic",
    3: "Established",
    4: "Advanced",
    5: "Optimized"
  });
  
  const handleDimensionChange = (id: string) => {
    setSelectedDimension(parseInt(id));
  };
  
  const currentDimension = dimensions.find(d => d.id === selectedDimension);
  const currentGuidance = scoringGuidance.find(g => g.dimensionId === selectedDimension);

  const handleEditDimensionGuidance = () => {
    setIsEditGuidanceOpen(true);
  };

  const handleAddGuidance = (parameterId: number) => {
    // Find the parameter to get its name
    let parameterName = "";
    dimensions.forEach(dim => {
      const param = dim.parameters.find(p => p.id === parameterId);
      if (param) parameterName = param.name;
    });

    // Reset form fields
    setLevelDescriptions({
      1: "",
      2: "",
      3: "",
      4: "",
      5: ""
    });
    
    setEditingParameterId(parameterId);
    setIsAddGuidanceOpen(true);
  };

  const handleEditGuidance = (parameterId: number) => {
    const paramGuidance = currentGuidance?.parameters.find(p => p.parameterId === parameterId);
    
    if (paramGuidance) {
      // Pre-fill form with existing guidance
      const descriptions: {[level: number]: string} = {};
      const names: {[level: number]: string} = {};
      
      paramGuidance.levels.forEach(level => {
        descriptions[level.level] = level.description;
        names[level.level] = level.name;
      });
      
      setLevelDescriptions(descriptions);
      setLevelNames(names);
      setEditingParameterId(parameterId);
      setIsAddGuidanceOpen(true);
    }
  };

  const handleSaveGuidance = () => {
    if (!editingParameterId || !onUpdateGuidance) return;

    // Create new levels
    const levels: ScoringLevel[] = [];
    for (let i = 1; i <= 5; i++) {
      levels.push({
        level: i,
        name: levelNames[i],
        description: levelDescriptions[i]
      });
    }

    // Find parameter name
    let parameterName = "";
    dimensions.forEach(dim => {
      const param = dim.parameters.find(p => p.id === editingParameterId);
      if (param) parameterName = param.name;
    });

    // Create new parameter guidance
    const newParamGuidance: ParameterGuidance = {
      parameterId: editingParameterId,
      parameterName,
      levels
    };

    // Update guidance
    const updatedGuidance = [...scoringGuidance];
    const dimIndex = updatedGuidance.findIndex(g => g.dimensionId === selectedDimension);
    
    if (dimIndex >= 0) {
      // Check if parameter guidance already exists
      const paramIndex = updatedGuidance[dimIndex].parameters.findIndex(
        p => p.parameterId === editingParameterId
      );
      
      if (paramIndex >= 0) {
        // Update existing parameter guidance
        updatedGuidance[dimIndex].parameters[paramIndex] = newParamGuidance;
      } else {
        // Add new parameter guidance
        updatedGuidance[dimIndex].parameters.push(newParamGuidance);
      }
    } else {
      // Create new dimension guidance
      updatedGuidance.push({
        dimensionId: selectedDimension,
        dimensionName: currentDimension?.name || "",
        parameters: [newParamGuidance]
      });
    }

    onUpdateGuidance(updatedGuidance);
    setIsAddGuidanceOpen(false);
    setEditingParameterId(null);
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>DR Scoring Guidance</CardTitle>
        <CardDescription>
          Detailed scoring criteria for each parameter in the disaster recovery assessment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue={selectedDimension.toString()} 
          onValueChange={handleDimensionChange}
          className="w-full"
        >
          <TabsList className="mb-4 flex flex-wrap h-auto">
            {dimensions.map(dimension => (
              <TabsTrigger 
                key={dimension.id} 
                value={dimension.id.toString()}
                className="mb-1"
              >
                {dimension.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {dimensions.map(dimension => (
            <TabsContent key={dimension.id} value={dimension.id.toString()} className="mt-0">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">{dimension.name} Scoring Guidance</h3>
                  {!readOnly && (
                    <Button variant="outline" size="sm" onClick={handleEditDimensionGuidance}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Guidance
                    </Button>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground">{dimension.description}</p>
                
                <Accordion type="multiple" className="w-full">
                  {dimension.parameters.filter(p => p.scorable).map(parameter => {
                    const paramGuidance = currentGuidance?.parameters.find(p => p.parameterId === parameter.id);
                    
                    return (
                      <AccordionItem key={parameter.id} value={parameter.id.toString()}>
                        <AccordionTrigger className="hover:bg-muted/50 px-4 py-2 rounded-md">
                          <div className="flex items-center gap-2">
                            <span>{parameter.name}</span>
                            {paramGuidance ? (
                              <Badge variant="outline" className="bg-primary/10">Guidance Available</Badge>
                            ) : (
                              <Badge variant="outline" className="bg-muted">No Detailed Guidance</Badge>
                            )}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pt-2">
                          <div className="space-y-4">
                            <div className="text-sm text-muted-foreground pb-2 border-b">
                              {parameter.description}
                            </div>
                            
                            {paramGuidance ? (
                              <div className="space-y-4">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead className="w-20">Level</TableHead>
                                      <TableHead className="w-40">Rating</TableHead>
                                      <TableHead>Description</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {paramGuidance.levels.map(level => (
                                      <TableRow key={level.level}>
                                        <TableCell>Level {level.level}</TableCell>
                                        <TableCell>({level.name})</TableCell>
                                        <TableCell>{level.description}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                                
                                {!readOnly && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditGuidance(parameter.id)}
                                    className="mt-2"
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Guidance
                                  </Button>
                                )}
                              </div>
                            ) : (
                              <div className="py-4 text-center border rounded-md bg-muted/20">
                                <InfoIcon className="h-10 w-10 text-muted-foreground/40 mx-auto mb-2" />
                                <p className="text-muted-foreground">No detailed scoring guidance available for this parameter</p>
                                {!readOnly && (
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="mt-2"
                                    onClick={() => handleAddGuidance(parameter.id)}
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Guidance
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Add/Edit Guidance Dialog */}
        <Dialog open={isAddGuidanceOpen} onOpenChange={setIsAddGuidanceOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingParameterId && currentGuidance?.parameters.find(p => p.parameterId === editingParameterId)
                  ? "Edit Scoring Guidance"
                  : "Add Scoring Guidance"
                }
              </DialogTitle>
              <DialogDescription>
                Define detailed scoring criteria for each maturity level
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {[1, 2, 3, 4, 5].map(level => (
                <div key={level} className="space-y-2">
                  <div className="flex items-center gap-4">
                    <Label className="text-base font-semibold min-w-24">Level {level}:</Label>
                    <Input 
                      value={levelNames[level]} 
                      onChange={(e) => setLevelNames({...levelNames, [level]: e.target.value})}
                      className="max-w-32"
                      placeholder="Rating name"
                    />
                  </div>
                  <Textarea 
                    value={levelDescriptions[level]} 
                    onChange={(e) => setLevelDescriptions({...levelDescriptions, [level]: e.target.value})}
                    placeholder={`Description for Level ${level} (${levelNames[level]})`}
                    className="h-20"
                  />
                </div>
              ))}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddGuidanceOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveGuidance} className="gap-2">
                <Save className="h-4 w-4" />
                Save Guidance
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dimension Guidance Dialog */}
        <Dialog open={isEditGuidanceOpen} onOpenChange={setIsEditGuidanceOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit {currentDimension?.name} Guidance</DialogTitle>
              <DialogDescription>
                Manage scoring guidance for all parameters in this dimension
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <p className="text-sm text-muted-foreground">
                Select a parameter below to add or edit its scoring guidance:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentDimension?.parameters.filter(p => p.scorable).map(parameter => {
                  const hasGuidance = currentGuidance?.parameters.some(p => p.parameterId === parameter.id);
                  
                  return (
                    <Button
                      key={parameter.id}
                      variant="outline"
                      className={`h-auto py-3 px-4 justify-start items-start text-left ${
                        hasGuidance ? 'border-primary/50 bg-primary/5' : ''
                      }`}
                      onClick={() => {
                        setIsEditGuidanceOpen(false);
                        if (hasGuidance) {
                          handleEditGuidance(parameter.id);
                        } else {
                          handleAddGuidance(parameter.id);
                        }
                      }}
                    >
                      <div>
                        <div className="font-medium">{parameter.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {hasGuidance ? 'Guidance available - Click to edit' : 'No guidance - Click to add'}
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditGuidanceOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default DRScoringGuidance;
export type { DimensionGuidance, ParameterGuidance, ScoringLevel };
