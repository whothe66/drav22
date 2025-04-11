
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ParameterScoreSelector from './ParameterScoreSelector';

interface Parameter {
  id: number;
  name: string;
  description: string;
  type: string;
  options?: string[];
  scorable: boolean;
  weightage?: number;
  unit?: string;
}

interface Asset {
  id: number;
  name: string;
  description: string;
  siteId: number;
  type: string;
}

interface AssessmentDetailDialogProps {
  open: boolean;
  onClose: () => void;
  asset: Asset | null;
  parameter: Parameter | null;
  score: number | null;
  notes: string;
  value?: string;
  onScoreChange: (score: number) => void;
  onNotesChange: (notes: string) => void;
  onValueChange?: (value: string) => void;
  onSave: () => void;
}

const AssessmentDetailDialog: React.FC<AssessmentDetailDialogProps> = ({
  open,
  onClose,
  asset,
  parameter,
  score,
  notes,
  value = '',
  onScoreChange,
  onNotesChange,
  onValueChange,
  onSave
}) => {
  if (!asset || !parameter) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Parameter Details</DialogTitle>
          <DialogDescription>
            {asset.name} - {parameter.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Description</Label>
            <p className="text-sm text-muted-foreground">{parameter.description}</p>
          </div>
          
          {parameter.scorable && (
            <div className="space-y-2">
              <Label>Assessment Score</Label>
              <div className="flex justify-center py-2">
                <ParameterScoreSelector
                  value={score}
                  onChange={onScoreChange}
                  showStars={true}
                />
              </div>
            </div>
          )}
          
          {onValueChange && (
            <div className="space-y-2">
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                placeholder={`Enter value${parameter.unit ? ' in ' + parameter.unit : ''}`}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Add detailed notes about this parameter"
              rows={4}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onSave}>Save Details</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssessmentDetailDialog;
