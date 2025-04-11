
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Settings, Info, Calculator } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface FormulaSettings {
  useDimensionWeightage: boolean;
  useAssetCriticality: boolean;
  dimensionWeightageMultiplier: number;
  criticalityMultipliers: {
    High: number;
    Medium: number;
    Low: number;
  };
}

interface FormulaCustomizationProps {
  formulaSettings: FormulaSettings;
  onUpdateFormulaSettings: (settings: FormulaSettings) => void;
}

const DEFAULT_FORMULA_SETTINGS: FormulaSettings = {
  useDimensionWeightage: true,
  useAssetCriticality: false,
  dimensionWeightageMultiplier: 1.0,
  criticalityMultipliers: {
    High: 1.2,
    Medium: 1.0,
    Low: 0.8,
  }
};

const FormulaCustomization: React.FC<FormulaCustomizationProps> = ({ 
  formulaSettings,
  onUpdateFormulaSettings 
}) => {
  const { toast } = useToast();
  const [tempSettings, setTempSettings] = useState<FormulaSettings>({...formulaSettings});
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const handleSaveSettings = () => {
    onUpdateFormulaSettings(tempSettings);
    setDialogOpen(false);
    
    toast({
      title: "Formula settings updated",
      description: "The maturity score calculation formula has been updated successfully."
    });
  };
  
  const handleReset = () => {
    setTempSettings({...DEFAULT_FORMULA_SETTINGS});
  };
  
  const renderFormulaPreview = () => {
    let formula = "DR Dimension Score = ";
    
    if (tempSettings.useDimensionWeightage) {
      formula += "[(Parameter₁ Score × Weightage₁%) + (Parameter₂ Score × Weightage₂%) + ...] / Total Weightage";
      
      if (tempSettings.dimensionWeightageMultiplier !== 1.0) {
        formula += ` × ${tempSettings.dimensionWeightageMultiplier.toFixed(2)}`;
      }
    } else {
      formula += "(Parameter₁ Score + Parameter₂ Score + ...) / Number of Parameters";
    }
    
    if (tempSettings.useAssetCriticality) {
      formula += " × Criticality Multiplier";
    }
    
    return formula;
  };
  
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Calculator className="h-4 w-4" />
          Customize Formula
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Customize Maturity Score Formula</DialogTitle>
          <DialogDescription>
            Adjust how the maturity scores are calculated across assets and services.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4">
            <div className="p-3 bg-muted/50 rounded-md font-mono text-sm mb-2">
              {renderFormulaPreview()}
            </div>
          </div>
          
          <Tabs defaultValue="parameters" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="parameters">Parameters</TabsTrigger>
              <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
              <TabsTrigger value="criticality">Criticality</TabsTrigger>
            </TabsList>
            
            <TabsContent value="parameters" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Parameter Weightage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="use-weightage" 
                        checked={tempSettings.useDimensionWeightage}
                        onCheckedChange={(checked) => {
                          setTempSettings({
                            ...tempSettings,
                            useDimensionWeightage: checked
                          });
                        }}
                      />
                      <Label htmlFor="use-weightage">Use parameter weightage in calculation</Label>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            When enabled, each parameter's score is multiplied by its weightage percentage. 
                            When disabled, all parameters have equal weight.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="dimensions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Dimension Weightage Multiplier</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="weight-multiplier">Multiplier: {tempSettings.dimensionWeightageMultiplier.toFixed(2)}</Label>
                        <span className="text-sm text-muted-foreground">Affects all dimensions</span>
                      </div>
                      <Slider 
                        id="weight-multiplier"
                        min={0.5}
                        max={2.0}
                        step={0.05}
                        value={[tempSettings.dimensionWeightageMultiplier]}
                        onValueChange={(values) => {
                          setTempSettings({
                            ...tempSettings,
                            dimensionWeightageMultiplier: values[0]
                          });
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="criticality" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Asset Criticality</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="use-criticality" 
                        checked={tempSettings.useAssetCriticality}
                        onCheckedChange={(checked) => {
                          setTempSettings({
                            ...tempSettings,
                            useAssetCriticality: checked
                          });
                        }}
                      />
                      <Label htmlFor="use-criticality">Apply asset criticality multipliers</Label>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            When enabled, asset scores are multiplied by a factor based on their criticality.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  
                  <div className={`space-y-4 ${!tempSettings.useAssetCriticality ? "opacity-50" : ""}`}>
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-red-100 text-red-800 border-red-200">High</Badge>
                          <Label htmlFor="high-criticality">High Criticality Multiplier</Label>
                        </div>
                        <span className="font-mono">{tempSettings.criticalityMultipliers.High.toFixed(2)}x</span>
                      </div>
                      <Slider 
                        id="high-criticality"
                        min={1.0}
                        max={2.0}
                        step={0.05}
                        disabled={!tempSettings.useAssetCriticality}
                        value={[tempSettings.criticalityMultipliers.High]}
                        onValueChange={(values) => {
                          setTempSettings({
                            ...tempSettings,
                            criticalityMultipliers: {
                              ...tempSettings.criticalityMultipliers,
                              High: values[0]
                            }
                          });
                        }}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium</Badge>
                          <Label htmlFor="medium-criticality">Medium Criticality Multiplier</Label>
                        </div>
                        <span className="font-mono">{tempSettings.criticalityMultipliers.Medium.toFixed(2)}x</span>
                      </div>
                      <Slider 
                        id="medium-criticality"
                        min={0.7}
                        max={1.5}
                        step={0.05}
                        disabled={!tempSettings.useAssetCriticality}
                        value={[tempSettings.criticalityMultipliers.Medium]}
                        onValueChange={(values) => {
                          setTempSettings({
                            ...tempSettings,
                            criticalityMultipliers: {
                              ...tempSettings.criticalityMultipliers,
                              Medium: values[0]
                            }
                          });
                        }}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-100 text-green-800 border-green-200">Low</Badge>
                          <Label htmlFor="low-criticality">Low Criticality Multiplier</Label>
                        </div>
                        <span className="font-mono">{tempSettings.criticalityMultipliers.Low.toFixed(2)}x</span>
                      </div>
                      <Slider 
                        id="low-criticality"
                        min={0.5}
                        max={1.0}
                        step={0.05}
                        disabled={!tempSettings.useAssetCriticality}
                        value={[tempSettings.criticalityMultipliers.Low]}
                        onValueChange={(values) => {
                          setTempSettings({
                            ...tempSettings,
                            criticalityMultipliers: {
                              ...tempSettings.criticalityMultipliers,
                              Low: values[0]
                            }
                          });
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>Reset to Default</Button>
          <Button onClick={handleSaveSettings}>Apply Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FormulaCustomization;
export { DEFAULT_FORMULA_SETTINGS };
export type { FormulaSettings };
