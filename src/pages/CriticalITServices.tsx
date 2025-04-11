
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageTitle } from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Plus, Upload, Layers, Server, Info, Edit, Trash2, Search, Database, Settings, Network, Building } from 'lucide-react';

import { officeSites } from '@/data/officeSites';
import SiteSelector from '@/components/dashboard/SiteSelector';
import { 
  criticalITServices, 
  serviceAssets as initialServiceAssets, 
  configItems as initialConfigItems,
  Service,
  Asset,
  ConfigItem
} from '@/data/criticalITServices';

const CriticalITServices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<number | null>(null);
  const [selectedSiteId, setSelectedSiteId] = useState<number | null>(null);
  const [services, setServices] = useState<Service[]>(criticalITServices);
  const [serviceAssets, setServiceAssets] = useState<Asset[]>(initialServiceAssets);
  const [configItems, setConfigItems] = useState<ConfigItem[]>(initialConfigItems);
  
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [isEditServiceOpen, setIsEditServiceOpen] = useState(false);
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);
  const [isEditAssetOpen, setIsEditAssetOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isAddCIOpen, setIsAddCIOpen] = useState(false);
  const [isEditCIOpen, setIsEditCIOpen] = useState(false);
  const [isImportCIOpen, setIsImportCIOpen] = useState(false);
  
  const [newService, setNewService] = useState({ name: '', description: '', category: 'Infrastructure', businessImpact: 'Medium', responsible: '' });
  const [newAsset, setNewAsset] = useState({ name: '', description: '', criticality: 'Medium', siteId: '', owner: '', vendor: '', type: 'Infrastructure' });
  const [newCI, setNewCI] = useState({ name: '', manufacturer: '', eolDate: '', eowDate: '', rma: 'Yes', inUse: '1', inStock: '0' });
  
  const [editingService, setEditingService] = useState<any>(null);
  const [editingAsset, setEditingAsset] = useState<any>(null);
  const [editingCI, setEditingCI] = useState<any>(null);
  
  const [deleteServiceId, setDeleteServiceId] = useState<number | null>(null);
  const [deleteAssetId, setDeleteAssetId] = useState<number | null>(null);
  const [deleteCIId, setDeleteCIId] = useState<number | null>(null);

  // Filtered lists
  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAssets = serviceAssets.filter(asset => 
    asset.serviceId === selectedService && 
    (selectedSiteId === null || asset.siteId === selectedSiteId)
  );

  const filteredConfigItems = configItems.filter(item => 
    item.assetId === selectedAsset
  );
  
  const getSiteName = (siteId: number) => {
    const site = officeSites.find(site => site.id === siteId);
    return site ? site.name : 'Unknown Site';
  };

  // Service handlers
  const handleAddService = () => {
    if (!newService.name.trim() || !newService.responsible.trim()) {
      toast({
        title: "Validation Error",
        description: "Service name and responsible party are required",
        variant: "destructive"
      });
      return;
    }

    const newId = Math.max(0, ...services.map(s => s.id)) + 1;
    const newServiceObj = {
      id: newId,
      name: newService.name.trim(),
      description: newService.description.trim(),
      category: newService.category as "Infrastructure" | "End User" | "Facilities",
      businessImpact: newService.businessImpact as "Critical" | "High" | "Medium" | "Low",
      responsible: newService.responsible.trim()
    };

    setServices([...services, newServiceObj]);
    setNewService({ name: '', description: '', category: 'Infrastructure', businessImpact: 'Medium', responsible: '' });
    setIsAddServiceOpen(false);
    setSelectedService(newId);

    toast({
      title: "Success",
      description: "Service added successfully",
    });
  };

  const handleEditService = () => {
    if (!editingService || !editingService.name.trim() || !editingService.responsible.trim()) {
      toast({
        title: "Validation Error",
        description: "Service name and responsible party are required",
        variant: "destructive"
      });
      return;
    }

    const updatedServices = services.map(service => 
      service.id === editingService.id ? {
        ...service,
        name: editingService.name.trim(),
        description: editingService.description.trim(),
        category: editingService.category,
        businessImpact: editingService.businessImpact,
        responsible: editingService.responsible.trim()
      } : service
    );
    
    setServices(updatedServices);
    setIsEditServiceOpen(false);
    
    toast({
      title: "Success",
      description: "Service updated successfully",
    });
  };

  const handleDeleteService = () => {
    if (deleteServiceId === null) return;
    
    // Delete service and its associated assets and config items
    setServices(services.filter(service => service.id !== deleteServiceId));
    const assetsToRemove = serviceAssets.filter(asset => asset.serviceId === deleteServiceId);
    const assetIdsToRemove = assetsToRemove.map(asset => asset.id);
    
    setServiceAssets(serviceAssets.filter(asset => asset.serviceId !== deleteServiceId));
    setConfigItems(configItems.filter(item => !assetIdsToRemove.includes(item.assetId)));
    
    if (selectedService === deleteServiceId) {
      setSelectedService(null);
      setSelectedAsset(null);
    }
    
    setDeleteServiceId(null);
    
    toast({
      title: "Success",
      description: "Service and all related assets were deleted successfully",
    });
  };

  // Asset handlers
  const handleAddAsset = () => {
    if (!selectedService || !newAsset.name.trim() || !newAsset.siteId) {
      toast({
        title: "Validation Error",
        description: "Asset name and site are required",
        variant: "destructive"
      });
      return;
    }

    const newId = Math.max(0, ...serviceAssets.map(a => a.id)) + 1;
    const newAssetObj = {
      id: newId,
      name: newAsset.name.trim(),
      description: newAsset.description.trim(),
      criticality: newAsset.criticality as "High" | "Medium" | "Low",
      serviceId: selectedService,
      siteId: parseInt(newAsset.siteId),
      owner: newAsset.owner.trim(),
      vendor: newAsset.vendor.trim(),
      type: newAsset.type // Make sure to include the type property
    };

    setServiceAssets([...serviceAssets, newAssetObj]);
    setNewAsset({ name: '', description: '', criticality: 'Medium', siteId: '', owner: '', vendor: '', type: 'Infrastructure' });
    setIsAddAssetOpen(false);
    setSelectedAsset(newId);

    toast({
      title: "Success",
      description: "Asset added successfully",
    });
  };

  const handleEditAsset = () => {
    if (!editingAsset || !editingAsset.name.trim() || !editingAsset.siteId) {
      toast({
        title: "Validation Error",
        description: "Asset name and site are required",
        variant: "destructive"
      });
      return;
    }

    setServiceAssets(serviceAssets.map(asset => 
      asset.id === editingAsset.id ? {
        ...asset,
        name: editingAsset.name.trim(),
        description: editingAsset.description.trim(),
        criticality: editingAsset.criticality,
        siteId: parseInt(editingAsset.siteId),
        owner: editingAsset.owner.trim(),
        vendor: editingAsset.vendor.trim(),
        type: editingAsset.type || 'Infrastructure' // Ensure type is included
      } : asset
    ));
    
    setIsEditAssetOpen(false);
    
    toast({
      title: "Success",
      description: "Asset updated successfully",
    });
  };

  const handleDeleteAsset = () => {
    if (deleteAssetId === null) return;
    
    setServiceAssets(serviceAssets.filter(asset => asset.id !== deleteAssetId));
    setConfigItems(configItems.filter(item => item.assetId !== deleteAssetId));
    
    if (selectedAsset === deleteAssetId) {
      setSelectedAsset(null);
    }
    
    setDeleteAssetId(null);
    
    toast({
      title: "Success",
      description: "Asset deleted successfully",
    });
  };

  // Configuration Item handlers
  const handleAddCI = () => {
    if (!selectedAsset || !newCI.name.trim() || !newCI.manufacturer.trim()) {
      toast({
        title: "Validation Error",
        description: "Name and manufacturer are required",
        variant: "destructive"
      });
      return;
    }

    const newId = Math.max(0, ...configItems.map(ci => ci.id)) + 1;
    const newCIObj = {
      id: newId,
      assetId: selectedAsset,
      name: newCI.name.trim(),
      manufacturer: newCI.manufacturer.trim(),
      eolDate: newCI.eolDate,
      eowDate: newCI.eowDate,
      rma: newCI.rma,
      inUse: parseInt(newCI.inUse),
      inStock: parseInt(newCI.inStock)
    };

    setConfigItems([...configItems, newCIObj]);
    setNewCI({ name: '', manufacturer: '', eolDate: '', eowDate: '', rma: 'Yes', inUse: '1', inStock: '0' });
    setIsAddCIOpen(false);

    toast({
      title: "Success",
      description: "Configuration Item added successfully",
    });
  };

  const handleEditCI = () => {
    if (!editingCI || !editingCI.name.trim() || !editingCI.manufacturer.trim()) {
      toast({
        title: "Validation Error",
        description: "Name and manufacturer are required",
        variant: "destructive"
      });
      return;
    }

    setConfigItems(configItems.map(item => 
      item.id === editingCI.id ? {
        ...item,
        name: editingCI.name.trim(),
        manufacturer: editingCI.manufacturer.trim(),
        eolDate: editingCI.eolDate,
        eowDate: editingCI.eowDate,
        rma: editingCI.rma,
        inUse: parseInt(editingCI.inUse),
        inStock: parseInt(editingCI.inStock)
      } : item
    ));
    
    setEditingCI(null);
    
    toast({
      title: "Success",
      description: "Configuration Item updated successfully",
    });
  };

  const handleDeleteCI = () => {
    if (deleteCIId === null) return;
    
    setConfigItems(configItems.filter(item => item.id !== deleteCIId));
    setDeleteCIId(null);
    
    toast({
      title: "Success",
      description: "Configuration Item deleted successfully",
    });
  };

  // Import handlers
  const handleBulkUpload = () => {
    toast({
      title: "Bulk Upload",
      description: "File uploaded successfully. Processing data...",
    });
    setIsBulkUploadOpen(false);
    
    setTimeout(() => {
      toast({
        title: "Import Complete",
        description: "3 services, 5 assets and 12 configuration items were imported successfully.",
      });
    }, 1500);
  };

  const handleImportCI = () => {
    if (!selectedAsset) {
      toast({
        title: "Error",
        description: "Please select an asset first",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Import",
      description: "File uploaded successfully. Processing data...",
    });
    setIsImportCIOpen(false);
    
    setTimeout(() => {
      toast({
        title: "Import Complete",
        description: "5 configuration items were imported successfully.",
      });
      
      const newCIs = [
        { 
          id: configItems.length + 1, 
          assetId: selectedAsset, 
          name: 'Imported Item 1', 
          manufacturer: 'Cisco', 
          eolDate: '2026-05-15', 
          eowDate: '2025-05-15',
          rma: 'Yes',
          inUse: 8,
          inStock: 2
        },
        { 
          id: configItems.length + 2, 
          assetId: selectedAsset, 
          name: 'Imported Item 2', 
          manufacturer: 'HP', 
          eolDate: '2027-10-20', 
          eowDate: '2026-10-20',
          rma: 'Yes',
          inUse: 12,
          inStock: 4
        }
      ];
      
      setConfigItems([...configItems, ...newCIs]);
    }, 1500);
  };

  const getServiceIcon = (category: string) => {
    switch (category) {
      case 'Infrastructure':
        return <Network className="h-5 w-5 text-blue-500" />;
      case 'End User':
        return <Settings className="h-5 w-5 text-green-500" />;
      case 'Facilities':
        return <Database className="h-5 w-5 text-purple-500" />;
      default:
        return <Layers className="h-5 w-5 text-gray-500" />;
    }
  };

  const getBusinessImpactColor = (impact: string) => {
    switch (impact) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <MainLayout>
      <PageTitle 
        title="Critical IT Services"
        description="Manage IT services, associated assets, and configuration items across sites."
        actions={
          <>
            <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-1">
                  <Upload className="h-4 w-4" />
                  Bulk Upload
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Bulk Upload Services, Assets & Configuration Items</DialogTitle>
                  <DialogDescription>
                    Upload a CSV or Excel file containing services, assets, and configuration items.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="py-4">
                  <Label htmlFor="file-upload">Upload File</Label>
                  <Input id="file-upload" type="file" className="mt-2" />
                  
                  <div className="mt-4 text-sm">
                    <p className="font-medium">File Format Requirements:</p>
                    <ul className="list-disc pl-5 mt-2 text-muted-foreground">
                      <li>Excel file with sheets for Services, Assets, and Config Items</li>
                      <li>Service ID must match between sheets</li>
                      <li>Asset ID must match between sheets</li>
                    </ul>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsBulkUploadOpen(false)}>Cancel</Button>
                  <Button onClick={handleBulkUpload}>Upload</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isAddServiceOpen} onOpenChange={setIsAddServiceOpen}>
              <DialogTrigger asChild>
                <Button className="gap-1">
                  <Plus className="h-4 w-4" />
                  Add Service
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New IT Service</DialogTitle>
                  <DialogDescription>
                    Add a new critical IT service that may contain multiple assets across sites.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-service-name">Service Name *</Label>
                    <Input 
                      id="new-service-name" 
                      placeholder="Enter service name" 
                      value={newService.name}
                      onChange={(e) => setNewService({...newService, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-service-description">Description</Label>
                    <Textarea 
                      id="new-service-description" 
                      placeholder="Enter service description" 
                      value={newService.description}
                      onChange={(e) => setNewService({...newService, description: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-service-category">Category *</Label>
                    <Select 
                      value={newService.category}
                      onValueChange={(value) => setNewService({...newService, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                        <SelectItem value="End User">End User</SelectItem>
                        <SelectItem value="Facilities">Facilities</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-service-impact">Business Impact *</Label>
                    <Select 
                      value={newService.businessImpact}
                      onValueChange={(value) => setNewService({...newService, businessImpact: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select impact level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Critical">Critical</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-service-responsible">Responsible Party *</Label>
                    <Input 
                      id="new-service-responsible" 
                      placeholder="Enter responsible team/person" 
                      value={newService.responsible}
                      onChange={(e) => setNewService({...newService, responsible: e.target.value})}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddServiceOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddService}>Save Service</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        }
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Services Panel */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">IT Services</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search services..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="space-y-1 max-h-[500px] overflow-y-auto pr-1">
                {filteredServices.map((service) => (
                  <div
                    key={service.id}
                    className={`p-3 rounded-md cursor-pointer transition-colors ${
                      selectedService === service.id
                        ? 'bg-primary/10 border border-primary/20'
                        : 'hover:bg-accent'
                    }`}
                    onClick={() => {
                      setSelectedService(service.id);
                      setSelectedAsset(null);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        {getServiceIcon(service.category)}
                        <div>
                          <div className="font-medium text-sm">{service.name}</div>
                          <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{service.description}</div>
                          <div className="text-xs text-primary mt-1">{service.responsible}</div>
                        </div>
                      </div>
                      <Badge 
                        className={`ml-2 ${getBusinessImpactColor(service.businessImpact)}`}
                        variant="outline"
                      >
                        {service.businessImpact}
                      </Badge>
                    </div>
                  </div>
                ))}
                
                {filteredServices.length === 0 && (
                  <div className="py-8 text-center text-muted-foreground">
                    <Layers className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>{searchTerm ? `No services found matching "${searchTerm}"` : "No services available"}</p>
                    <Button 
                      variant="outline"
                      className="mt-4"
                      onClick={() => setSearchTerm('')}
                    >
                      Clear Search
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Assets and Config Items Panel */}
        <div className="lg:col-span-3 space-y-6">
          {selectedService ? (
            <>
              <Card className="shadow-sm">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-lg">
                        {services.find(s => s.id === selectedService)?.name}
                      </CardTitle>
                      <Badge variant="outline" className={`font-normal ${getBusinessImpactColor(services.find(s => s.id === selectedService)?.businessImpact || 'Medium')}`}>
                        {services.find(s => s.id === selectedService)?.businessImpact}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {services.find(s => s.id === selectedService)?.description}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Dialog open={isEditServiceOpen} onOpenChange={setIsEditServiceOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            const service = services.find(s => s.id === selectedService);
                            if (service) {
                              setEditingService({...service});
                            }
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Service</DialogTitle>
                          <DialogDescription>
                            Update the IT service details.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-service-name">Service Name *</Label>
                            <Input 
                              id="edit-service-name" 
                              placeholder="Enter service name" 
                              value={editingService?.name || ''}
                              onChange={(e) => setEditingService({...editingService, name: e.target.value})}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="edit-service-description">Description</Label>
                            <Textarea 
                              id="edit-service-description" 
                              placeholder="Enter service description" 
                              value={editingService?.description || ''}
                              onChange={(e) => setEditingService({...editingService, description: e.target.value})}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="edit-service-category">Category *</Label>
                            <Select 
                              value={editingService?.category || 'Infrastructure'}
                              onValueChange={(value) => setEditingService({...editingService, category: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                                <SelectItem value="End User">End User</SelectItem>
                                <SelectItem value="Facilities">Facilities</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="edit-service-impact">Business Impact *</Label>
                            <Select 
                              value={editingService?.businessImpact || 'Medium'}
                              onValueChange={(value) => setEditingService({...editingService, businessImpact: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select impact level" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Critical">Critical</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Low">Low</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="edit-service-responsible">Responsible Party *</Label>
                            <Input 
                              id="edit-service-responsible" 
                              placeholder="Enter responsible team/person" 
                              value={editingService?.responsible || ''}
                              onChange={(e) => setEditingService({...editingService, responsible: e.target.value})}
                            />
                          </div>
                        </div>
                        
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsEditServiceOpen(false)}>Cancel</Button>
                          <Button onClick={handleEditService}>Save Changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => setDeleteServiceId(selectedService)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Service</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this service? This action will also delete all associated assets and configuration items.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setDeleteServiceId(null)}>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={handleDeleteService}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
              </Card>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <SiteSelector 
                    selectedSiteId={selectedSiteId} 
                    onChange={setSelectedSiteId} 
                  />
                  
                  <Dialog open={isAddAssetOpen} onOpenChange={setIsAddAssetOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Asset
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Asset</DialogTitle>
                        <DialogDescription>
                          Add a new asset to this IT service.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="new-asset-name">Asset Name *</Label>
                          <Input 
                            id="new-asset-name" 
                            placeholder="Enter asset name" 
                            value={newAsset.name}
                            onChange={(e) => setNewAsset({...newAsset, name: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="new-asset-description">Description</Label>
                          <Textarea 
                            id="new-asset-description" 
                            placeholder="Enter asset description" 
                            value={newAsset.description}
                            onChange={(e) => setNewAsset({...newAsset, description: e.target.value})}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="new-asset-criticality">Criticality *</Label>
                            <Select 
                              value={newAsset.criticality}
                              onValueChange={(value) => setNewAsset({...newAsset, criticality: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select criticality" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="High">High</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Low">Low</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="new-asset-site">Site *</Label>
                            <Select 
                              value={newAsset.siteId}
                              onValueChange={(value) => setNewAsset({...newAsset, siteId: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select site" />
                              </SelectTrigger>
                              <SelectContent>
                                {officeSites.map(site => (
                                  <SelectItem key={site.id} value={site.id.toString()}>
                                    {site.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="new-asset-owner">Owner</Label>
                            <Input 
                              id="new-asset-owner" 
                              placeholder="Enter owner" 
                              value={newAsset.owner}
                              onChange={(e) => setNewAsset({...newAsset, owner: e.target.value})}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="new-asset-vendor">Vendor</Label>
                            <Input 
                              id="new-asset-vendor" 
                              placeholder="Enter vendor" 
                              value={newAsset.vendor}
                              onChange={(e) => setNewAsset({...newAsset, vendor: e.target.value})}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="new-asset-type">Asset Type *</Label>
                          <Select 
                            value={newAsset.type}
                            onValueChange={(value) => setNewAsset({...newAsset, type: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select asset type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                              <SelectItem value="Server">Server</SelectItem>
                              <SelectItem value="Network">Network</SelectItem>
                              <SelectItem value="Storage">Storage</SelectItem>
                              <SelectItem value="End User">End User</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddAssetOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddAsset}>Save Asset</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              {/* Assets Table */}
              {filteredAssets.length > 0 ? (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Assets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Asset Name</TableHead>
                            <TableHead>Site</TableHead>
                            <TableHead>Criticality</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredAssets.map((asset) => (
                            <TableRow 
                              key={asset.id}
                              className={selectedAsset === asset.id ? "bg-primary/5" : ""}
                              onClick={() => setSelectedAsset(asset.id)}
                            >
                              <TableCell className="font-medium">{asset.name}</TableCell>
                              <TableCell>{getSiteName(asset.siteId)}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className={`text-xs ${getCriticalityColor(asset.criticality)}`}>
                                  {asset.criticality}
                                </Badge>
                              </TableCell>
                              <TableCell>{asset.type}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Dialog open={isEditAssetOpen} onOpenChange={setIsEditAssetOpen}>
                                    <DialogTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => setEditingAsset({...asset, siteId: asset.siteId.toString()})}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Edit Asset</DialogTitle>
                                        <DialogDescription>
                                          Update asset details.
                                        </DialogDescription>
                                      </DialogHeader>
                                      
                                      <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                          <Label htmlFor="edit-asset-name">Asset Name *</Label>
                                          <Input 
                                            id="edit-asset-name" 
                                            placeholder="Enter asset name" 
                                            value={editingAsset?.name || ''}
                                            onChange={(e) => setEditingAsset({...editingAsset, name: e.target.value})}
                                          />
                                        </div>
                                        
                                        <div className="space-y-2">
                                          <Label htmlFor="edit-asset-description">Description</Label>
                                          <Textarea 
                                            id="edit-asset-description" 
                                            placeholder="Enter asset description" 
                                            value={editingAsset?.description || ''}
                                            onChange={(e) => setEditingAsset({...editingAsset, description: e.target.value})}
                                          />
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div className="space-y-2">
                                            <Label htmlFor="edit-asset-criticality">Criticality *</Label>
                                            <Select 
                                              value={editingAsset?.criticality || 'Medium'}
                                              onValueChange={(value) => setEditingAsset({...editingAsset, criticality: value})}
                                            >
                                              <SelectTrigger>
                                                <SelectValue placeholder="Select criticality" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="High">High</SelectItem>
                                                <SelectItem value="Medium">Medium</SelectItem>
                                                <SelectItem value="Low">Low</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                          
                                          <div className="space-y-2">
                                            <Label htmlFor="edit-asset-site">Site *</Label>
                                            <Select 
                                              value={editingAsset?.siteId}
                                              onValueChange={(value) => setEditingAsset({...editingAsset, siteId: value})}
                                            >
                                              <SelectTrigger>
                                                <SelectValue placeholder="Select site" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {officeSites.map(site => (
                                                  <SelectItem key={site.id} value={site.id.toString()}>
                                                    {site.name}
                                                  </SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                          </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div className="space-y-2">
                                            <Label htmlFor="edit-asset-owner">Owner</Label>
                                            <Input 
                                              id="edit-asset-owner" 
                                              placeholder="Enter owner" 
                                              value={editingAsset?.owner || ''}
                                              onChange={(e) => setEditingAsset({...editingAsset, owner: e.target.value})}
                                            />
                                          </div>
                                          
                                          <div className="space-y-2">
                                            <Label htmlFor="edit-asset-vendor">Vendor</Label>
                                            <Input 
                                              id="edit-asset-vendor" 
                                              placeholder="Enter vendor" 
                                              value={editingAsset?.vendor || ''}
                                              onChange={(e) => setEditingAsset({...editingAsset, vendor: e.target.value})}
                                            />
                                          </div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                          <Label htmlFor="edit-asset-type">Asset Type *</Label>
                                          <Select 
                                            value={editingAsset?.type || 'Infrastructure'}
                                            onValueChange={(value) => setEditingAsset({...editingAsset, type: value})}
                                          >
                                            <SelectTrigger>
                                              <SelectValue placeholder="Select asset type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                                              <SelectItem value="Server">Server</SelectItem>
                                              <SelectItem value="Network">Network</SelectItem>
                                              <SelectItem value="Storage">Storage</SelectItem>
                                              <SelectItem value="End User">End User</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                      
                                      <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsEditAssetOpen(false)}>Cancel</Button>
                                        <Button onClick={handleEditAsset}>Save Changes</Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                  
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => setDeleteAssetId(asset.id)}
                                      >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Asset</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete this asset? This action will also delete all associated configuration items.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel onClick={() => setDeleteAssetId(null)}>Cancel</AlertDialogCancel>
                                        <AlertDialogAction 
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                          onClick={handleDeleteAsset}
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-10 text-center">
                    <Server className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p className="text-muted-foreground mb-4">No assets found for this service{selectedSiteId ? ` at ${getSiteName(selectedSiteId)}` : ''}</p>
                    <Button 
                      size="sm" 
                      onClick={() => setIsAddAssetOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add First Asset
                    </Button>
                  </CardContent>
                </Card>
              )}
              
              {/* Configuration Items Section */}
              {selectedAsset && (
                <Card className="mt-6">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle className="text-lg">
                        Configuration Items for {serviceAssets.find(a => a.id === selectedAsset)?.name}
                      </CardTitle>
                    </div>
                    <div className="flex space-x-2">
                      <Dialog open={isAddCIOpen} onOpenChange={setIsAddCIOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm">
                            <Plus className="h-4 w-4 mr-1" />
                            Add Item
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Configuration Item</DialogTitle>
                            <DialogDescription>
                              Add a new configuration item to this asset.
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="new-ci-name">Item Name *</Label>
                              <Input 
                                id="new-ci-name" 
                                placeholder="Enter item name" 
                                value={newCI.name}
                                onChange={(e) => setNewCI({...newCI, name: e.target.value})}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="new-ci-manufacturer">Manufacturer *</Label>
                              <Input 
                                id="new-ci-manufacturer" 
                                placeholder="Enter manufacturer" 
                                value={newCI.manufacturer}
                                onChange={(e) => setNewCI({...newCI, manufacturer: e.target.value})}
                              />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="new-ci-eol">End of Life Date</Label>
                                <Input 
                                  id="new-ci-eol" 
                                  type="date"
                                  value={newCI.eolDate}
                                  onChange={(e) => setNewCI({...newCI, eolDate: e.target.value})}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="new-ci-eow">End of Warranty Date</Label>
                                <Input 
                                  id="new-ci-eow" 
                                  type="date"
                                  value={newCI.eowDate}
                                  onChange={(e) => setNewCI({...newCI, eowDate: e.target.value})}
                                />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="new-ci-rma">RMA Support</Label>
                                <Select 
                                  value={newCI.rma}
                                  onValueChange={(value) => setNewCI({...newCI, rma: value})}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="RMA Available?" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Yes">Yes</SelectItem>
                                    <SelectItem value="No">No</SelectItem>
                                    <SelectItem value="Unknown">Unknown</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="new-ci-inuse">In Use</Label>
                                <Input 
                                  id="new-ci-inuse" 
                                  type="number"
                                  placeholder="Quantity in use"
                                  value={newCI.inUse}
                                  onChange={(e) => setNewCI({...newCI, inUse: e.target.value})}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="new-ci-instock">In Stock</Label>
                                <Input 
                                  id="new-ci-instock" 
                                  type="number"
                                  placeholder="Quantity in stock"
                                  value={newCI.inStock}
                                  onChange={(e) => setNewCI({...newCI, inStock: e.target.value})}
                                />
                              </div>
                            </div>
                          </div>
                          
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddCIOpen(false)}>Cancel</Button>
                            <Button onClick={handleAddCI}>Save Item</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      
                      <Dialog open={isImportCIOpen} onOpenChange={setIsImportCIOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-1" />
                            Import Items
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Import Configuration Items</DialogTitle>
                            <DialogDescription>
                              Upload a CSV or Excel file containing configuration items.
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="py-4">
                            <Label htmlFor="ci-file-upload">Upload File</Label>
                            <Input id="ci-file-upload" type="file" className="mt-2" />
                          </div>
                          
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsImportCIOpen(false)}>Cancel</Button>
                            <Button onClick={handleImportCI}>Upload</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {filteredConfigItems.length > 0 ? (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Item Name</TableHead>
                              <TableHead>Manufacturer</TableHead>
                              <TableHead>EOL Date</TableHead>
                              <TableHead>In Use / Stock</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredConfigItems.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>{item.manufacturer}</TableCell>
                                <TableCell>
                                  {item.eolDate ? (
                                    <div className="flex flex-col">
                                      <span>{new Date(item.eolDate).toLocaleDateString()}</span>
                                      {new Date(item.eolDate) < new Date() && (
                                        <Badge variant="destructive" className="mt-1 w-fit">
                                          Expired
                                        </Badge>
                                      )}
                                    </div>
                                  ) : (
                                    "Not specified"
                                  )}
                                </TableCell>
                                <TableCell>
                                  {item.inUse} / {item.inStock}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => {
                                        setEditingCI({...item});
                                        setIsEditCIOpen(true);
                                      }}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button 
                                          variant="ghost" 
                                          size="sm"
                                          onClick={() => setDeleteCIId(item.id)}
                                        >
                                          <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Delete Configuration Item</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Are you sure you want to delete this configuration item?
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel onClick={() => setDeleteCIId(null)}>Cancel</AlertDialogCancel>
                                          <AlertDialogAction 
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            onClick={handleDeleteCI}
                                          >
                                            Delete
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <Database className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p className="text-muted-foreground mb-4">No configuration items found for this asset</p>
                        <Button 
                          size="sm" 
                          onClick={() => setIsAddCIOpen(true)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add First Configuration Item
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="py-20 text-center">
                <Info className="h-16 w-16 mx-auto mb-6 opacity-20" />
                <h3 className="text-lg font-medium mb-2">No Service Selected</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Please select a service from the list on the left to view its assets and configuration items.
                </p>
                <Button 
                  onClick={() => setIsAddServiceOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add New Service
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Edit CI Dialog */}
      <Dialog open={isEditCIOpen} onOpenChange={setIsEditCIOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Configuration Item</DialogTitle>
            <DialogDescription>
              Update configuration item details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-ci-name">Item Name *</Label>
              <Input 
                id="edit-ci-name" 
                placeholder="Enter item name" 
                value={editingCI?.name || ''}
                onChange={(e) => setEditingCI({...editingCI, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-ci-manufacturer">Manufacturer *</Label>
              <Input 
                id="edit-ci-manufacturer" 
                placeholder="Enter manufacturer" 
                value={editingCI?.manufacturer || ''}
                onChange={(e) => setEditingCI({...editingCI, manufacturer: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-ci-eol">End of Life Date</Label>
                <Input 
                  id="edit-ci-eol" 
                  type="date"
                  value={editingCI?.eolDate || ''}
                  onChange={(e) => setEditingCI({...editingCI, eolDate: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-ci-eow">End of Warranty Date</Label>
                <Input 
                  id="edit-ci-eow" 
                  type="date"
                  value={editingCI?.eowDate || ''}
                  onChange={(e) => setEditingCI({...editingCI, eowDate: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-ci-rma">RMA Support</Label>
                <Select 
                  value={editingCI?.rma || 'Yes'}
                  onValueChange={(value) => setEditingCI({...editingCI, rma: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="RMA Available?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-ci-inuse">In Use</Label>
                <Input 
                  id="edit-ci-inuse" 
                  type="number"
                  placeholder="Quantity in use"
                  value={editingCI?.inUse || '0'}
                  onChange={(e) => setEditingCI({...editingCI, inUse: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-ci-instock">In Stock</Label>
                <Input 
                  id="edit-ci-instock" 
                  type="number"
                  placeholder="Quantity in stock"
                  value={editingCI?.inStock || '0'}
                  onChange={(e) => setEditingCI({...editingCI, inStock: e.target.value})}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCIOpen(false)}>Cancel</Button>
            <Button onClick={handleEditCI}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default CriticalITServices;
