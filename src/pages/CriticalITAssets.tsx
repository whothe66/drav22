import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageTitle } from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
import { Plus, Upload, Server, Info, Edit, Trash2, Search, Save } from 'lucide-react';

const officeSites = [
  { id: 1, name: 'New York HQ', address: '350 Fifth Avenue', city: 'New York', country: 'United States', tier: 'Tier 1' },
  { id: 2, name: 'London Office', address: '20 Fenchurch Street', city: 'London', country: 'United Kingdom', tier: 'Tier 1' },
  { id: 3, name: 'Tokyo Center', address: '1-1-2 Ōtemachi, Chiyoda City', city: 'Tokyo', country: 'Japan', tier: 'Tier 1' },
  { id: 4, name: 'Singapore Hub', address: '8 Marina View', city: 'Singapore', country: 'Singapore', tier: 'Tier 2' },
  { id: 5, name: 'Sydney Office', address: '1 Macquarie Place', city: 'Sydney', country: 'Australia', tier: 'Tier 2' },
];

const initialCriticalAssets = [
  { id: 1, name: 'Core Switches', description: 'Primary network backbone infrastructure', criticality: 5, siteId: 1 },
  { id: 2, name: 'Distribution Switches', description: 'Connect access layer switches to the core', criticality: 4, siteId: 1 },
  { id: 3, name: 'Access Switches (wireless)', description: 'Connect wireless access points to the network', criticality: 3, siteId: 2 },
  { id: 4, name: 'WiFi: Access Controllers (MDF)', description: 'Manage wireless access points', criticality: 4, siteId: 2 },
  { id: 5, name: 'WiFi: Access Points (Floor)', description: 'Provide wireless network access', criticality: 3, siteId: 3 },
  { id: 6, name: 'Internet Circuit', description: 'Primary internet connection', criticality: 5, siteId: 3 },
  { id: 7, name: 'Internet Gateway (SD WAN) Velo', description: 'Primary SD-WAN gateway', criticality: 5, siteId: 4 },
  { id: 8, name: 'Internet Gateway (SD WAN) Ark', description: 'Secondary SD-WAN gateway', criticality: 4, siteId: 5 },
];

const initialConfigItems = [
  { id: 1, assetId: 1, name: 'Cisco Catalyst 9500', manufacturer: 'Cisco', eolDate: '2026-12-31', eowDate: '2025-06-30', rma: 'Yes', inUse: 24, inStock: 4 },
  { id: 2, assetId: 1, name: 'Juniper EX9200', manufacturer: 'Juniper', eolDate: '2027-05-15', eowDate: '2026-01-15', rma: 'Yes', inUse: 12, inStock: 2 },
  { id: 3, assetId: 2, name: 'Cisco Catalyst 9300', manufacturer: 'Cisco', eolDate: '2025-03-31', eowDate: '2024-09-30', rma: 'Yes', inUse: 48, inStock: 6 },
  { id: 4, assetId: 3, name: 'Cisco Catalyst 9200', manufacturer: 'Cisco', eolDate: '2026-06-30', eowDate: '2025-12-31', rma: 'Yes', inUse: 96, inStock: 12 },
  { id: 5, assetId: 4, name: 'Cisco 9800 Series', manufacturer: 'Cisco', eolDate: '2027-09-30', eowDate: '2026-03-31', rma: 'Yes', inUse: 8, inStock: 2 },
  { id: 6, assetId: 5, name: 'Cisco Aironet 9120', manufacturer: 'Cisco', eolDate: '2025-12-31', eowDate: '2025-06-30', rma: 'Yes', inUse: 150, inStock: 15 },
];

