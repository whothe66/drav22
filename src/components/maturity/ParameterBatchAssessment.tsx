
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ParameterScoreSelector from './ParameterScoreSelector';
import { Dimension, Parameter } from '@/data/drParameters';
import { Asset } from '@/data/criticalITServices';
import { Badge } from '@/components/ui/badge';
import { DimensionGuidance } from './DRScoringGuidance';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { criticalITServices, Service } from '@/data/criticalITServices';

interface AssessmentData {
  [key: string]: {
    score?: number;
    value?: string;
    notes?: string;
    lastUpdated?: string;
  };
}

interface ParameterBatchAssessmentProps {
  dimension: Dimension;
  parameter: Parameter;
  assets: Asset[];
  onBatchScore: (parameterId: number, assetIds: number[], score: number) => void;
  onBatchValueChange?: (parameterId: number, assetIds: number[], value: string) => void;
  assessmentData: AssessmentData;
  scoringGuidance: DimensionGuidance[];
}

const ParameterBatchAssessment: React.FC<ParameterBatchAssessmentProps> = ({
  dimension,
  parameter,
  assets,
  onBatchScore,
  onBatchValueChange,
  assessmentData,
  scoringGuidance
}) => {
  const [selectedAssets, setSelectedAssets] = useState<number[]>([]);
  const [batchScore, setBatchScore] = useState<number | null>(null);
  const [batchValue, setBatchValue] = useState<string>('');
  const [selectAll, setSelectAll] = useState(false);
  const [showValueEditor, setShowValueEditor] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [batchServiceId, setBatchServiceId] = useState<string>('');

  // Find scoring guidance for this parameter
  const parameterGuidance = scoringGuidance
    .find(d => d.dimensionId === dimension.id)
    ?.parameters.find(p => p.parameterId === parameter.id);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedAssets([]);
    } else {
      setSelectedAssets(assets.map(asset => asset.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectAsset = (assetId: number) => {
    setSelectedAssets(prev => {
      if (prev.includes(assetId)) {
        return prev.filter(id => id !== assetId);
      } else {
        return [...prev, assetId];
      }
    });
  };

  const handleBatchScoreApply = () => {
    if (batchScore !== null && selectedAssets.length > 0) {
      onBatchScore(parameter.id, selectedAssets, batchScore);
      setBatchScore(null);
    }
  };

  const handleBatchValueApply = () => {
    if (batchValue && selectedAssets.length > 0 && onBatchValueChange) {
      onBatchValueChange(parameter.id, selectedAssets, batchValue);
      setBatchValue('');
    }
  };

  const handleBatchServiceApply = () => {
    if (batchServiceId && selectedAssets.length > 0) {
      // This would require a new function to update service IDs for assets
      // Typically would be implemented in a real application
      alert(`Service update would be applied to ${selectedAssets.length} assets`);
    }
  };

  const handleEditValueClick = (assetId: number, currentValue: string) => {
    setShowValueEditor(assetId);
    setEditValue(currentValue || '');
  };

  const handleSaveValue = (assetId: number) => {
    if (onBatchValueChange) {
      onBatchValueChange(parameter.id, [assetId], editValue);
    }
    setShowValueEditor(null);
    setEditValue('');
  };

  // Group assets by type for better organization
  const groupedAssets: Record<string, Asset[]> = {};
  assets.forEach(asset => {
    if (!groupedAssets[asset.type]) {
      groupedAssets[asset.type] = [];
    }
    groupedAssets[asset.type].push(asset);
  });
  
  // Sort asset types for consistent display
  const assetTypes = Object.keys(groupedAssets).sort();

  // Determine the input type based on parameter type
  const getValueInputComponent = () => {
    switch (parameter.type) {
      case 'text':
      case 'hyperlink':
      case 'number':
        return (
          <Input
            type={parameter.type === 'number' ? 'number' : 'text'}
            value={batchValue}
            onChange={(e) => setBatchValue(e.target.value)}
            placeholder={`Enter ${parameter.type} value`}
          />
        );
      case 'percentage':
        return (
          <Input
            type="number"
            min="0"
            max="100"
            value={batchValue}
            onChange={(e) => setBatchValue(e.target.value)}
            placeholder="Enter percentage value"
          />
        );
      case 'dropdown':
        return parameter.options ? (
          <Select 
            value={batchValue} 
            onValueChange={setBatchValue}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              {parameter.options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null;
      case 'counter':
        return (
          <Input
            type="number"
            min="0"
            step="1"
            value={batchValue}
            onChange={(e) => setBatchValue(e.target.value)}
            placeholder="Enter counter value"
          />
        );
      default:
        return null;
    }
  };

  const getServiceName = (serviceId: number): string => {
    const service = criticalITServices.find(s => s.id === serviceId);
    return service ? service.name : 'N/A';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-1">Parameter Information</h3>
                <p className="text-sm text-muted-foreground">{parameter.description}</p>
                {parameter.unit && (
                  <p className="text-sm text-muted-foreground mt-1">Unit: {parameter.unit}</p>
                )}
                {parameter.weightage && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Weightage: <Badge variant="secondary">{parameter.weightage}%</Badge>
                  </p>
                )}
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Batch Actions</h3>
                
                <div className="flex flex-col space-y-3">
                  {parameter.scorable && (
                    <div className="flex items-center gap-2">
                      <div className="w-1/2">
                        <p className="text-sm font-medium mb-1">Set Score for Selected Assets:</p>
                        <ParameterScoreSelector
                          parameterType="score"
                          value={batchScore}
                          onChange={setBatchScore}
                          showStars={true}
                        />
                      </div>
                      <Button
                        onClick={handleBatchScoreApply}
                        disabled={batchScore === null || selectedAssets.length === 0}
                        size="sm"
                      >
                        Apply Score
                      </Button>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <div className="w-1/2">
                      <p className="text-sm font-medium mb-1">Set Value for Selected Assets:</p>
                      {getValueInputComponent()}
                    </div>
                    <Button
                      onClick={handleBatchValueApply}
                      disabled={!batchValue || selectedAssets.length === 0}
                      size="sm"
                    >
                      Apply Value
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-1/2">
                      <p className="text-sm font-medium mb-1">Set Service for Selected Assets:</p>
                      <Select
                        value={batchServiceId}
                        onValueChange={setBatchServiceId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select service" />
                        </SelectTrigger>
                        <SelectContent>
                          {criticalITServices.map(service => (
                            <SelectItem key={service.id} value={service.id.toString()}>
                              {service.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={handleBatchServiceApply}
                      disabled={!batchServiceId || selectedAssets.length === 0}
                      size="sm"
                    >
                      Apply Service
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Scoring Guidance */}
            {parameterGuidance && (
              <div>
                <h3 className="font-medium mb-2">Scoring Guidance</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Level</TableHead>
                      <TableHead className="w-40">Rating</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parameterGuidance.levels.map(level => (
                      <TableRow key={level.level}>
                        <TableCell>Level {level.level}</TableCell>
                        <TableCell>({level.name})</TableCell>
                        <TableCell>{level.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">Assets to Assess</h3>
          
          <div className="flex items-center gap-2">
            <Checkbox
              id="select-all"
              checked={selectAll}
              onCheckedChange={handleSelectAll}
            />
            <label htmlFor="select-all" className="text-sm cursor-pointer">
              Select All Assets
            </label>
          </div>
        </div>
        
        {assetTypes.map(assetType => (
          <div key={assetType} className="mb-6 last:mb-0">
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <Badge variant="outline" className="mr-2">
                {assetType}
              </Badge>
              Assets
            </h4>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead className="w-36">Service</TableHead>
                  <TableHead className="w-36">Current Value</TableHead>
                  <TableHead className="w-36 text-center">Current Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupedAssets[assetType].map(asset => {
                  const paramKey = `${asset.id}-${parameter.id}`;
                  const paramData = assessmentData[paramKey] || {};
                  
                  return (
                    <TableRow key={asset.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedAssets.includes(asset.id)}
                          onCheckedChange={() => handleSelectAsset(asset.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{asset.name}</div>
                          <div className="text-xs text-muted-foreground">{asset.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {getServiceName(asset.serviceId)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {showValueEditor === asset.id ? (
                          <div className="flex items-center gap-2">
                            <Input 
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="h-8 w-full"
                            />
                            <Button size="sm" onClick={() => handleSaveValue(asset.id)}>Save</Button>
                          </div>
                        ) : (
                          <div className="text-sm flex items-center justify-between">
                            <span>
                              {paramData.value ? (
                                <>
                                  {paramData.value}
                                  {parameter.unit && ` ${parameter.unit}`}
                                </>
                              ) : (
                                <span className="text-muted-foreground">No value</span>
                              )}
                            </span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEditValueClick(asset.id, paramData.value || '')}
                              className="h-6 px-2"
                            >
                              Edit
                            </Button>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {parameter.scorable ? (
                          <div className="flex justify-center">
                            <ParameterScoreSelector
                              parameterType="score"
                              value={paramData.score !== undefined ? paramData.score : null}
                              onChange={(value) => onBatchScore(parameter.id, [asset.id], value)}
                              showStars={true}
                              disabled={false}
                            />
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParameterBatchAssessment;
