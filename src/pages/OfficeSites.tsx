
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageTitle } from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FilterBar } from '@/components/ui/FilterBar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Building, Search, MapPin } from 'lucide-react';
import { officeSites, Site } from '@/data/officeSites';
import { Badge } from '@/components/ui/badge';

const OfficeSites = () => {
  const { toast } = useToast();
  const [sites, setSites] = useState<Site[]>(officeSites);
  const [filterText, setFilterText] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterTier, setFilterTier] = useState<string>('all');
  
  const [showAddSiteDialog, setShowAddSiteDialog] = useState<boolean>(false);
  const [showEditSiteDialog, setShowEditSiteDialog] = useState<boolean>(false);
  const [currentSite, setCurrentSite] = useState<Site | null>(null);
  
  const [newSite, setNewSite] = useState<Omit<Site, 'id'>>({
    name: '',
    address: '',
    city: '',
    country: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    type: 'Office',
    notes: '',
    tier: 'Tier 1'
  });
  
  const filteredSites = sites.filter(site => {
    const matchesText = filterText === '' || 
      site.name.toLowerCase().includes(filterText.toLowerCase()) ||
      site.city.toLowerCase().includes(filterText.toLowerCase()) ||
      site.country.toLowerCase().includes(filterText.toLowerCase());
    
    const matchesType = filterType === 'all' || site.type === filterType;
    const matchesTier = filterTier === 'all' || site.tier === filterTier;
    
    return matchesText && matchesType && matchesTier;
  });

  const handleAddSite = () => {
    const newId = Math.max(...sites.map(site => site.id), 0) + 1;
    const siteToAdd = { ...newSite, id: newId };
    
    setSites([...sites, siteToAdd]);
    setShowAddSiteDialog(false);
    
    // Reset form
    setNewSite({
      name: '',
      address: '',
      city: '',
      country: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      type: 'Office',
      notes: '',
      tier: 'Tier 1'
    });
    
    toast({
      title: 'Site added',
      description: `${siteToAdd.name} has been added successfully.`,
    });
  };
  
  const handleEditSite = (site: Site) => {
    setCurrentSite(site);
    setShowEditSiteDialog(true);
  };
  
  const handleUpdateSite = () => {
    if (!currentSite) return;
    
    setSites(sites.map(site => 
      site.id === currentSite.id ? currentSite : site
    ));
    
    setShowEditSiteDialog(false);
    
    toast({
      title: 'Site updated',
      description: `${currentSite.name} has been updated successfully.`,
    });
  };
  
  const handleDeleteSite = (siteId: number) => {
    setSites(sites.filter(site => site.id !== siteId));
    
    toast({
      title: 'Site deleted',
      description: 'The site has been deleted successfully.',
    });
  };

  const getTierBadgeVariant = (tier?: string) => {
    switch (tier) {
      case 'Tier 1':
        return 'default';
      case 'Tier 2':
        return 'secondary';
      case 'Tier 3':
        return 'outline';
      default:
        return 'outline';
    }
  };
  
  return (
    <MainLayout>
      <PageTitle 
        title="Office Sites" 
        description="Manage your company's office sites and locations globally."
        actions={
          <Button onClick={() => setShowAddSiteDialog(true)}>
            Add New Site
          </Button>
        }
      />
      
      <FilterBar>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative w-[300px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sites..."
              className="pl-8"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Select
              value={filterType}
              onValueChange={setFilterType}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Office">Office</SelectItem>
                <SelectItem value="Coworking">Coworking</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={filterTier}
              onValueChange={setFilterTier}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="Tier 1">Tier 1</SelectItem>
                <SelectItem value="Tier 2">Tier 2</SelectItem>
                <SelectItem value="Tier 3">Tier 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </FilterBar>
      
      <div className="mt-6">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSites.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <Building className="mx-auto h-12 w-12 text-muted-foreground/30 mb-3" />
                      <p className="text-lg font-medium">No sites found</p>
                      <p className="text-muted-foreground mt-1">
                        Add a new site or adjust your search.
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSites.map((site) => (
                    <TableRow key={site.id}>
                      <TableCell className="font-medium">{site.name}</TableCell>
                      <TableCell>{site.city}</TableCell>
                      <TableCell>{site.country}</TableCell>
                      <TableCell>{site.type}</TableCell>
                      <TableCell>
                        {site.tier && (
                          <Badge variant={getTierBadgeVariant(site.tier)}>
                            {site.tier}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{site.contactName}</div>
                          <div className="text-muted-foreground">{site.contactEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => handleEditSite(site)}
                          variant="outline"
                          size="sm"
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      {/* Add Site Dialog */}
      <Dialog open={showAddSiteDialog} onOpenChange={setShowAddSiteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Site</DialogTitle>
            <DialogDescription>
              Add a new office site or location.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="site-name">Site Name</Label>
                <Input
                  id="site-name"
                  value={newSite.name}
                  onChange={(e) => setNewSite({ ...newSite, name: e.target.value })}
                  placeholder="Office name"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="site-type">Site Type</Label>
                <Select
                  value={newSite.type}
                  onValueChange={(value) => setNewSite({ ...newSite, type: value })}
                >
                  <SelectTrigger id="site-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Office">Office</SelectItem>
                    <SelectItem value="Coworking">Coworking</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="site-address">Address</Label>
              <Input
                id="site-address"
                value={newSite.address}
                onChange={(e) => setNewSite({ ...newSite, address: e.target.value })}
                placeholder="Street address"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="site-city">City</Label>
                <Input
                  id="site-city"
                  value={newSite.city}
                  onChange={(e) => setNewSite({ ...newSite, city: e.target.value })}
                  placeholder="City"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="site-country">Country</Label>
                <Input
                  id="site-country"
                  value={newSite.country}
                  onChange={(e) => setNewSite({ ...newSite, country: e.target.value })}
                  placeholder="Country"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="site-tier">Tier</Label>
              <Select
                value={newSite.tier}
                onValueChange={(value) => setNewSite({ ...newSite, tier: value })}
              >
                <SelectTrigger id="site-tier">
                  <SelectValue placeholder="Select tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tier 1">Tier 1</SelectItem>
                  <SelectItem value="Tier 2">Tier 2</SelectItem>
                  <SelectItem value="Tier 3">Tier 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="site-contact-name">Contact Name</Label>
              <Input
                id="site-contact-name"
                value={newSite.contactName}
                onChange={(e) => setNewSite({ ...newSite, contactName: e.target.value })}
                placeholder="Primary contact"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="site-contact-email">Contact Email</Label>
                <Input
                  id="site-contact-email"
                  value={newSite.contactEmail}
                  onChange={(e) => setNewSite({ ...newSite, contactEmail: e.target.value })}
                  placeholder="Email address"
                  type="email"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="site-contact-phone">Contact Phone</Label>
                <Input
                  id="site-contact-phone"
                  value={newSite.contactPhone}
                  onChange={(e) => setNewSite({ ...newSite, contactPhone: e.target.value })}
                  placeholder="Phone number"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="site-notes">Notes</Label>
              <Textarea
                id="site-notes"
                value={newSite.notes}
                onChange={(e) => setNewSite({ ...newSite, notes: e.target.value })}
                placeholder="Additional information about this site"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddSiteDialog(false)}>Cancel</Button>
            <Button onClick={handleAddSite}>Add Site</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Site Dialog */}
      {currentSite && (
        <Dialog open={showEditSiteDialog} onOpenChange={setShowEditSiteDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Site</DialogTitle>
              <DialogDescription>
                Update site information.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-site-name">Site Name</Label>
                  <Input
                    id="edit-site-name"
                    value={currentSite.name}
                    onChange={(e) => setCurrentSite({ ...currentSite, name: e.target.value })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-site-type">Site Type</Label>
                  <Select
                    value={currentSite.type}
                    onValueChange={(value) => setCurrentSite({ ...currentSite, type: value })}
                  >
                    <SelectTrigger id="edit-site-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Office">Office</SelectItem>
                      <SelectItem value="Coworking">Coworking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-site-address">Address</Label>
                <Input
                  id="edit-site-address"
                  value={currentSite.address}
                  onChange={(e) => setCurrentSite({ ...currentSite, address: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-site-city">City</Label>
                  <Input
                    id="edit-site-city"
                    value={currentSite.city}
                    onChange={(e) => setCurrentSite({ ...currentSite, city: e.target.value })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-site-country">Country</Label>
                  <Input
                    id="edit-site-country"
                    value={currentSite.country}
                    onChange={(e) => setCurrentSite({ ...currentSite, country: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-site-tier">Tier</Label>
                <Select
                  value={currentSite.tier}
                  onValueChange={(value) => setCurrentSite({ ...currentSite, tier: value })}
                >
                  <SelectTrigger id="edit-site-tier">
                    <SelectValue placeholder="Select tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tier 1">Tier 1</SelectItem>
                    <SelectItem value="Tier 2">Tier 2</SelectItem>
                    <SelectItem value="Tier 3">Tier 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-site-contact-name">Contact Name</Label>
                <Input
                  id="edit-site-contact-name"
                  value={currentSite.contactName}
                  onChange={(e) => setCurrentSite({ ...currentSite, contactName: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-site-contact-email">Contact Email</Label>
                  <Input
                    id="edit-site-contact-email"
                    value={currentSite.contactEmail}
                    onChange={(e) => setCurrentSite({ ...currentSite, contactEmail: e.target.value })}
                    type="email"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-site-contact-phone">Contact Phone</Label>
                  <Input
                    id="edit-site-contact-phone"
                    value={currentSite.contactPhone}
                    onChange={(e) => setCurrentSite({ ...currentSite, contactPhone: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-site-notes">Notes</Label>
                <Textarea
                  id="edit-site-notes"
                  value={currentSite.notes}
                  onChange={(e) => setCurrentSite({ ...currentSite, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="destructive" 
                onClick={() => {
                  handleDeleteSite(currentSite.id);
                  setShowEditSiteDialog(false);
                }}
                className="mr-auto"
              >
                Delete
              </Button>
              <Button variant="outline" onClick={() => setShowEditSiteDialog(false)}>Cancel</Button>
              <Button onClick={handleUpdateSite}>Update Site</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </MainLayout>
  );
};

export default OfficeSites;