const CriticalITAssets = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<number | null>(null);
  const [criticalAssets, setCriticalAssets] = useState(initialCriticalAssets);
  const [configItems, setConfigItems] = useState(initialConfigItems);
  const [selectedSiteId, setSelectedSiteId] = useState<number | null>(null);
  
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);
  const [isEditAssetOpen, setIsEditAssetOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isAddCIOpen, setIsAddCIOpen] = useState(false);
  const [isImportCIOpen, setIsImportCIOpen] = useState(false);
  const [newAsset, setNewAsset] = useState({ name: '', description: '', criticality: '3', siteId: '' });
  const [newCI, setNewCI] = useState({ name: '', manufacturer: '', eolDate: '', eowDate: '', rma: 'Yes', inUse: '1', inStock: '0' });
  const [editingAsset, setEditingAsset] = useState<any>(null);
  const [editingCI, setEditingCI] = useState<any>(null);
  const [deleteAssetId, setDeleteAssetId] = useState<number | null>(null);
  const [deleteCIId, setDeleteCIId] = useState<number | null>(null);

  const filteredAssets = criticalAssets.filter(asset => 
    (selectedSiteId === null || asset.siteId === selectedSiteId) &&
    (asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredConfigItems = configItems.filter(item => 
    item.assetId === selectedAsset
  );
  
  const getSiteName = (siteId: number) => {
    const site = officeSites.find(site => site.id === siteId);
    return site ? site.name : 'Unknown Site';
  };

  const handleAddAsset = () => {
    if (!newAsset.name.trim() || !newAsset.siteId) {
      toast({
        title: "Validation Error",
        description: "Asset name and site are required",
        variant: "destructive"
      });
      return;
    }

    const newId = Math.max(0, ...criticalAssets.map(a => a.id)) + 1;
    const newAssetObj = {
      id: newId,
      name: newAsset.name.trim(),
      description: newAsset.description.trim(),
      criticality: parseInt(newAsset.criticality),
      siteId: parseInt(newAsset.siteId)
    };

    setCriticalAssets([...criticalAssets, newAssetObj]);
    setNewAsset({ name: '', description: '', criticality: '3', siteId: '' });
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

    setCriticalAssets(criticalAssets.map(asset => 
      asset.id === editingAsset.id ? {
        ...asset,
        name: editingAsset.name.trim(),
        description: editingAsset.description.trim(),
        criticality: parseInt(editingAsset.criticality),
        siteId: parseInt(editingAsset.siteId)
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
    
    setCriticalAssets(criticalAssets.filter(asset => asset.id !== deleteAssetId));
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

  const handleBulkUpload = () => {
    toast({
      title: "Bulk Upload",
      description: "File uploaded successfully. Processing data...",
    });
    setIsBulkUploadOpen(false);
    
    setTimeout(() => {
      toast({
        title: "Import Complete",
        description: "3 assets and 12 configuration items were imported successfully.",
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

  return (
    <MainLayout>
      <PageTitle 
        title="Critical IT Assets"
        description="Manage and configure critical IT assets and their configuration items for office sites."
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
                  <DialogTitle>Bulk Upload Assets & Configuration Items</DialogTitle>
                  <DialogDescription>
                    Upload a CSV file containing assets and configuration items.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="py-4">
                  <Label htmlFor="file-upload">Upload File</Label>
                  <Input id="file-upload" type="file" className="mt-2" />
                  
                  <div className="mt-4 text-sm">
                    <p className="font-medium">File Format Requirements:</p>
                    <ul className="list-disc pl-5 mt-2 text-muted-foreground">
                      <li>CSV file with headers</li>
                      <li>First sheet should contain assets</li>
                      <li>Second sheet should contain configuration items</li>
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
            
            <Dialog open={isAddAssetOpen} onOpenChange={setIsAddAssetOpen}>
              <DialogTrigger asChild>
                <Button className="gap-1">
                  <Plus className="h-4 w-4" />
                  Add Asset
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Asset</DialogTitle>
                  <DialogDescription>
                    Add a new critical IT asset to an office site.
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-asset-criticality">Criticality Level (1-5) *</Label>
                    <Select 
                      value={newAsset.criticality}
                      onValueChange={(value) => setNewAsset({...newAsset, criticality: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select criticality level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - Low</SelectItem>
                        <SelectItem value="2">2 - Moderate-Low</SelectItem>
                        <SelectItem value="3">3 - Moderate</SelectItem>
                        <SelectItem value="4">4 - High</SelectItem>
                        <SelectItem value="5">5 - Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-asset-site">Office Site *</Label>
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
                            {site.name} ({site.city})
                          </SelectItem>
                        ))}
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
          </>
        }
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Asset List</CardTitle>
                <Select 
                  value={selectedSiteId ? selectedSiteId.toString() : "all"}
                  onValueChange={(value) => setSelectedSiteId(value === "all" ? null : parseInt(value))}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by site" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sites</SelectItem>
                    {officeSites.map(site => (
                      <SelectItem key={site.id} value={site.id.toString()}>
                        {site.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search assets..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="space-y-1 max-h-[500px] overflow-y-auto pr-1">
                {filteredAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className={`p-3 rounded-md cursor-pointer transition-colors ${
                      selectedAsset === asset.id
                        ? 'bg-primary/10 border border-primary/20'
                        : 'hover:bg-accent'
                    }`}
                    onClick={() => setSelectedAsset(asset.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-sm">{asset.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{asset.description}</div>
                        <div className="text-xs text-primary mt-1">{getSiteName(asset.siteId)}</div>
                      </div>
                      <Badge 
                        variant={asset.criticality >= 4 ? "destructive" : "secondary"}
                        className="ml-2"
                      >
                        Criticality: {asset.criticality}
                      </Badge>
                    </div>
                  </div>
                ))}
                
                {filteredAssets.length === 0 && (
                  <div className="py-8 text-center text-muted-foreground">
                    <Server className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>{searchTerm ? `No assets found matching "${searchTerm}"` : "No assets for the selected site"}</p>
                    <Button 
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        setSearchTerm('');
                        if (selectedSiteId) setSelectedSiteId(null);
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          {selectedAsset ? (
            <>
              <Card className="shadow-sm">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-lg">
                        {criticalAssets.find(a => a.id === selectedAsset)?.name}
                      </CardTitle>
                      <Badge variant="outline" className="font-normal">
                        {getSiteName(criticalAssets.find(a => a.id === selectedAsset)?.siteId || 0)}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {criticalAssets.find(a => a.id === selectedAsset)?.description}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Dialog open={isEditAssetOpen} onOpenChange={setIsEditAssetOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            const asset = criticalAssets.find(a => a.id === selectedAsset);
                            if (asset) {
                              setEditingAsset({
                                ...asset,
                                criticality: asset.criticality.toString(),
                                siteId: asset.siteId.toString()
                              });
                            }
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Asset</DialogTitle>
                          <DialogDescription>
                            Update the asset details.
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
                          
                          <div className="space-y-2">
                            <Label htmlFor="edit-asset-criticality">Criticality Level (1-5) *</Label>
                            <Select 
                              value={editingAsset?.criticality || '3'}
                              onValueChange={(value) => setEditingAsset({...editingAsset, criticality: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select criticality level" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1 - Low</SelectItem>
                                <SelectItem value="2">2 - Moderate-Low</SelectItem>
                                <SelectItem value="3">3 - Moderate</SelectItem>
                                <SelectItem value="4">4 - High</SelectItem>
                                <SelectItem value="5">5 - Critical</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="edit-asset-site">Office Site *</Label>
                            <Select 
                              value={editingAsset?.siteId?.toString() || ''}
                              onValueChange={(value) => setEditingAsset({...editingAsset, siteId: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select site" />
                              </SelectTrigger>
                              <SelectContent>
                                {officeSites.map(site => (
                                  <SelectItem key={site.id} value={site.id.toString()}>
                                    {site.name} ({site.city})
                                  </SelectItem>
                                ))}
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
                          variant="destructive" 
                          size="sm"
                          onClick={() => setDeleteAssetId(selectedAsset)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
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
                </CardHeader>
              </Card>
              
              <Card className="shadow-sm">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Configuration Items</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Dialog open={isImportCIOpen} onOpenChange={setIsImportCIOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4 mr-1" />
                          Import
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Import Configuration Items</DialogTitle>
                          <DialogDescription>
                            Upload a CSV file containing configuration items for this asset.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="py-4">
                          <Label htmlFor="ci-file-upload">Upload File</Label>
                          <Input id="ci-file-upload" type="file" className="mt-2" />
                          
                          <div className="mt-4 text-sm">
                            <p className="font-medium">File Format Requirements:</p>
                            <ul className="list-disc pl-5 mt-2 text-muted-foreground">
                              <li>CSV file with headers</li>
                              <li>Required columns: Name, Manufacturer, EOL_Date, EOW_Date, RMA, In_Use, In_Stock</li>
                            </ul>
                          </div>
                        </div>
                        
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsImportCIOpen(false)}>Cancel</Button>
                          <Button onClick={handleImportCI}>Upload</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    <Dialog open={isAddCIOpen} onOpenChange={setIsAddCIOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          Add CI
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Configuration Item</DialogTitle>
                          <DialogDescription>
                            Add a new configuration item for this asset.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="ci-name">Name *</Label>
                            <Input 
                              id="ci-name" 
                              placeholder="e.g. Cisco Catalyst 9500" 
                              value={newCI.name}
                              onChange={(e) => setNewCI({...newCI, name: e.target.value})}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="ci-manufacturer">Manufacturer *</Label>
                            <Input 
                              id="ci-manufacturer" 
                              placeholder="e.g. Cisco" 
                              value={newCI.manufacturer}
                              onChange={(e) => setNewCI({...newCI, manufacturer: e.target.value})}
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="ci-eol">End of Life Date</Label>
                              <Input 
                                id="ci-eol" 
                                type="date"
                                value={newCI.eolDate}
                                onChange={(e) => setNewCI({...newCI, eolDate: e.target.value})}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="ci-eow">End of Warranty Date</Label>
                              <Input 
                                id="ci-eow" 
                                type="date"
                                value={newCI.eowDate}
                                onChange={(e) => setNewCI({...newCI, eowDate: e.target.value})}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="ci-rma">RMA Available</Label>
                            <Select 
                              value={newCI.rma}
                              onValueChange={(value) => setNewCI({...newCI, rma: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select option" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Yes">Yes</SelectItem>
                                <SelectItem value="No">No</SelectItem>
                                <SelectItem value="Partial">Partial</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="ci-in-use">Quantity In Use</Label>
                              <Input 
                                id="ci-in-use" 
                                type="number"
                                min="0"
                                value={newCI.inUse}
                                onChange={(e) => setNewCI({...newCI, inUse: e.target.value})}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="ci-in-stock">Quantity In Stock</Label>
                              <Input 
                                id="ci-in-stock" 
                                type="number"
                                min="0"
                                value={newCI.inStock}
                                onChange={(e) => setNewCI({...newCI, inStock: e.target.value})}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsAddCIOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAddCI}>Add Item</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Model</TableHead>
                        <TableHead>Manufacturer</TableHead>
                        <TableHead>EOL Date</TableHead>
                        <TableHead>EOW Date</TableHead>
                        <TableHead>RMA</TableHead>
                        <TableHead>In Use</TableHead>
                        <TableHead>In Stock</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredConfigItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.manufacturer}</TableCell>
                          <TableCell>{item.eolDate}</TableCell>
                          <TableCell>{item.eowDate}</TableCell>
                          <TableCell>{item.rma}</TableCell>
                          <TableCell>{item.inUse}</TableCell>
                          <TableCell>{item.inStock}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-1">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => setEditingCI(item)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit Configuration Item</DialogTitle>
                                    <DialogDescription>
                                      Update this configuration item.
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-ci-name">Name *</Label>
                                      <Input 
                                        id="edit-ci-name" 
                                        placeholder="e.g. Cisco Catalyst 9500" 
                                        value={editingCI?.name || ''}
                                        onChange={(e) => setEditingCI({...editingCI, name: e.target.value})}
                                      />
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-ci-manufacturer">Manufacturer *</Label>
                                      <Input 
                                        id="edit-ci-manufacturer" 
                                        placeholder="e.g. Cisco" 
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
                                    
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-ci-rma">RMA Available</Label>
                                      <Select 
                                        value={editingCI?.rma || 'Yes'}
                                        onValueChange={(value) => setEditingCI({...editingCI, rma: value})}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select option" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Yes">Yes</SelectItem>
                                          <SelectItem value="No">No</SelectItem>
                                          <SelectItem value="Partial">Partial</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="edit-ci-in-use">Quantity In Use</Label>
                                        <Input 
                                          id="edit-ci-in-use" 
                                          type="number"
                                          min="0"
                                          value={editingCI?.inUse.toString() || '0'}
                                          onChange={(e) => setEditingCI({...editingCI, inUse: e.target.value})}
                                        />
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <Label htmlFor="edit-ci-in-stock">Quantity In Stock</Label>
                                        <Input 
                                          id="edit-ci-in-stock" 
                                          type="number"
                                          min="0"
                                          value={editingCI?.inStock.toString() || '0'}
                                          onChange={(e) => setEditingCI({...editingCI, inStock: e.target.value})}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setEditingCI(null)}>
                                      Cancel
                                    </Button>
                                    <Button onClick={handleEditCI}>Save Changes</Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => setDeleteCIId(item.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Configuration Item</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this configuration item? This action cannot be undone.
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
                  
                  {filteredConfigItems.length === 0 && (
                    <div className="py-12 text-center text-muted-foreground">
                      <Info className="h-12 w-12 mx-auto mb-3 opacity-20" />
                      <p>No configuration items added for this asset</p>
                      <Button 
                        size="sm" 
                        className="mt-4"
                        onClick={() => setIsAddCIOpen(true)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add First Item
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="shadow-sm h-[400px] flex flex-col items-center justify-center text-center p-6">
              <Server className="h-16 w-16 mb-4 text-muted-foreground/40" />
              <h3 className="text-xl font-medium mb-2">Select an Asset</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                Select a critical IT asset from the list to view its details and manage configuration items.
              </p>
              <Button onClick={() => setIsAddAssetOpen(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Create New Asset
              </Button>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default CriticalITAssets;
