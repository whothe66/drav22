import React, { useState, useEffect, useRef } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageTitle } from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import PastAssessmentsList from '@/components/maturity/PastAssessmentsList';
import ConciseAssessmentView from '@/components/maturity/ConciseAssessmentView';
import AssessmentDetailDialog from '@/components/maturity/AssessmentDetailDialog';
import { CheckCircle, ArrowLeft, Download, Upload, FileSpreadsheet, Settings } from 'lucide-react';
import CompactAssessmentView from '@/components/maturity/CompactAssessmentView';
import AssessmentSetup from '@/components/maturity/AssessmentSetup';
import DimensionCard from '@/components/maturity/DimensionCard';
import { drDimensions, Dimension, Parameter } from '@/data/drParameters';
import { getAssetsBySite } from '@/data/criticalITAssets';
import { officeSites, Site } from '@/data/officeSites';
import AssessmentFileHandler from '@/components/maturity/AssessmentFileHandler';
import { 
  criticalITServices, 
  serviceAssets, 
  Service, 
  calculateWeightedDimensionScore, 
  FormulaSettings,
  Asset
} from '@/data/criticalITServices';
import FormulaCustomization, { DEFAULT_FORMULA_SETTINGS } from '@/components/maturity/FormulaCustomization';
import * as XLSX from 'xlsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

import AssessmentModeSelector from '@/components/maturity/AssessmentModeSelector';
import ParameterBatchAssessment from '@/components/maturity/ParameterBatchAssessment';
import AssessmentProgressTracker from '@/components/maturity/AssessmentProgressTracker';
import DRScoringGuidance, { 
  defaultScoringGuidance, 
  DimensionGuidance 
} from '@/components/maturity/DRScoringGuidance';

interface AssessmentData {
  [key: string]: {
    score?: number;
    value?: string;
    notes?: string;
    lastUpdated?: string;
  };
}

interface DimensionScore {
  name: string;
  score: number;
}

interface PastAssessment {
  id: string;
  site: string;
  siteId: number;
  date: Date;
  score: string;
  assessedBy: string;
  assessedOn: string;
  status: 'completed' | 'in-progress';
  dimensions?: DimensionScore[];
  services?: ServiceScore[];
}

interface ServiceScore {
  serviceId: number;
  serviceName: string;
  score: number;
}

interface DimensionProgress {
  dimensionId: number;
  dimensionName: string;
  completedParameters: number;
  totalParameters: number;
  score: number;
}

