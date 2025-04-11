
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dimension } from '@/data/drParameters';

interface DimensionProgress {
  dimensionId: number;
  dimensionName: string;
  completedParameters: number;
  totalParameters: number;
  score: number;
}

interface AssessmentProgressTrackerProps {
  dimensions: Dimension[];
  dimensionProgress: DimensionProgress[];
  totalProgress: number;
}

const AssessmentProgressTracker: React.FC<AssessmentProgressTrackerProps> = ({
  dimensions,
  dimensionProgress,
  totalProgress
}) => {
  const [expanded, setExpanded] = useState(false);

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="mb-6">
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-lg">Assessment Progress</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1"
          >
            {expanded ? (
              <>
                Hide Details <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Show Details <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm">{Math.round(totalProgress)}%</span>
          </div>
          <Progress value={totalProgress} className="h-2" />
        </div>

        {expanded && (
          <div className="space-y-4 mt-4 pt-4 border-t">
            {dimensionProgress.map((dim) => {
              const progressPercent = dim.totalParameters > 0 
                ? (dim.completedParameters / dim.totalParameters) * 100 
                : 0;
              
              return (
                <div key={dim.dimensionId} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{dim.dimensionName}</span>
                      {dim.score > 0 && (
                        <Badge variant="outline" className="text-xs">
                          Score: {dim.score.toFixed(1)}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs">{Math.round(progressPercent)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${getProgressColor(progressPercent)}`}
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {dim.completedParameters}/{dim.totalParameters} parameters assessed
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentProgressTracker;
