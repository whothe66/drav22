
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import ParameterScoreSelector from './ParameterScoreSelector';
import { Parameter, Dimension } from '@/data/drParameters';
import { Asset } from '@/data/criticalITAssets';
import { Badge } from '@/components/ui/badge';

interface AssessmentData {
  [key: string]: {
    score?: number;
    value?: string;
    notes?: string;
    lastUpdated?: string;
  };
}

interface ConciseAssessmentViewProps {
  assets: Asset[];
  dimension: Dimension;
  assessmentData: AssessmentData;
  onScoreChange: (assetId: number, parameterId: number, score: number) => void;
  onValueChange?: (assetId: number, parameterId: number, value: string) => void;
  onDetailsClick: (assetId: number, parameterId: number) => void;
  calculateDimensionScore: (assetId: number, dimensionId: number) => number;
}

const ConciseAssessmentView: React.FC<ConciseAssessmentViewProps> = ({
  assets,
  dimension,
  assessmentData,
  onScoreChange,
  onValueChange,
  onDetailsClick,
  calculateDimensionScore
}) => {
  const handleValueChange = (assetId: number, parameterId: number, value: string) => {
    if (onValueChange) {
      onValueChange(assetId, parameterId, value);
    }
  };

  // Only display scorable parameters in the concise view
  const scorableParameters = dimension.parameters.filter(param => param.scorable);
  
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

  return (
    <div className="space-y-6">
      {assetTypes.map(assetType => (
        <div key={assetType} className="space-y-2">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Badge variant="outline">{assetType}</Badge>
            <span>Assets</span>
          </h3>
          
          <Table className="border-separate border-spacing-0">
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[250px]">Asset</TableHead>
                {scorableParameters.map(param => (
                  <TableHead key={param.id} className="text-center">
                    {param.name}
                  </TableHead>
                ))}
                <TableHead className="text-center w-[150px] bg-primary/5">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupedAssets[assetType].map(asset => {
                const dimensionScore = calculateDimensionScore(asset.id, dimension.id);

                return (
                  <TableRow key={asset.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{asset.name}</div>
                        <div className="text-xs text-muted-foreground">{asset.description}</div>
                      </div>
                    </TableCell>
                    
                    {scorableParameters.map(param => {
                      const paramKey = `${asset.id}-${param.id}`;
                      const paramData = assessmentData[paramKey] || {};
                      const score = paramData.score !== undefined ? paramData.score : null;
                      
                      return (
                        <TableCell key={paramKey} className="text-center">
                          <ParameterScoreSelector
                            value={score}
                            onChange={(value) => onScoreChange(asset.id, param.id, value)}
                            showStars={true}
                            showDetails={true}
                            onDetailsClick={() => onDetailsClick(asset.id, param.id)}
                          />
                        </TableCell>
                      );
                    })}
                    
                    <TableCell className="text-center bg-primary/5">
                      <div className="font-bold text-xl text-primary">{dimensionScore.toFixed(1)}</div>
                      <div className="text-xs text-muted-foreground">Average</div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
};

export default ConciseAssessmentView;