const MaturityAssessment = () => {
  const { toast } = useToast();
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({});
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [selectedParameter, setSelectedParameter] = useState<Parameter | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState<boolean>(false);
  const [tempScore, setTempScore] = useState<number | null>(null);
  const [tempValue, setTempValue] = useState<string>('');
  const [tempNotes, setTempNotes] = useState<string>('');
  const [showFileHandler, setShowFileHandler] = useState<boolean>(false);
  
  const [pastAssessments, setPastAssessments] = useState<PastAssessment[]>([]);
  const [showAssessment, setShowAssessment] = useState<boolean>(false);
  const [selectedAssessment, setSelectedAssessment] = useState<PastAssessment | null>(null);
  const [isCreatingNewAssessment, setIsCreatingNewAssessment] = useState<boolean>(false);
  const [showSetup, setShowSetup] = useState<boolean>(false);
  const [currentSiteId, setCurrentSiteId] = useState<number | null>(null);
  const [currentAuditor, setCurrentAuditor] = useState<string>('');
  const [currentSiteAssets, setCurrentSiteAssets] = useState<Asset[]>([]);
  const [openDimensions, setOpenDimensions] = useState<{[key: number]: boolean}>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [formulaSettings, setFormulaSettings] = useState<FormulaSettings>({...DEFAULT_FORMULA_SETTINGS});
  
  const [assessmentMode, setAssessmentMode] = useState<'service' | 'asset' | 'parameter'>('asset');
  const [selectedDimensionId, setSelectedDimensionId] = useState<number | null>(null);
  const [selectedParameterId, setSelectedParameterId] = useState<number | null>(null);
  const [scoringGuidance, setScoringGuidance] = useState<DimensionGuidance[]>(defaultScoringGuidance);
  const [showScoringGuidance, setShowScoringGuidance] = useState<boolean>(false);
  const [hasActiveAssessment, setHasActiveAssessment] = useState<boolean>(false);
  
  useEffect(() => {
    const initialOpenState: {[key: number]: boolean} = {};
    drDimensions.forEach(dim => {
      initialOpenState[dim.id] = false;
    });
    setOpenDimensions(initialOpenState);
  }, []);

  useEffect(() => {
    if (currentSiteId) {
      if (selectedServiceId) {
        const filtered = serviceAssets.filter(
          asset => asset.siteId === currentSiteId && asset.serviceId === selectedServiceId
        );
        setFilteredAssets(filtered);
      } else {
        setFilteredAssets(serviceAssets.filter(asset => asset.siteId === currentSiteId));
        setCurrentSiteAssets(serviceAssets.filter(asset => asset.siteId === currentSiteId));
      }
    }
  }, [currentSiteId, selectedServiceId]);

  const toggleDimension = (dimensionId: number) => {
    setOpenDimensions(prev => ({
      ...prev,
      [dimensionId]: !prev[dimensionId]
    }));
  };

  const calculateDimensionScore = (assetId: number, dimensionId: number): number => {
    const dimension = drDimensions.find(d => d.id === dimensionId);
    if (!dimension) return 0;
    
    const parameterScores: { score: number, weightage: number }[] = [];
    
    dimension.parameters.forEach(param => {
      if (param.scorable) {
        const paramKey = `${assetId}-${param.id}`;
        const paramData = assessmentData[paramKey];
        
        if (paramData && paramData.score !== undefined) {
          parameterScores.push({
            score: paramData.score,
            weightage: param.weightage || 1
          });
        }
      }
    });
    
    const asset = [...currentSiteAssets, ...filteredAssets].find(a => a.id === assetId);
    const assetCriticality = asset?.criticality;
    
    return calculateWeightedDimensionScore(parameterScores, formulaSettings, assetCriticality);
  };

  const calculateServiceScore = (serviceId: number): number => {
    const serviceSpecificAssets = serviceAssets.filter(
      asset => asset.serviceId === serviceId && asset.siteId === currentSiteId
    );
    
    if (serviceSpecificAssets.length === 0) return 0;
    
    const totalScore = serviceSpecificAssets.reduce((sum, asset) => {
      const assetScore = calculateAssetScore(asset.id);
      return sum + assetScore;
    }, 0);
    
    return totalScore / serviceSpecificAssets.length;
  };

  const calculateAssetScore = (assetId: number): number => {
    let totalDimensionScore = 0;
    let scoredDimensions = 0;
    
    drDimensions.forEach(dimension => {
      const score = calculateDimensionScore(assetId, dimension.id);
      if (score > 0) {
        totalDimensionScore += score;
        scoredDimensions++;
      }
    });
    
    return scoredDimensions > 0 ? totalDimensionScore / scoredDimensions : 0;
  };

  const calculateOverallScore = (assets: Asset[]): number => {
    if (assets.length === 0) return 0;
    
    let totalScores: { [dimId: number]: { score: number, count: number } } = {};
    
    assets.forEach(asset => {
      drDimensions.forEach(dimension => {
        const score = calculateDimensionScore(asset.id, dimension.id);
        if (score > 0) {
          if (!totalScores[dimension.id]) {
            totalScores[dimension.id] = { score: 0, count: 0 };
          }
          totalScores[dimension.id].score += score;
          totalScores[dimension.id].count += 1;
        }
      });
    });
    
    let overallScore = 0;
    let dimensionCount = 0;
    
    Object.values(totalScores).forEach(({ score, count }) => {
      if (count > 0) {
        overallScore += (score / count);
        dimensionCount += 1;
      }
    });
    
    return dimensionCount > 0 ? overallScore / dimensionCount : 0;
  };

  const calculateAssessmentProgress = (): { 
    dimensionProgress: DimensionProgress[],
    totalProgress: number,
    modeProgress: { service: number, asset: number, parameter: number }
  } => {
    const assets = selectedServiceId ? filteredAssets : currentSiteAssets;
    const totalScorableParams = drDimensions.reduce((sum, dim) => {
      return sum + dim.parameters.filter(p => p.scorable).length;
    }, 0);
    
    const dimensionProgress: DimensionProgress[] = drDimensions.map(dimension => {
      const scorableParams = dimension.parameters.filter(p => p.scorable).length;
      let completedParams = 0;
      let totalScore = 0;
      let scoredAssets = 0;
      
      assets.forEach(asset => {
        let assetCompletedParams = 0;
        dimension.parameters.forEach(param => {
          if (param.scorable) {
            const paramKey = `${asset.id}-${param.id}`;
            if (assessmentData[paramKey]?.score) {
              completedParams++;
              assetCompletedParams++;
            }
          }
        });
        
        const dimScore = calculateDimensionScore(asset.id, dimension.id);
        if (dimScore > 0) {
          totalScore += dimScore;
          scoredAssets++;
        }
      });
      
      const normCompletedParams = assets.length > 0 ? completedParams / assets.length : 0;
      const avgDimScore = scoredAssets > 0 ? totalScore / scoredAssets : 0;
      
      return {
        dimensionId: dimension.id,
        dimensionName: dimension.name,
        completedParameters: normCompletedParams,
        totalParameters: scorableParams,
        score: avgDimScore
      };
    });
    
    const totalAssessedParams = dimensionProgress.reduce((sum, dim) => sum + dim.completedParameters, 0);
    const totalParams = dimensionProgress.reduce((sum, dim) => sum + dim.totalParameters, 0);
    const totalProgress = totalParams > 0 ? (totalAssessedParams / totalParams) * 100 : 0;
    
    const modeProgress = {
      service: totalProgress,
      asset: totalProgress,
      parameter: totalProgress
    };
    
    return { dimensionProgress, totalProgress, modeProgress };
  };

  const handleFormulaSettingsUpdate = (newSettings: FormulaSettings) => {
    setFormulaSettings(newSettings);
    toast({
      title: "Formula updated",
      description: "The maturity score calculation formula has been updated."
    });
  };

  const handleScoreChange = (assetId: number, parameterId: number, score: number) => {
    setAssessmentData(prev => ({
      ...prev,
      [`${assetId}-${parameterId}`]: {
        ...prev[`${assetId}-${parameterId}`] || {},
        score,
        lastUpdated: new Date().toISOString()
      }
    }));
  };

  const handleBatchScoreChange = (parameterId: number, assetIds: number[], score: number) => {
    const updates: AssessmentData = {};
    
    assetIds.forEach(assetId => {
      updates[`${assetId}-${parameterId}`] = {
        ...(assessmentData[`${assetId}-${parameterId}`] || {}),
        score,
        lastUpdated: new Date().toISOString()
      };
    });
    
    setAssessmentData(prev => ({
      ...prev,
      ...updates
    }));
    
    toast({
      title: "Batch update applied",
      description: `Updated score for ${assetIds.length} assets`
    });
  };

  const handleBatchValueChange = (parameterId: number, assetIds: number[], value: string) => {
    const updates: AssessmentData = {};
    
    assetIds.forEach(assetId => {
      updates[`${assetId}-${parameterId}`] = {
        ...(assessmentData[`${assetId}-${parameterId}`] || {}),
        value,
        lastUpdated: new Date().toISOString()
      };
    });
    
    setAssessmentData(prev => ({
      ...prev,
      ...updates
    }));
  };

  const handleValueChange = (assetId: number, parameterId: number, value: string) => {
    setAssessmentData(prev => ({
      ...prev,
      [`${assetId}-${parameterId}`]: {
        ...prev[`${assetId}-${parameterId}`] || {},
        value,
        lastUpdated: new Date().toISOString()
      }
    }));
  };

  const getParameterValueDisplay = (assetId: number, parameter: Parameter): React.ReactNode => {
    const paramKey = `${assetId}-${parameter.id}`;
    const paramData = assessmentData[paramKey] || {};
    
    if (paramData.value) {
      if (parameter.type === 'hyperlink') {
        return (
          <a href={paramData.value} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            {paramData.value}
          </a>
        );
      }
      
      return (
        <span>
          {paramData.value}
          {parameter.unit && ` ${parameter.unit}`}
        </span>
      );
    }
    
    return <span className="text-muted-foreground">Not specified</span>;
  };

  const handleParameterDetailsClick = (assetId: number, parameterId: number) => {
    const asset = serviceAssets.find(a => a.id === assetId);
    let parameter: Parameter | null = null;
    
    drDimensions.forEach(d => {
      const param = d.parameters.find(p => p.id === parameterId);
      if (param) parameter = param;
    });
    
    if (asset && parameter) {
      setSelectedAsset(asset);
      setSelectedParameter(parameter);
      
      const paramKey = `${assetId}-${parameterId}`;
      const paramData = assessmentData[paramKey] || {};
      
      setTempScore(paramData.score || null);
      setTempValue(paramData.value || '');
      setTempNotes(paramData.notes || '');
      setDetailDialogOpen(true);
    }
  };

  const handleParameterClick = (asset: Asset, parameter: Parameter) => {
    setSelectedAsset(asset);
    setSelectedParameter(parameter);
    
    const paramKey = `${asset.id}-${parameter.id}`;
    const paramData = assessmentData[paramKey] || {};
    
    setTempScore(paramData.score || null);
    setTempValue(paramData.value || '');
    setTempNotes(paramData.notes || '');
    setDetailDialogOpen(true);
  };

  const handleSaveDetails = () => {
    if (!selectedAsset || !selectedParameter) return;
    
    const paramKey = `${selectedAsset.id}-${selectedParameter.id}`;
    
    setAssessmentData(prev => ({
      ...prev,
      [paramKey]: {
        ...prev[paramKey] || {},
        score: tempScore || 0,
        value: tempValue,
        notes: tempNotes,
        lastUpdated: new Date().toISOString()
      }
    }));
    
    setDetailDialogOpen(false);
    
    toast({
      title: "Details saved",
      description: `Updated details for ${selectedAsset.name} - ${selectedParameter.name}`
    });
  };

  const handleCompleteAssessment = () => {
    if (!currentSiteId || !currentAuditor) {
      toast({
        title: "Error",
        description: "Site and auditor information is required",
        variant: "destructive"
      });
      return;
    }
    
    const assetsToScore = selectedServiceId 
      ? filteredAssets 
      : currentSiteAssets;
      
    const overallScore = calculateOverallScore(assetsToScore).toFixed(1);
    const today = new Date();
    const selectedSite = officeSites.find(site => site.id === currentSiteId);
    
    if (!selectedSite) {
      toast({
        title: "Error",
        description: "Site information not found",
        variant: "destructive"
      });
      return;
    }
    
    const dimensionsData = drDimensions.map(dim => {
      const assets = assetsToScore.map(asset => {
        const parameters = dim.parameters.map(param => {
          const paramKey = `${asset.id}-${param.id}`;
          const paramData = assessmentData[paramKey] || {};
          
          return {
            id: param.id,
            name: param.name,
            score: paramData.score || 0,
            value: paramData.value || '',
            notes: paramData.notes || '',
            lastUpdated: paramData.lastUpdated || ''
          };
        }).filter(param => param.score > 0 || param.value || param.notes);
        
        return {
          id: asset.id,
          name: asset.name,
          type: asset.type,
          score: calculateDimensionScore(asset.id, dim.id),
          parameters: parameters.length > 0 ? parameters : undefined
        };
      }).filter(asset => {
        return asset.parameters && asset.parameters.length > 0;
      });
      
      return {
        name: dim.name,
        score: assetsToScore.reduce((sum, asset) => {
          const score = calculateDimensionScore(asset.id, dim.id);
          return score > 0 ? sum + score : sum;
        }, 0) / assetsToScore.length,
        assets: assets.length > 0 ? assets : undefined
      };
    });
    
    const serviceScores = criticalITServices.map(service => {
      const serviceAssetList = serviceAssets.filter(
        asset => asset.serviceId === service.id && asset.siteId === currentSiteId
      );
      
      const score = serviceAssetList.length > 0
        ? serviceAssetList.reduce((sum, asset) => sum + calculateAssetScore(asset.id), 0) / serviceAssetList.length
        : 0;
        
      return {
        serviceId: service.id,
        serviceName: service.name,
        score
      };
    }).filter(service => service.score > 0);
    
    const newAssessment: PastAssessment = {
      id: (pastAssessments.length + 1).toString(),
      site: selectedSite.name,
      siteId: selectedSite.id,
      date: today,
      score: overallScore,
      assessedBy: currentAuditor,
      assessedOn: format(today, 'MMM d, yyyy'),
      status: 'completed',
      dimensions: dimensionsData,
      services: serviceScores
    };
    
    setPastAssessments([...pastAssessments, newAssessment]);
    setShowAssessment(false);
    setShowSetup(false);
    setHasActiveAssessment(false);
    
    toast({
      title: "Assessment completed",
      description: `Overall maturity score for ${selectedSite.name}: ${overallScore}/5.0`,
      variant: "default"
    });
  };

  const handleViewDetails = (assessmentId: string) => {
    const assessment = pastAssessments.find(a => a.id === assessmentId);
    if (assessment) {
      setSelectedAssessment(assessment);
      setShowAssessment(false);
      setShowSetup(false);
    }
  };

  const handleContinueAssessment = (assessmentId: string) => {
    toast({
      title: "Continue Assessment",
      description: "This feature would load the existing assessment data",
    });
  };

  const handleStartNewAssessment = () => {
    setAssessmentData({});
    setShowSetup(true);
    setShowAssessment(false);
    setIsCreatingNewAssessment(true);
    setSelectedAssessment(null);
    setShowFileHandler(false);
    setSelectedServiceId(null);
    setShowScoringGuidance(false);
  };

  const handleBackToPastAssessments = () => {
    setShowAssessment(false);
    setShowSetup(false);
    setSelectedAssessment(null);
    setShowFileHandler(false);
    setSelectedServiceId(null);
    setShowScoringGuidance(false);
  };

  const handleStartAssessment = (siteId: number, auditorName: string) => {
    setCurrentSiteId(siteId);
    setCurrentAuditor(auditorName);
    setCurrentSiteAssets(serviceAssets.filter(asset => asset.siteId === siteId));
    setShowSetup(false);
    setShowAssessment(true);
    setShowFileHandler(false);
    setShowScoringGuidance(false);
    setHasActiveAssessment(true);
  };

  const handleExportAssessment = () => {
    if (!currentSiteId || Object.keys(assessmentData).length === 0) {
      toast({
        title: "Cannot export",
        description: "No assessment data to export",
        variant: "destructive"
      });
      return;
    }

    const site = officeSites.find(s => s.id === currentSiteId);
    
    const excelData: any[] = [];
    
    excelData.push({
      SiteId: currentSiteId,
      SiteName: site?.name,
      Auditor: currentAuditor,
      ExportDate: new Date().toISOString()
    });
    
    Object.entries(assessmentData).forEach(([key, value]) => {
      const [assetId, parameterId] = key.split('-').map(Number);
      const asset = currentSiteAssets.find(a => a.id === assetId);
      
      let parameter: Parameter | undefined;
      drDimensions.forEach(dim => {
        const param = dim.parameters.find(p => p.id === parameterId);
        if (param) parameter = param;
      });
      
      if (asset && parameter) {
        excelData.push({
          AssetId: assetId,
          AssetName: asset.name,
          AssetType: asset.type,
          ParameterId: parameterId,
          ParameterName: parameter.name,
          Score: value.score,
          Value: value.value || '',
          Notes: value.notes || '',
          LastUpdated: value.lastUpdated
        });
      }
    });
    
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Assessment Data');
    
    const fileName = `assessment-${site?.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    toast({
      title: "Assessment exported",
      description: "The assessment data has been exported as an Excel file"
    });
  };

  const handleShowFileHandler = () => {
    setShowFileHandler(true);
    setShowAssessment(false);
    setShowSetup(false);
    setShowScoringGuidance(false);
  };

  const handleImportAssessment = (importedData: any) => {
    try {
      if (!importedData.siteId || !importedData.data) {
        throw new Error("Invalid assessment data format");
      }

      setCurrentSiteId(importedData.siteId);
      setCurrentAuditor(importedData.auditor || "Imported");
      setCurrentSiteAssets(serviceAssets.filter(asset => asset.siteId === importedData.siteId));
      setAssessmentData(importedData.data);
      setShowAssessment(true);
      setShowFileHandler(false);

      toast({
        title: "Assessment imported",
        description: "The assessment data has been imported successfully"
      });
    } catch (error) {
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    }
  };

  const handleDownloadTemplate = () => {
    const siteId = 1;
    const assets = serviceAssets.filter(asset => asset.siteId === siteId);
    
    const templateData: any[] = [];
    
    templateData.push({
      SiteId: siteId,
      SiteName: "Template",
      Auditor: "",
      ExportDate: new Date().toISOString()
    });
    
    assets.forEach(asset => {
      drDimensions.forEach(dimension => {
        dimension.parameters.forEach(param => {
          templateData.push({
            AssetId: asset.id,
            AssetName: asset.name,
            AssetType: asset.type,
            ParameterId: param.id,
            ParameterName: param.name,
            DimensionName: dimension.name,
            Score: '',
            Value: '',
            Notes: ''
          });
        });
      });
    });
    
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Assessment Template');
    
    XLSX.writeFile(workbook, 'assessment-template.xlsx');

    toast({
      title: "Template downloaded",
      description: "The assessment template has been downloaded as an Excel file"
    });
  };

  const handleShowScoringGuidance = () => {
    setShowScoringGuidance(true);
    setShowAssessment(false);
    setShowSetup(false);
    setShowFileHandler(false);
  };

  const handleUpdateScoringGuidance = (guidance: DimensionGuidance[]) => {
    setScoringGuidance(guidance);
    toast({
      title: "Scoring guidance updated",
      description: "The scoring guidance has been updated successfully"
    });
  };

  const handleEditGuidance = () => {
    setShowScoringGuidance(true);
    setShowAssessment(false);
    setShowSetup(false);
    setShowFileHandler(false);
  };

  const handleReturnToAssessment = () => {
    if (hasActiveAssessment && currentSiteId) {
      setShowAssessment(true);
      setShowSetup(false);
      setSelectedAssessment(null);
      setShowFileHandler(false);
      setShowScoringGuidance(false);
    } else {
      handleStartNewAssessment();
    }
  };

  const { dimensionProgress, totalProgress, modeProgress } = calculateAssessmentProgress();

  const getSelectedDimension = (): Dimension | null => {
    return drDimensions.find(d => d.id === selectedDimensionId) || null;
  };

  const getSelectedParameter = (): Parameter | null => {
    let parameter: Parameter | null = null;
    drDimensions.forEach(dimension => {
      const found = dimension.parameters.find(p => p.id === selectedParameterId);
      if (found) parameter = found;
    });
    return parameter;
  };

  useEffect(() => {
    if (showAssessment && currentSiteId) {
      setHasActiveAssessment(true);
    }
  }, [showAssessment, currentSiteId]);

  return (
    <MainLayout>
      <PageTitle 
        title="Maturity Assessment" 
        description="Assess and track disaster recovery maturity across critical IT assets."
        actions={
          showAssessment ? (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleEditGuidance}
                className="gap-2"
              >
                <Settings className="h-4 w-4" />
                Scoring Guidance
              </Button>
              <FormulaCustomization 
                formulaSettings={formulaSettings} 
                onUpdateFormulaSettings={handleFormulaSettingsUpdate} 
              />
              <Button variant="outline" onClick={handleExportAssessment} className="gap-2">
                <Download className="h-4 w-4" />
                Export Assessment
              </Button>
              <Button onClick={handleCompleteAssessment} className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Complete Assessment
              </Button>
            </div>
          ) : (
            !selectedAssessment && !showSetup && !showFileHandler && !showScoringGuidance && (
              <div className="flex gap-2">
                {hasActiveAssessment && (
                  <Button variant="outline" onClick={handleReturnToAssessment} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Return to Active Assessment
                  </Button>
                )}
                <Button variant="outline" onClick={handleShowScoringGuidance} className="gap-2">
                  <Settings className="h-4 w-4" />
                  Scoring Guidance
                </Button>
                <Button variant="outline" onClick={handleShowFileHandler} className="gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  Import/Export
                </Button>
                <Button onClick={handleStartNewAssessment}>
                  Start New Assessment
                </Button>
              </div>
            )
          )
        }
      />
      
      {showScoringGuidance ? (
        <>
          <div className="mb-4">
            <Button 
              variant="outline" 
              onClick={handleBackToPastAssessments}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Assessment List
            </Button>
          </div>
          <DRScoringGuidance 
            dimensions={drDimensions}
            scoringGuidance={scoringGuidance}
            onUpdateGuidance={handleUpdateScoringGuidance}
          />
        </>
      ) : showFileHandler ? (
        <AssessmentFileHandler
          onImport={handleImportAssessment}
          onDownloadTemplate={handleDownloadTemplate}
          onBack={handleBackToPastAssessments}
        />
      ) : showSetup ? (
        <AssessmentSetup 
          sites={officeSites} 
          onStartAssessment={handleStartAssessment} 
        />
      ) : showAssessment ? (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                Assessment for {officeSites.find(s => s.id === currentSiteId)?.name || 'Office Site'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-4">
                <p>Auditor: {currentAuditor}</p>
                <p>Date: {format(new Date(), 'MMM d, yyyy')}</p>
              </div>
              
              <AssessmentModeSelector
                selectedMode={assessmentMode}
                onModeChange={setAssessmentMode}
                progress={modeProgress}
              />
              
              <AssessmentProgressTracker
                dimensions={drDimensions}
                dimensionProgress={dimensionProgress}
                totalProgress={totalProgress}
              />
              
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="w-full md:w-1/2">
                  <label className="text-sm font-medium">Filter by Service</label>
                  <Select 
                    value={selectedServiceId ? selectedServiceId.toString() : "all"}
                    onValueChange={(value) => setSelectedServiceId(value === "all" ? null : parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All services" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All services</SelectItem>
                      {criticalITServices.map(service => (
                        <SelectItem key={service.id} value={service.id.toString()}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {assessmentMode === 'parameter' ? (
                <div className="space-y-6">
                  {!selectedParameterId ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Select a Parameter to Assess</h3>
                      
                      <Tabs defaultValue={drDimensions[0]?.id.toString()} onValueChange={(val) => setSelectedDimensionId(parseInt(val))}>
                        <TabsList className="mb-4 flex flex-wrap h-auto">
                          {drDimensions.map(dimension => (
                            <TabsTrigger 
                              key={dimension.id} 
                              value={dimension.id.toString()}
                              className="mb-1"
                            >
                              {dimension.name}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                        
                        {drDimensions.map(dimension => (
                          <TabsContent key={dimension.id} value={dimension.id.toString()}>
                            <Card>
                              <CardHeader>
                                <CardTitle>{dimension.name}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {dimension.parameters.filter(p => p.scorable).map(parameter => {
                                    const isComplete = currentSiteAssets.every(asset => {
                                      const paramKey = `${asset.id}-${parameter.id}`;
                                      return assessmentData[paramKey]?.score !== undefined;
                                    });
                                    
                                    return (
                                      <Button
                                        key={parameter.id}
                                        variant={isComplete ? "default" : "outline"}
                                        className={`h-auto py-4 px-4 justify-start flex-col items-start space-y-2 ${
                                          isComplete ? 'bg-primary/10 hover:bg-primary/20' : ''
                                        }`}
                                        onClick={() => {
                                          setSelectedParameterId(parameter.id);
                                          setSelectedDimensionId(dimension.id);
                                        }}
                                      >
                                        <div className="text-left font-medium">{parameter.name}</div>
                                        <div className="text-xs text-muted-foreground text-left">
                                          {parameter.description.substring(0, 80)}
                                          {parameter.description.length > 80 ? '...' : ''}
                                        </div>
                                        {parameter.weightage && (
                                          <Badge variant="secondary" className="mr-1">
                                            Weightage: {parameter.weightage}%
                                          </Badge>
                                        )}
                                        {isComplete && (
                                          <Badge variant="default" className="bg-primary text-primary-foreground">
                                            Completed
                                          </Badge>
                                        )}
                                      </Button>
                                    );
                                  })}
                                </div>
                              </CardContent>
                            </Card>
                          </TabsContent>
                        ))}
                      </Tabs>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">
                          Assessing Parameter: {getSelectedParameter()?.name}
                        </h3>
                        <Button 
                          variant="outline" 
                          onClick={() => setSelectedParameterId(null)}
                        >
                          Select Different Parameter
                        </Button>
                      </div>
                      
                      {selectedParameterId && selectedDimensionId && (
                        <ParameterBatchAssessment
                          dimension={getSelectedDimension()!}
                          parameter={getSelectedParameter()!}
                          assets={selectedServiceId ? filteredAssets : currentSiteAssets}
                          onBatchScore={handleBatchScoreChange}
                          onBatchValueChange={handleBatchValueChange}
                          assessmentData={assessmentData}
                          scoringGuidance={scoringGuidance}
                        />
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {drDimensions.map(dimension => (
                    <DimensionCard
                      key={dimension.id}
                      dimension={dimension}
                      assets={selectedServiceId ? filteredAssets : currentSiteAssets}
                      assessmentData={assessmentData}
                      onScoreChange={handleScoreChange}
                      onParameterClick={handleParameterClick}
                      calculateDimensionScore={calculateDimensionScore}
                      getParameterValueDisplay={getParameterValueDisplay}
                      isOpen={openDimensions[dimension.id]}
                      onToggle={() => toggleDimension(dimension.id)}
                      onValueChange={handleValueChange}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <AssessmentDetailDialog
            open={detailDialogOpen}
            onClose={() => setDetailDialogOpen(false)}
            asset={selectedAsset}
            parameter={selectedParameter}
            score={tempScore}
            value={tempValue}
            notes={tempNotes}
            onScoreChange={setTempScore}
            onValueChange={setTempValue}
            onNotesChange={setTempNotes}
            onSave={handleSaveDetails}
          />
        </>
      ) : selectedAssessment ? (
        <>
          <div className="mb-4">
            <Button 
              variant="outline" 
              onClick={handleBackToPastAssessments}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Assessment List
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Assessment Details: {selectedAssessment.site}</CardTitle>
            </CardHeader>
            <CardContent>
              <CompactAssessmentView
                assessment={selectedAssessment}
              />
            </CardContent>
          </Card>
        </>
      ) : (
        <PastAssessmentsList
          assessments={pastAssessments}
          onViewDetails={handleViewDetails}
          onContinueAssessment={handleContinueAssessment}
        />
      )}
    </MainLayout>
  );
};

export default MaturityAssessment;
