
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageTitle } from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from '@/hooks/use-toast';

import { 
  Plus, 
  Upload, 
  ChevronRight, 
  Users, 
  UserCog, 
  Timer, 
  RefreshCw, 
  PackageOpen, 
  Bell, 
  LineChart, 
  Wrench, 
  TestTube,
  SlidersHorizontal,
  Edit,
  Trash2,
  Check
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

// Define types for our parameters and dimensions to fix type errors
type ParameterType = 'text' | 'number' | 'percentage' | 'select' | 'link' | 'counter';

interface Parameter {
  id: number;
  name: string;
  description: string;
  type: ParameterType;
  options?: string[];
  unit?: string;
  scorable?: boolean;
  weightage?: number;
}

// Type for the new parameter state
interface NewParameterState {
  name: string;
  description: string;
  type: ParameterType;
  options: string;
  unit: string;
  scorable: boolean;
  weightage: number;
}

// Interface for the parameter being edited
interface EditingParameter {
  id: number;
  name: string;
  description: string;
  type: ParameterType;
  options?: string[] | string;
  unit?: string;
  scorable?: boolean;
  weightage?: number;
}

interface DimensionType {
  id: number;
  name: string;
  icon: LucideIcon;
  description: string;
  parameters: Parameter[];
  scorable?: boolean;
}

// Mock data for DR dimensions and parameters
const initialDrDimensions: DimensionType[] = [
  { 
    id: 1, 
    name: 'Internal Support', 
    icon: Users,
    description: 'Parameters related to internal support capabilities and personnel',
    scorable: true,
    parameters: [
      { id: 101, name: 'Primary support POC', description: 'Primary point of contact for support', type: 'text', scorable: true, weightage: 25 },
      { id: 102, name: 'Secondary support - backup POC', description: 'Backup point of contact for support', type: 'text', scorable: true, weightage: 25 },
      { id: 103, name: 'Escalation POC', description: 'Clear escalation procedure', type: 'text', scorable: true, weightage: 20 },
      { id: 104, name: 'Shared Services Support during business hours', description: 'Support availability during business hours', type: 'select', options: ['Remote L1 support', 'Remote L2 support', 'Not Available'], scorable: true, weightage: 10 },
      { id: 105, name: 'Out of hours support', description: 'Support availability outside business hours', type: 'select', options: ['Onsite L1 Support', 'Onsite L2 Support', 'Remote L1 support', 'Remote L2 support', 'Not Available'], scorable: true, weightage: 7.5 },
      { id: 106, name: 'OOB (Out of Band) Management available', description: 'Out of band management availability', type: 'select', options: ['Yes', 'No', 'Not Applicable'], scorable: true, weightage: 10 },
      { id: 107, name: 'OOO roster for key personnel available', description: 'Out of office roster availability', type: 'select', options: ['Yes', 'No', 'Not Applicable'], scorable: true, weightage: 7.5 },
    ]
  },
  { 
    id: 2, 
    name: 'External Support', 
    icon: UserCog,
    description: 'Parameters related to third-party vendors and external support',
    scorable: true,
    parameters: [
      { id: 201, name: '3rd party Managed Services support in place', description: 'Third party managed services support', type: 'select', options: ['Yes', 'No', 'Not Applicable'], scorable: true, weightage: 40 },
      { id: 202, name: 'Support duration', description: 'Duration of support in years', type: 'counter', unit: 'years', scorable: false },
      { id: 203, name: '3rd Party Managed Services support vendor', description: 'Name of the vendor', type: 'text', scorable: false },
      { id: 204, name: '3rd Party Managed Service support primary contact', description: 'Primary contact at vendor', type: 'text', scorable: false },
      { id: 205, name: '3rd Party support secondary contact', description: 'Secondary contact at vendor', type: 'text', scorable: false },
      { id: 206, name: '3rd party Out of hours support available', description: 'Out of hours vendor support', type: 'select', options: ['Yes', 'No', 'Not Applicable'], scorable: true, weightage: 20 },
      { id: 207, name: 'Is EOL Warranty tracked (per CI)?', description: 'End of life warranty tracking', type: 'select', options: ['Yes', 'No', 'Not Applicable'], scorable: true, weightage: 40 },
    ]
  },
  { 
    id: 3, 
    name: 'Support Metrics', 
    icon: Timer,
    description: 'Parameters related to support metrics and SLAs',
    scorable: true,
    parameters: [
      { id: 301, name: 'Asset Uptime', description: 'Percentage of time asset is operational', type: 'percentage', scorable: true, weightage: 15 },
      { id: 302, name: 'RTO Recovery Time Objective', description: 'Target time for recovery', type: 'number', unit: 'minutes', scorable: true, weightage: 15 },
      { id: 303, name: 'RPO Recovery Point Objective', description: 'Maximum tolerable data loss period', type: 'number', unit: 'minutes', scorable: true, weightage: 15 },
      { id: 304, name: 'Response SLA - P0', description: 'Service level agreement for P0 response', type: 'percentage', scorable: true, weightage: 15 },
      { id: 305, name: 'Response SLA - P1', description: 'Service level agreement for P1 response', type: 'percentage', scorable: true, weightage: 15 },
      { id: 306, name: 'Resolution SLA - P0', description: 'Service level agreement for P0 resolution', type: 'percentage', scorable: true, weightage: 5 },
      { id: 307, name: 'Resolution SLA - P1', description: 'Service level agreement for P1 resolution', type: 'percentage', scorable: true, weightage: 5 },
      { id: 308, name: 'RMA - Return Material authorisation available', description: 'RMA availability', type: 'select', options: ['Yes', 'No', 'Not Applicable'], scorable: true, weightage: 15 },
    ]
  },
  { 
    id: 4, 
    name: 'Redundancy', 
    icon: RefreshCw,
    description: 'Parameters related to system redundancy and failover',
    scorable: true,
    parameters: [
      { id: 401, name: 'Primary device', description: 'State of primary device', type: 'select', options: ['Active', 'Hot Standby', 'Cold Standby', 'No', 'Not Applicable'], scorable: false },
      { id: 402, name: 'Secondary backup', description: 'State of secondary device', type: 'select', options: ['Active', 'Hot Standby', 'Cold Standby', 'No', 'Not Applicable'], scorable: true, weightage: 100 },
    ]
  },
  { 
    id: 5, 
    name: 'Inventory Management', 
    icon: PackageOpen,
    description: 'Parameters related to spare parts and inventory',
    scorable: true,
    parameters: [
      { id: 501, name: 'Spares maintained onsite', description: 'Availability of spare parts onsite', type: 'select', options: ['Yes', 'No', 'Not Applicable'], scorable: true, weightage: 50 },
      { id: 502, name: 'Spares Management Policy', description: 'Link to spares management policy', type: 'link', scorable: true, weightage: 50 },
    ]
  },
  { 
    id: 6, 
    name: 'Alerting', 
    icon: Bell,
    description: 'Parameters related to alerting and notifications',
    scorable: true,
    parameters: [
      { id: 601, name: 'Alerting available for all CIs', description: 'Alerting coverage for configuration items', type: 'select', options: ['Yes', 'Available for some CIs', 'No', 'Not Applicable'], scorable: true, weightage: 100 },
      { id: 602, name: 'Alerting tool', description: 'Tool used for alerting', type: 'text', scorable: false },
    ]
  },
  { 
    id: 7, 
    name: 'Monitoring', 
    icon: LineChart,
    description: 'Parameters related to system monitoring',
    scorable: true,
    parameters: [
      { id: 701, name: 'Realtime monitoring available for all CIs', description: 'Realtime monitoring coverage', type: 'select', options: ['Yes', 'Available for some CIs', 'No', 'Not Applicable'], scorable: true, weightage: 50 },
      { id: 702, name: 'Realtime monitoring tool', description: 'Tool used for realtime monitoring', type: 'text', scorable: false },
      { id: 703, name: 'Trend Analysis', description: 'Trend analysis capabilities', type: 'select', options: ['Yes', 'Available for some CIs', 'No', 'Not Applicable'], scorable: true, weightage: 50 },
      { id: 704, name: 'Trend Analysis tool', description: 'Tool used for trend analysis', type: 'text', scorable: false },
    ]
  },
  { 
    id: 8, 
    name: 'Maintenance', 
    icon: Wrench,
    description: 'Parameters related to system maintenance',
    scorable: true,
    parameters: [
      { id: 801, name: 'Asset covered in Network Architecture Map?', description: 'Coverage in network architecture documentation', type: 'select', options: ['Yes all CIs covered', 'Some CIs covered', 'No', 'Not Applicable'], scorable: true, weightage: 30 },
      { id: 802, name: 'Network Architecture Map Link', description: 'Link to network architecture map', type: 'link', scorable: false },
      { id: 803, name: 'Maintenance SOPs available?', description: 'Standard operating procedures for maintenance', type: 'select', options: ['Yes', 'No', 'Not Applicable'], scorable: true, weightage: 15 },
      { id: 804, name: 'Maintenance SOP Link', description: 'Link to maintenance SOP', type: 'link', scorable: false },
      { id: 805, name: 'Hardware Maintenance Schedule', description: 'Schedule for hardware maintenance', type: 'link', scorable: true, weightage: 15 },
      { id: 806, name: 'Patching SOP available?', description: 'Standard operating procedures for patching', type: 'select', options: ['Yes', 'No', 'Not Applicable'], scorable: true, weightage: 20 },
      { id: 807, name: 'Patching SOP link', description: 'Link to patching SOP', type: 'link', scorable: false },
      { id: 808, name: 'Patching Schedule', description: 'Schedule for patching', type: 'link', scorable: true, weightage: 20 },
    ]
  },
  { 
    id: 9, 
    name: 'Testing', 
    icon: TestTube,
    description: 'Parameters related to testing procedures',
    scorable: true,
    parameters: [
      { id: 901, name: 'Failover testing schedule available?', description: 'Schedule for failover testing', type: 'select', options: ['Yes', 'No', 'Not Applicable'], scorable: true, weightage: 50 },
      { id: 902, name: 'Failover testing schedule', description: 'Link to failover testing schedule', type: 'link', scorable: false },
      { id: 903, name: 'Failover SOP available, including scenario modeling?', description: 'Standard operating procedures for failover', type: 'select', options: ['Yes', 'No', 'Not Applicable'], scorable: true, weightage: 50 },
      { id: 904, name: 'Failover SOP link', description: 'Link to failover SOP', type: 'link', scorable: false },
    ]
  },
];

const DRParameters = () => {
  const [drDimensions, setDrDimensions] = useState<DimensionType[]>(initialDrDimensions);
  const [selectedDimension, setSelectedDimension] = useState<number | null>(null);
  const [newDimension, setNewDimension] = useState({ name: '', description: '' });
  const [newParameter, setNewParameter] = useState<NewParameterState>({ 
    name: '', 
    description: '', 
    type: 'text', 
    options: '', 
    unit: '',
    scorable: false,
    weightage: 0
  });
  const [editingDimension, setEditingDimension] = useState<{ id: number, name: string, description: string } | null>(null);
  const [editingParameter, setEditingParameter] = useState<EditingParameter | null>(null);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [deletingParameter, setDeletingParameter] = useState<{ dimensionId: number, parameterId: number } | null>(null);
  const [deletingDimension, setDeletingDimension] = useState<number | null>(null);
  
  const selectedDimensionData = selectedDimension 
    ? drDimensions.find(dim => dim.id === selectedDimension) 
    : null;
  
  const handleAddDimension = () => {
    if (!newDimension.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Dimension name is required",
        variant: "destructive"
      });
      return;
    }
    
    const newId = Math.max(0, ...drDimensions.map(d => d.id)) + 1;
    const newDim: DimensionType = {
      id: newId,
      name: newDimension.name.trim(),
      description: newDimension.description.trim(),
      icon: SlidersHorizontal,
      parameters: []
    };
    
    setDrDimensions([...drDimensions, newDim]);
    setNewDimension({ name: '', description: '' });
    setSelectedDimension(newId);
    
    toast({
      title: "Success",
      description: "Dimension added successfully",
    });
  };
  
  const handleEditDimension = () => {
    if (!editingDimension) return;
    
    if (!editingDimension.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Dimension name is required",
        variant: "destructive"
      });
      return;
    }
    
    setDrDimensions(drDimensions.map(dim => 
      dim.id === editingDimension.id 
        ? { ...dim, name: editingDimension.name, description: editingDimension.description }
        : dim
    ));
    
    setEditingDimension(null);
    toast({
      title: "Success",
      description: "Dimension updated successfully",
    });
  };
  
  const handleDeleteDimension = () => {
    if (deletingDimension === null) return;
    
    setDrDimensions(drDimensions.filter(dim => dim.id !== deletingDimension));
    setDeletingDimension(null);
    
    if (selectedDimension === deletingDimension) {
      setSelectedDimension(null);
    }
    
    toast({
      title: "Success",
      description: "Dimension deleted successfully",
    });
  };
  
  const handleAddParameter = () => {
    if (!selectedDimension) return;
    
    if (!newParameter.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Parameter name is required",
        variant: "destructive"
      });
      return;
    }
    
    const dimension = drDimensions.find(d => d.id === selectedDimension);
    if (!dimension) return;
    
    const parameterId = Math.max(0, ...dimension.parameters.map(p => p.id), 100 * selectedDimension) + 1;
    
    // Parse options if type is select
    let options: string[] | undefined = undefined;
    if (newParameter.type === 'select' && newParameter.options.trim()) {
      options = newParameter.options.split(',').map(o => o.trim());
    }
    
    const newParam: Parameter = {
      id: parameterId,
      name: newParameter.name.trim(),
      description: newParameter.description.trim(),
      type: newParameter.type,
      scorable: newParameter.scorable,
      weightage: newParameter.scorable ? newParameter.weightage : undefined,
      ...(newParameter.type === 'select' && options ? { options } : {}),
      ...(newParameter.type === 'number' || newParameter.type === 'percentage' || newParameter.type === 'counter' ? 
          (newParameter.unit ? { unit: newParameter.unit } : {}) : {})
    };
    
    setDrDimensions(drDimensions.map(dim => 
      dim.id === selectedDimension 
        ? { ...dim, parameters: [...dim.parameters, newParam] }
        : dim
    ));
    
    setNewParameter({ 
      name: '', 
      description: '', 
      type: 'text', 
      options: '', 
      unit: '',
      scorable: false,
      weightage: 0
    });
    
    toast({
      title: "Success",
      description: "Parameter added successfully",
    });
  };
  
  const handleEditParameter = () => {
    if (!editingParameter || !selectedDimension) return;
    
    if (!editingParameter.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Parameter name is required",
        variant: "destructive"
      });
      return;
    }
    
    // Parse options if type is select
    let options: string[] | undefined = undefined;
    if (editingParameter.type === 'select') {
      // Check if options is a string (from the form) or already an array
      if (typeof editingParameter.options === 'string') {
        options = editingParameter.options.split(',').map(o => o.trim());
      } else if (Array.isArray(editingParameter.options)) {
        options = editingParameter.options;
      }
    }
    
    const updatedParam: Parameter = {
      id: editingParameter.id,
      name: editingParameter.name.trim(),
      description: editingParameter.description.trim(),
      type: editingParameter.type,
      scorable: editingParameter.scorable,
      weightage: editingParameter.scorable ? editingParameter.weightage : undefined,
      ...(editingParameter.type === 'select' ? { options } : {}),
      ...(editingParameter.type === 'number' || editingParameter.type === 'percentage' || editingParameter.type === 'counter' ? 
          (editingParameter.unit ? { unit: editingParameter.unit } : {}) : {})
    };
    
    setDrDimensions(drDimensions.map(dim => 
      dim.id === selectedDimension 
        ? { 
            ...dim, 
            parameters: dim.parameters.map(p => 
              p.id === editingParameter.id ? updatedParam : p
            ) 
          }
        : dim
    ));
    
    setEditingParameter(null);
    
    toast({
      title: "Success",
      description: "Parameter updated successfully",
    });
  };
  
  const handleDeleteParameter = () => {
    if (!deletingParameter) return;
    
    const { dimensionId, parameterId } = deletingParameter;
    
    setDrDimensions(drDimensions.map(dim => 
      dim.id === dimensionId 
        ? { ...dim, parameters: dim.parameters.filter(p => p.id !== parameterId) }
        : dim
    ));
    
    setDeletingParameter(null);
    
    toast({
      title: "Success",
      description: "Parameter deleted successfully",
    });
  };
  
  const handleBulkUpload = () => {
    // In a real implementation, this would process file upload
    toast({
      title: "Bulk Upload",
      description: "Bulk upload functionality would be implemented here",
    });
    setBulkUploadOpen(false);
  };

  const handleEditParameterChange = (key: keyof EditingParameter, value: string | boolean | number) => {
    if (!editingParameter) return;
    
    if (key === 'options' && editingParameter.type === 'select' && typeof value === 'string') {
      // For options, we need to handle it differently because it's a string in the form but string[] in the type
      setEditingParameter({
        ...editingParameter,
        options: value // Store as string during editing
      });
    } else if (key === 'scorable' && typeof value === 'boolean') {
      setEditingParameter({
        ...editingParameter,
        scorable: value,
        // If not scorable, remove weightage
        ...(value === false ? { weightage: undefined } : {})
      });
    } else if (key === 'weightage' && typeof value === 'number') {
      setEditingParameter({
        ...editingParameter,
        weightage: value
      });
    } else if (typeof value === 'string') {
      setEditingParameter({
        ...editingParameter,
        [key]: value
      } as EditingParameter);
    }
  };
  
  return (
    <MainLayout>
      <PageTitle 
        title="DR Parameters"
        description="Define and manage disaster recovery dimensions and parameters"
        actions={
          <>
            <Dialog open={bulkUploadOpen} onOpenChange={setBulkUploadOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-1">
                  <Upload className="h-4 w-4" />
                  Bulk Upload
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Bulk Upload Dimensions & Parameters</DialogTitle>
                  <DialogDescription>
                    Upload a CSV file containing dimensions and parameters.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="py-4">
                  <Label htmlFor="file-upload">Upload File</Label>
                  <Input id="file-upload" type="file" className="mt-2" />
                  
                  <div className="mt-4 text-sm">
                    <p className="font-medium">File Format Requirements:</p>
                    <ul className="list-disc pl-5 mt-2 text-muted-foreground">
                      <li>CSV file with headers</li>
                      <li>Required columns: Dimension, Parameter, Description, Type</li>
                      <li>Optional columns: Options (comma-separated), Unit</li>
                    </ul>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setBulkUploadOpen(false)}>Cancel</Button>
                  <Button onClick={handleBulkUpload}>Upload</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-1">
                  <Plus className="h-4 w-4" />
                  Add Dimension
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Dimension</DialogTitle>
                  <DialogDescription>
                    Define a new disaster recovery dimension.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="dimension-name">Dimension Name *</Label>
                    <Input 
                      id="dimension-name" 
                      placeholder="Enter dimension name" 
                      value={newDimension.name}
                      onChange={(e) => setNewDimension({...newDimension, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dimension-description">Description</Label>
                    <Textarea 
                      id="dimension-description" 
                      placeholder="Enter dimension description" 
                      value={newDimension.description}
                      onChange={(e) => setNewDimension({...newDimension, description: e.target.value})}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setNewDimension({ name: '', description: '' })}>Cancel</Button>
                  <Button onClick={handleAddDimension}>Add Dimension</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        }
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="shadow-sm h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">DR Dimensions</CardTitle>
              <CardDescription>
                Define dimensions and parameters for disaster recovery assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="px-4 pb-4">
                  {drDimensions.map((dimension) => (
                    <div 
                      key={dimension.id}
                      className={`p-3 border rounded-md mb-2 cursor-pointer transition-all ${
                        selectedDimension === dimension.id 
                          ? 'bg-primary/10 border-primary/30'
                          : 'hover:bg-accent border-border'
                      }`}
                      onClick={() => setSelectedDimension(dimension.id)}
                    >
                      <div className="flex items-center">
                        <div className={`p-2 mr-3 rounded-md ${
                          selectedDimension === dimension.id
                            ? 'bg-primary/20'
                            : 'bg-muted'
                        }`}>
                          {dimension.icon ? (
                            <dimension.icon className={`h-5 w-5 ${
                              selectedDimension === dimension.id
                                ? 'text-primary'
                                : 'text-muted-foreground'
                            }`} />
                          ) : (
                            <SlidersHorizontal className={`h-5 w-5 ${
                              selectedDimension === dimension.id
                                ? 'text-primary'
                                : 'text-muted-foreground'
                            }`} />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {dimension.name}
                            {dimension.scorable && (
                              <span className="ml-2 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                                Scorable
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {dimension.parameters.length} parameters
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                  
                  {drDimensions.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <SlidersHorizontal className="h-10 w-10 mx-auto mb-3 opacity-40" />
                      <p>No dimensions defined yet</p>
                      <p className="text-sm mt-1">Click "Add Dimension" to get started</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          {selectedDimensionData ? (
            <Card className="shadow-sm">
              <CardHeader className="pb-3 flex flex-row items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    {selectedDimensionData.icon && (
                      <selectedDimensionData.icon className="h-5 w-5 text-primary" />
                    )}
                    <CardTitle className="text-lg">{selectedDimensionData.name}</CardTitle>
                    {selectedDimensionData.scorable && (
                      <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                        Scorable
                      </span>
                    )}
                  </div>
                  <CardDescription className="mt-1">
                    {selectedDimensionData.description}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => {
                        if (selectedDimensionData) {
                          setEditingDimension({
                            id: selectedDimensionData.id,
                            name: selectedDimensionData.name,
                            description: selectedDimensionData.description
                          });
                        }
                      }}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit Dimension
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Dimension</DialogTitle>
                        <DialogDescription>
                          Update the dimension details.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-dimension-name">Dimension Name *</Label>
                          <Input 
                            id="edit-dimension-name" 
                            placeholder="Enter dimension name" 
                            value={editingDimension?.name || ''}
                            onChange={(e) => setEditingDimension(prev => prev ? {...prev, name: e.target.value} : null)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="edit-dimension-description">Description</Label>
                          <Textarea 
                            id="edit-dimension-description" 
                            placeholder="Enter dimension description" 
                            value={editingDimension?.description || ''}
                            onChange={(e) => setEditingDimension(prev => prev ? {...prev, description: e.target.value} : null)}
                          />
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingDimension(null)}>Cancel</Button>
                        <Button onClick={handleEditDimension}>Save Changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" onClick={() => setDeletingDimension(selectedDimensionData.id)}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Dimension</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this dimension? This action cannot be undone
                          and will also delete all parameters associated with this dimension.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => handleDeleteDimension()}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Parameter
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Parameter</DialogTitle>
                        <DialogDescription>
                          Add a new parameter to the "{selectedDimensionData.name}" dimension.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="parameter-name">Parameter Name *</Label>
                          <Input 
                            id="parameter-name" 
                            placeholder="Enter parameter name" 
                            value={newParameter.name}
                            onChange={(e) => setNewParameter({...newParameter, name: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="parameter-description">Description</Label>
                          <Textarea 
                            id="parameter-description" 
                            placeholder="Enter parameter description" 
                            value={newParameter.description}
                            onChange={(e) => setNewParameter({...newParameter, description: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="parameter-type">Parameter Type *</Label>
                          <Select 
                            value={newParameter.type} 
                            onValueChange={(value: ParameterType) => setNewParameter({...newParameter, type: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select parameter type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="number">Number</SelectItem>
                              <SelectItem value="percentage">Percentage</SelectItem>
                              <SelectItem value="select">Dropdown</SelectItem>
                              <SelectItem value="link">URL</SelectItem>
                              <SelectItem value="counter">Counter</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {newParameter.type === 'select' && (
                          <div className="space-y-2">
                            <Label htmlFor="parameter-options">Options (comma-separated)</Label>
                            <Textarea 
                              id="parameter-options" 
                              placeholder="Option 1, Option 2, Option 3" 
                              value={newParameter.options}
                              onChange={(e) => setNewParameter({...newParameter, options: e.target.value})}
                            />
                          </div>
                        )}
                        
                        {(newParameter.type === 'number' || newParameter.type === 'percentage' || newParameter.type === 'counter') && (
                          <div className="space-y-2">
                            <Label htmlFor="parameter-unit">Unit (optional)</Label>
                            <Input 
                              id="parameter-unit" 
                              placeholder="e.g. minutes, hours, etc." 
                              value={newParameter.unit}
                              onChange={(e) => setNewParameter({...newParameter, unit: e.target.value})}
                            />
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-2 mt-4">
                          <input 
                            type="checkbox"
                            id="parameter-scorable"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            checked={newParameter.scorable}
                            onChange={(e) => setNewParameter({...newParameter, scorable: e.target.checked})}
                          />
                          <Label htmlFor="parameter-scorable">Is this parameter scorable?</Label>
                        </div>
                        
                        {newParameter.scorable && (
                          <div className="space-y-2">
                            <Label htmlFor="parameter-weightage">Weightage (%)</Label>
                            <Input 
                              id="parameter-weightage"
                              type="number"
                              min="0"
                              max="100"
                              placeholder="Enter weightage percentage" 
                              value={newParameter.weightage.toString()}
                              onChange={(e) => setNewParameter({...newParameter, weightage: parseFloat(e.target.value) || 0})}
                            />
                            <p className="text-xs text-muted-foreground">
                              The weightage determines how much this parameter contributes to the overall dimension score.
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setNewParameter({ 
                          name: '', 
                          description: '', 
                          type: 'text', 
                          options: '', 
                          unit: '',
                          scorable: false,
                          weightage: 0
                        })}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddParameter}>Add Parameter</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Parameter Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="w-[100px]">Type</TableHead>
                        <TableHead className="w-[100px]">Scorable</TableHead>
                        <TableHead className="w-[100px]">Weightage</TableHead>
                        <TableHead className="text-right w-[120px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedDimensionData.parameters.length > 0 ? (
                        selectedDimensionData.parameters.map((param) => (
                          <TableRow key={param.id}>
                            <TableCell className="font-medium">{param.name}</TableCell>
                            <TableCell>{param.description}</TableCell>
                            <TableCell className="capitalize">{param.type}</TableCell>
                            <TableCell>{param.scorable ? <Check className="h-4 w-4 text-green-500" /> : '-'}</TableCell>
                            <TableCell>{param.weightage ? `${param.weightage}%` : '-'}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" size="sm" onClick={() => {
                                      // Convert options array to string for editing if it's a select type parameter
                                      const optionsStr = param.type === 'select' && param.options 
                                        ? Array.isArray(param.options) ? param.options.join(', ') : param.options
                                        : '';
                                      
                                      setEditingParameter({
                                        ...param,
                                        options: optionsStr
                                      });
                                    }}>
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Edit Parameter</DialogTitle>
                                      <DialogDescription>
                                        Update the parameter details.
                                      </DialogDescription>
                                    </DialogHeader>
                                    
                                    <div className="space-y-4 py-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="edit-parameter-name">Parameter Name *</Label>
                                        <Input 
                                          id="edit-parameter-name" 
                                          placeholder="Enter parameter name" 
                                          value={editingParameter?.name || ''}
                                          onChange={(e) => handleEditParameterChange('name', e.target.value)}
                                        />
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <Label htmlFor="edit-parameter-description">Description</Label>
                                        <Textarea 
                                          id="edit-parameter-description" 
                                          placeholder="Enter parameter description" 
                                          value={editingParameter?.description || ''}
                                          onChange={(e) => handleEditParameterChange('description', e.target.value)}
                                        />
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <Label htmlFor="edit-parameter-type">Parameter Type *</Label>
                                        <Select 
                                          value={editingParameter?.type || 'text'} 
                                          onValueChange={(value: ParameterType) => handleEditParameterChange('type', value)}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select parameter type" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="text">Text</SelectItem>
                                            <SelectItem value="number">Number</SelectItem>
                                            <SelectItem value="percentage">Percentage</SelectItem>
                                            <SelectItem value="select">Dropdown</SelectItem>
                                            <SelectItem value="link">URL</SelectItem>
                                            <SelectItem value="counter">Counter</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      
                                      {editingParameter?.type === 'select' && (
                                        <div className="space-y-2">
                                          <Label htmlFor="edit-parameter-options">Options (comma-separated)</Label>
                                          <Textarea 
                                            id="edit-parameter-options" 
                                            placeholder="Option 1, Option 2, Option 3" 
                                            value={typeof editingParameter?.options === 'string' 
                                              ? editingParameter.options 
                                              : Array.isArray(editingParameter?.options) 
                                                ? editingParameter.options.join(', ') 
                                                : ''}
                                            onChange={(e) => handleEditParameterChange('options', e.target.value)}
                                          />
                                        </div>
                                      )}
                                      
                                      {(editingParameter?.type === 'number' || editingParameter?.type === 'percentage' || editingParameter?.type === 'counter') && (
                                        <div className="space-y-2">
                                          <Label htmlFor="edit-parameter-unit">Unit (optional)</Label>
                                          <Input 
                                            id="edit-parameter-unit" 
                                            placeholder="e.g. minutes, hours, etc." 
                                            value={editingParameter?.unit || ''}
                                            onChange={(e) => handleEditParameterChange('unit', e.target.value)}
                                          />
                                        </div>
                                      )}
                                      
                                      <div className="flex items-center space-x-2 mt-4">
                                        <input 
                                          type="checkbox"
                                          id="edit-parameter-scorable"
                                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                          checked={editingParameter?.scorable || false}
                                          onChange={(e) => handleEditParameterChange('scorable', e.target.checked)}
                                        />
                                        <Label htmlFor="edit-parameter-scorable">Is this parameter scorable?</Label>
                                      </div>
                                      
                                      {editingParameter?.scorable && (
                                        <div className="space-y-2">
                                          <Label htmlFor="edit-parameter-weightage">Weightage (%)</Label>
                                          <Input 
                                            id="edit-parameter-weightage"
                                            type="number"
                                            min="0"
                                            max="100"
                                            placeholder="Enter weightage percentage" 
                                            value={(editingParameter?.weightage || 0).toString()}
                                            onChange={(e) => handleEditParameterChange('weightage', parseFloat(e.target.value) || 0)}
                                          />
                                          <p className="text-xs text-muted-foreground">
                                            The weightage determines how much this parameter contributes to the overall dimension score.
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                    
                                    <DialogFooter>
                                      <Button variant="outline" onClick={() => setEditingParameter(null)}>Cancel</Button>
                                      <Button onClick={handleEditParameter}>Save Changes</Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                                
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                      onClick={() => setDeletingParameter({ dimensionId: selectedDimension, parameterId: param.id })}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Parameter</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete the parameter "{param.name}"? 
                                        This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel onClick={() => setDeletingParameter(null)}>Cancel</AlertDialogCancel>
                                      <AlertDialogAction 
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        onClick={handleDeleteParameter}
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                            <p>No parameters defined yet</p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-2" 
                              onClick={() => {
                                // Find the add parameter button and create a reference to it
                                const addParameterButton = document.querySelector('button:has(.h-4.w-4 + :contains("Add Parameter"))');
                                if (addParameterButton instanceof HTMLElement) {
                                  addParameterButton.focus();
                                  addParameterButton.click();
                                }
                              }}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add First Parameter
                            </Button>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-sm h-[600px] flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <SlidersHorizontal className="h-8 w-8 text-primary/60" />
              </div>
              <h3 className="text-xl font-medium mb-2">Select a DR Dimension</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                Select a DR dimension from the list to view and manage its parameters. Each dimension contains a set of parameters that define DR capability requirements.
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-1" />
                    Create New Dimension
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Dimension</DialogTitle>
                    <DialogDescription>
                      Define a new disaster recovery dimension.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="dimension-name">Dimension Name *</Label>
                      <Input 
                        id="dimension-name" 
                        placeholder="Enter dimension name" 
                        value={newDimension.name}
                        onChange={(e) => setNewDimension({...newDimension, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dimension-description">Description</Label>
                      <Textarea 
                        id="dimension-description" 
                        placeholder="Enter dimension description" 
                        value={newDimension.description}
                        onChange={(e) => setNewDimension({...newDimension, description: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setNewDimension({ name: '', description: '' })}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddDimension}>Add Dimension</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default DRParameters;
