import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { drScoreDescriptions } from './DRScoreDefinitions';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ParameterScoreSelectorProps {
  value: number | null;
  onChange: (value: number) => void;
  disabled?: boolean;
  showStars?: boolean;
  showDetails?: boolean;
  onDetailsClick?: () => void;
  parameterType?: string;
  options?: string[];
  textValue?: string;
  onTextValueChange?: (value: string) => void;
  unit?: string;
  readOnly?: boolean;
}

const ParameterScoreSelector: React.FC<ParameterScoreSelectorProps> = ({ 
  value, 
  onChange,
  disabled = false,
  showStars = false,
  showDetails = false,
  onDetailsClick,
  parameterType = 'score',
  options = [],
  textValue = '',
  onTextValueChange,
  unit,
  readOnly = false
}) => {
  const getScoreColor = (score: number) => {
    if (score === undefined || score === null) return '';
    return drScoreDescriptions[score as keyof typeof drScoreDescriptions]?.color || '';
  };

  const getStarColor = (score: number | null, starPosition: number) => {
    if (score === undefined || score === null) return 'text-gray-300';
    if (starPosition > score) return 'text-gray-300';
    
    switch (score) {
      case 1: return 'text-destructive fill-destructive';
      case 2: return 'text-destructive/80 fill-destructive/80';
      case 3: return 'text-warning fill-warning';
      case 4: return 'text-success fill-success';
      case 5: return 'text-success/80 fill-success/80';
      default: return 'text-gray-300';
    }
  };

  const renderStars = (score: number | null) => {
    if (!showStars) return null;
    
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${getStarColor(score, star)}`}
            onClick={() => !disabled && !readOnly && onChange(star)}
            style={{ cursor: (disabled || readOnly) ? 'default' : 'pointer' }}
          />
        ))}
      </div>
    );
  };

  const getScoreLabel = (score: number | null) => {
    if (score === undefined || score === null) return "Not Rated";
    return drScoreDescriptions[score as keyof typeof drScoreDescriptions]?.label || "Not Rated";
  };

  const renderParameterInput = () => {
    switch (parameterType) {
      case 'dropdown':
        return (
          <Select
            value={textValue}
            onValueChange={onTextValueChange}
            disabled={disabled || readOnly}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
        
      case 'text':
        return (
          <Input 
            type="text" 
            value={textValue} 
            onChange={(e) => onTextValueChange && onTextValueChange(e.target.value)}
            placeholder="Enter value"
            disabled={disabled || readOnly}
          />
        );
        
      case 'number':
        return (
          <div className="flex items-center">
            <Input 
              type="number" 
              value={textValue} 
              onChange={(e) => onTextValueChange && onTextValueChange(e.target.value)}
              placeholder="Enter number"
              disabled={disabled || readOnly}
              className="w-32"
            />
            {unit && <span className="ml-2 text-sm text-muted-foreground">{unit}</span>}
          </div>
        );
        
      case 'percentage':
        return (
          <div className="flex items-center">
            <Input 
              type="number" 
              value={textValue} 
              onChange={(e) => onTextValueChange && onTextValueChange(e.target.value)}
              placeholder="Enter percentage"
              disabled={disabled || readOnly}
              min="0"
              max="100"
              className="w-32"
            />
            <span className="ml-2 text-sm text-muted-foreground">%</span>
          </div>
        );
        
      case 'counter':
        return (
          <div className="flex items-center">
            <Input 
              type="number" 
              value={textValue} 
              onChange={(e) => onTextValueChange && onTextValueChange(e.target.value)}
              placeholder="Enter value"
              disabled={disabled || readOnly}
              min="0"
              className="w-32"
            />
            {unit && <span className="ml-2 text-sm text-muted-foreground">{unit}</span>}
          </div>
        );
        
      case 'hyperlink':
        return (
          <Input 
            type="url" 
            value={textValue} 
            onChange={(e) => onTextValueChange && onTextValueChange(e.target.value)}
            placeholder="Enter URL"
            disabled={disabled || readOnly}
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center gap-1">
      {parameterType !== 'score' ? (
        <div className="w-full">
          {renderParameterInput()}
        </div>
      ) : showStars ? (
        <div className="flex flex-col items-center">
          {renderStars(value)}
          <span className="text-xs mt-1">{getScoreLabel(value)}</span>
          
          {showDetails && !readOnly && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs mt-1" 
              onClick={onDetailsClick}
              disabled={disabled}
            >
              Add Details
            </Button>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Select
            value={value !== null && value !== undefined ? value.toString() : ""}
            onValueChange={(val) => onChange(parseInt(val))}
            disabled={disabled || readOnly}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select Rating">
                {value !== null && value !== undefined ? (
                  <Badge variant="outline" className={getScoreColor(value)}>
                    {value} - {getScoreLabel(value)}
                  </Badge>
                ) : (
                  "Select Rating"
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(drScoreDescriptions).map(([score, { label }]) => (
                <SelectItem key={score} value={score}>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getScoreColor(parseInt(score))}>
                      {score}
                    </Badge>
                    <span>{label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-md">
                <div className="space-y-2">
                  <p className="font-medium">DR Maturity Score Definitions:</p>
                  <ul className="text-xs space-y-1">
                    {Object.entries(drScoreDescriptions).map(([score, { label, description }]) => (
                      <li key={score}>
                        <span className="font-medium">{score} - {label}:</span> {description}
                      </li>
                    ))}
                  </ul>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
};

export default ParameterScoreSelector;
