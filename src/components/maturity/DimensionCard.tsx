
import React, { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, InfoIcon, Layers, ChevronUp } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ParameterScoreSelector from './ParameterScoreSelector';
import { Badge } from '@/components/ui/badge';
import { drScoreDescriptions } from './DRScoreDefinitions';
import { Parameter, Dimension } from '@/data/drParameters';
import { Asset } from '@/data/criticalITAssets';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface AssessmentData {
  [key: string]: {
    score?: number;
    value?: string;
    notes?: string;
    lastUpdated?: string;
  };
}

interface DimensionCardProps {
  dimension: Dimension;
  assets: Asset[];
  assessmentData: AssessmentData;
  onScoreChange: (assetId: number, parameterId: number, score: number) => void;
  onParameterClick: (asset: Asset, parameter: Parameter) => void;
  calculateDimensionScore: (assetId: number, dimensionId: number) => number;
  getParameterValueDisplay: (assetId: number, parameter: Parameter) => React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  onValueChange?: (assetId: number, parameterId: number, value: string) => void;
}

const DimensionCard: React.FC<DimensionCardProps> = ({
  dimension,
  assets,
  assessmentData,
  onScoreChange,
  onParameterClick,
  calculateDimensionScore,
  getParameterValueDisplay,
  isOpen,
  onToggle,
  onValueChange
}) => {
  // Track which progress sections are expanded
  const [showAllProgress, setShowAllProgress] = useState<boolean>(false);
  // Track which parameter has its guidance expanded
  const [expandedGuidanceParams, setExpandedGuidanceParams] = useState<Set<number>>(new Set());

  const getScoreBadgeColor = (score: number) => {
    if (!score) return '';
    return drScoreDescriptions[score as keyof typeof drScoreDescriptions]?.color || '';
  };

  const handleValueChange = (assetId: number, parameterId: number, value: string) => {
    if (onValueChange) {
      onValueChange(assetId, parameterId, value);
    }
  };

  const toggleGuidanceExpanded = (parameterId: number) => {
    const newExpanded = new Set(expandedGuidanceParams);
    if (newExpanded.has(parameterId)) {
      newExpanded.delete(parameterId);
    } else {
      newExpanded.add(parameterId);
    }
    setExpandedGuidanceParams(newExpanded);
  };

  return (
    <Collapsible 
      open={isOpen}
      className="border rounded-md shadow-sm mb-4"
    >
      <CollapsibleTrigger asChild>
        <div 
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50"
          onClick={onToggle}
        >
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">{dimension.name}</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{dimension.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {dimension.scorable && (
              <Badge variant="outline" className="ml-2">Scorable</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="p-4 pt-0">
          {/* Overall Progress */}
          <div className="bg-muted/30 p-3 rounded-md mb-4">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setShowAllProgress(!showAllProgress)}
            >
              <h3 className="text-md font-medium">Dimension Progress</h3>
              {showAllProgress ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
            
            {/* Always show overall progress */}
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Overall Progress</span>
                <span className="text-sm font-medium">75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            
            {/* Show detailed progress when expanded */}
            {showAllProgress && (
              <div className="mt-3 pt-2 border-t border-gray-200">
                <h4 className="text-sm font-medium mb-2">Asset-level Progress</h4>
                <div className="space-y-2">
                  {assets.map(asset => (
                    <div key={asset.id} className="text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span>{asset.name}</span>
                        <span className="font-medium">65%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-primary h-1.5 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        
          {assets.map((asset) => {
            const dimensionScore = calculateDimensionScore(asset.id, dimension.id).toFixed(1);
            const scoreNum = parseFloat(dimensionScore);
            const scoreBadgeColor = getScoreBadgeColor(Math.round(scoreNum));
            
            return (
              <div key={`${asset.id}-${dimension.id}`} className="mb-6 last:mb-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium flex items-center gap-2">
                    {asset.name}
                    <span className="text-xs text-muted-foreground">({asset.type})</span>
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Dimension Score:</span>
                    <Badge variant="outline" className={scoreBadgeColor}>
                      {dimensionScore}
                    </Badge>
                  </div>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Parameter</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead className="w-[100px] text-center">Weightage</TableHead>
                      <TableHead className="w-[160px] text-center">DR Maturity Score</TableHead>
                      <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dimension.parameters.map((parameter) => {
                      const paramKey = `${asset.id}-${parameter.id}`;
                      const paramData = assessmentData[paramKey] || {};
                      const isGuidanceExpanded = expandedGuidanceParams.has(parameter.id);
                      
                      return (
                        <React.Fragment key={paramKey}>
                          <TableRow>
                            <TableCell>
                              <div>
                                <span className="font-medium">{parameter.name}</span>
                                <p className="text-xs text-muted-foreground">{parameter.description}</p>
                                {parameter.unit && (
                                  <div className="text-xs text-muted-foreground mt-1">Unit: {parameter.unit}</div>
                                )}
                                {parameter.scorable && (
                                  <Badge variant="outline" className="mt-1 text-xs">Scorable</Badge>
                                )}
                                {parameter.scorable && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-0 h-auto mt-1 text-xs text-primary"
                                    onClick={() => toggleGuidanceExpanded(parameter.id)}
                                  >
                                    {isGuidanceExpanded ? "Hide scoring guidance" : "Show scoring guidance"}
                                    {isGuidanceExpanded ? (
                                      <ChevronUp className="h-3 w-3 ml-1" />
                                    ) : (
                                      <ChevronDown className="h-3 w-3 ml-1" />
                                    )}
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <ParameterScoreSelector
                                parameterType={parameter.type}
                                options={parameter.options}
                                textValue={paramData.value || ''}
                                onTextValueChange={(value) => handleValueChange(asset.id, parameter.id, value)}
                                unit={parameter.unit}
                                value={null}
                                onChange={() => {}}
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              {parameter.weightage ? (
                                <Badge variant="secondary">{parameter.weightage}%</Badge>
                              ) : (
                                <span className="text-muted-foreground">N/A</span>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {parameter.scorable ? (
                                <div className="flex justify-center">
                                  <ParameterScoreSelector
                                    parameterType="score"
                                    value={paramData.score || null}
                                    onChange={(value) => onScoreChange(asset.id, parameter.id, value)}
                                    showStars={true}
                                  />
                                </div>
                              ) : (
                                <span className="text-muted-foreground">N/A</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onParameterClick(asset, parameter)}
                              >
                                Edit
                              </Button>
                            </TableCell>
                          </TableRow>
                          {isGuidanceExpanded && (
                            <TableRow>
                              <TableCell colSpan={5} className="bg-muted/30 p-2">
                                <div className="text-sm">
                                  <h5 className="font-medium mb-2">Scoring Guidance</h5>
                                  <div className="space-y-2">
                                    {[1, 2, 3, 4, 5].map(score => (
                                      <div key={score} className="flex gap-2">
                                        <Badge className="bg-primary">{score}</Badge>
                                        <span>{`${score === 1 ? 'Initial' : score === 2 ? 'Basic' : score === 3 ? 'Intermediate' : score === 4 ? 'Advanced' : 'Optimized'}: ${
                                          score === 1 ? 'No formal process in place' :
                                          score === 2 ? 'Ad-hoc processes documented' :
                                          score === 3 ? 'Standardized processes implemented' :
                                          score === 4 ? 'Measured and controlled processes' :
                                          'Continuous improvement process'
                                        }`}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default DimensionCard;
