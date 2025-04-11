
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Layers, Server, ListChecks } from 'lucide-react';

interface AssessmentModeSelectorProps {
  selectedMode: 'service' | 'asset' | 'parameter';
  onModeChange: (mode: 'service' | 'asset' | 'parameter') => void;
  progress: {
    service: number;
    asset: number;
    parameter: number;
  };
}

const AssessmentModeSelector: React.FC<AssessmentModeSelectorProps> = ({
  selectedMode,
  onModeChange,
  progress
}) => {
  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle>Assessment Mode</CardTitle>
        <CardDescription>
          Select how you want to approach this assessment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue={selectedMode} 
          onValueChange={(value) => onModeChange(value as 'service' | 'asset' | 'parameter')}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="service" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              By Service
            </TabsTrigger>
            <TabsTrigger value="asset" className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              By Asset
            </TabsTrigger>
            <TabsTrigger value="parameter" className="flex items-center gap-2">
              <ListChecks className="h-4 w-4" />
              By Parameter
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="service" className="mt-0">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Service assessment progress</span>
                  <span className="font-medium">{progress.service.toFixed(0)}%</span>
                </div>
                <Progress value={progress.service} className="h-2" />
              </div>
              <p className="text-sm text-muted-foreground">
                Assess all parameters for each critical service across assets. Best for service-focused assessments.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="asset" className="mt-0">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Asset assessment progress</span>
                  <span className="font-medium">{progress.asset.toFixed(0)}%</span>
                </div>
                <Progress value={progress.asset} className="h-2" />
              </div>
              <p className="text-sm text-muted-foreground">
                Assess all parameters for each asset individually. Best for asset-focused assessments.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="parameter" className="mt-0">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Parameter assessment progress</span>
                  <span className="font-medium">{progress.parameter.toFixed(0)}%</span>
                </div>
                <Progress value={progress.parameter} className="h-2" />
              </div>
              <p className="text-sm text-muted-foreground">
                Assess each parameter across multiple assets at once. Best for efficient scoring of similar assets.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AssessmentModeSelector;
