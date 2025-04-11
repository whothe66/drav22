
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageTitle } from '@/components/ui/PageTitle';
import { FilterBar } from '@/components/ui/FilterBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Calendar as CalendarIcon, Flag, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Site {
  id: string;
  name: string;
  location: string;
  country: string;
}

interface Issue {
  id: string;
  name: string;
  description: string;
  siteId: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  reportedBy: string;
  reportedDate: Date;
  resolvedDate?: Date;
  owner: string;
}

// Sample sites
const sites: Site[] = [
  { id: '1', name: 'New York', location: 'New York', country: 'USA' },
  { id: '2', name: 'London', location: 'London', country: 'UK' },
  { id: '3', name: 'Tokyo', location: 'Tokyo', country: 'Japan' },
  { id: '4', name: 'Singapore', location: 'Singapore', country: 'Singapore' },
  { id: '5', name: 'Sydney', location: 'Sydney', country: 'Australia' },
];

// Sample issues
const initialIssues: Issue[] = [
  {
    id: 'ISS-001',
    name: 'Failed UPS battery test',
    description: 'The monthly UPS battery test failed, indicating potential battery capacity issues.',
    siteId: '1',
    severity: 'High',
    status: 'Open',
    reportedBy: 'John Smith',
    reportedDate: new Date(2025, 0, 15),
    owner: 'Sarah Johnson'
  },
  {
    id: 'ISS-002',
    name: 'Internet circuit outage',
    description: 'Primary internet circuit experienced an outage due to provider network issues.',
    siteId: '2',
    severity: 'Critical',
    status: 'Resolved',
    reportedBy: 'Emma Williams',
    reportedDate: new Date(2025, 1, 3),
    resolvedDate: new Date(2025, 1, 4),
    owner: 'David Brown'
  },
  {
    id: 'ISS-003',
    name: 'Core switch failure',
    description: 'Power supply failure on the primary core switch caused service disruption.',
    siteId: '3',
    severity: 'Critical',
    status: 'Resolved',
    reportedBy: 'Taro Yamada',
    reportedDate: new Date(2025, 1, 10),
    resolvedDate: new Date(2025, 1, 11),
    owner: 'Yuki Nakamura'
  },
  {
    id: 'ISS-004',
    name: 'Cooling system malfunction',
    description: 'Datacenter cooling system showing intermittent temperature control issues.',
    siteId: '4',
    severity: 'Medium',
    status: 'In Progress',
    reportedBy: 'Mei Lin',
    reportedDate: new Date(2025, 2, 5),
    owner: 'Chen Wei'
  },
  {
    id: 'ISS-005',
    name: 'DNS resolution issues',
    description: 'Internal DNS servers experiencing intermittent resolution failures for external domains.',
    siteId: '5',
    severity: 'Medium',
    status: 'Open',
    reportedBy: 'James Wilson',
    reportedDate: new Date(2025, 2, 18),
    owner: 'Emily Taylor'
  },
];

const IssueRegister = () => {
  const { toast } = useToast();
  const [issues, setIssues] = useState<Issue[]>(initialIssues);
  const [filterSite, setFilterSite] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  const [showAddIssueDialog, setShowAddIssueDialog] = useState(false);
  const [showViewIssueDialog, setShowViewIssueDialog] = useState(false);
  const [showEditIssueDialog, setShowEditIssueDialog] = useState(false);
  
  const [currentIssue, setCurrentIssue] = useState<Issue | null>(null);
  
  const [newIssue, setNewIssue] = useState<Omit<Issue, 'id'>>({
    name: '',
    description: '',
    siteId: '',
    severity: 'Medium',
    status: 'Open',
    reportedBy: '',
    reportedDate: new Date(),
    owner: ''
  });
  
  const filteredIssues = issues.filter(issue => {
    const matchesSite = filterSite === 'all' || issue.siteId === filterSite;
    const matchesSeverity = filterSeverity === 'all' || issue.severity === filterSeverity;
    const matchesStatus = filterStatus === 'all' || issue.status === filterStatus;
    return matchesSite && matchesSeverity && matchesStatus;
  });
  
  const getSiteName = (siteId: string) => {
    const site = sites.find(site => site.id === siteId);
    return site ? site.name : 'Unknown';
  };
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-destructive text-destructive-foreground';
      case 'High': return 'bg-warning text-warning-foreground';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-muted text-muted-foreground';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-purple-100 text-purple-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-muted text-muted-foreground';
    }
  };
  
  const handleAddIssue = () => {
    const id = `ISS-${(issues.length + 1).toString().padStart(3, '0')}`;
    const issueToAdd = { ...newIssue, id };
    
    setIssues([...issues, issueToAdd]);
    setShowAddIssueDialog(false);
    
    // Reset form
    setNewIssue({
      name: '',
      description: '',
      siteId: '',
      severity: 'Medium',
      status: 'Open',
      reportedBy: '',
      reportedDate: new Date(),
      owner: ''
    });
    
    toast({
      title: "Issue added",
      description: `Issue ${id} has been added successfully.`,
    });
  };
  
  const handleViewIssueDetails = (issue: Issue) => {
    setCurrentIssue(issue);
    setShowViewIssueDialog(true);
  };
  
  const handleEditIssue = (issue: Issue) => {
    setCurrentIssue(issue);
    setShowEditIssueDialog(true);
  };
  
  const handleDeleteIssue = (issueId: string) => {
    setIssues(issues.filter(issue => issue.id !== issueId));
    
    toast({
      title: "Issue deleted",
      description: `Issue ${issueId} has been deleted successfully.`,
    });
  };
  
  const handleUpdateIssue = () => {
    if (!currentIssue) return;
    
    setIssues(issues.map(issue => 
      issue.id === currentIssue.id ? currentIssue : issue
    ));
    
    setShowEditIssueDialog(false);
    
    toast({
      title: "Issue updated",
      description: `Issue ${currentIssue.id} has been updated successfully.`,
    });
  };
  
  return (
    <MainLayout>
      <PageTitle 
        title="Issue Register" 
        description="Track and manage disaster recovery issues across all sites."
        actions={
          <Button onClick={() => setShowAddIssueDialog(true)}>
            Add New Issue
          </Button>
        }
      />
      
      <FilterBar>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Select
              value={filterSite}
              onValueChange={setFilterSite}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by site" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sites</SelectItem>
                {sites.map((site) => (
                  <SelectItem key={site.id} value={site.id}>
                    {site.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Select
              value={filterSeverity}
              onValueChange={setFilterSeverity}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Select
              value={filterStatus}
              onValueChange={setFilterStatus}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
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
                  <TableHead>ID</TableHead>
                  <TableHead>Issue</TableHead>
                  <TableHead>Site</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reported By</TableHead>
                  <TableHead>Reported Date</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIssues.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <Flag className="mx-auto h-12 w-12 text-muted-foreground/30 mb-3" />
                      <p className="text-lg font-medium">No issues found</p>
                      <p className="text-muted-foreground mt-1">
                        Add a new issue or adjust your filters.
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredIssues.map((issue) => (
                    <TableRow key={issue.id}>
                      <TableCell className="font-medium">{issue.id}</TableCell>
                      <TableCell>{issue.name}</TableCell>
                      <TableCell>{getSiteName(issue.siteId)}</TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(issue.severity)}>
                          {issue.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(issue.status)}>
                          {issue.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{issue.reportedBy}</TableCell>
                      <TableCell>{format(issue.reportedDate, 'MMM d, yyyy')}</TableCell>
                      <TableCell>{issue.owner}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={() => handleViewIssueDetails(issue)}
                            variant="outline"
                            size="sm"
                          >
                            View
                          </Button>
                          <Button
                            onClick={() => handleEditIssue(issue)}
                            variant="outline"
                            size="sm"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDeleteIssue(issue.id)}
                            variant="destructive"
                            size="sm"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      {/* Add Issue Dialog */}
      <Dialog open={showAddIssueDialog} onOpenChange={setShowAddIssueDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Issue</DialogTitle>
            <DialogDescription>
              Add a new issue to the register.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="issue-name">Issue Name</Label>
              <Input
                id="issue-name"
                value={newIssue.name}
                onChange={(e) => setNewIssue({ ...newIssue, name: e.target.value })}
                placeholder="Enter issue name"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="issue-description">Description</Label>
              <Textarea
                id="issue-description"
                value={newIssue.description}
                onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
                placeholder="Describe the issue"
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="issue-site">Site</Label>
              <Select
                value={newIssue.siteId}
                onValueChange={(value) => setNewIssue({ ...newIssue, siteId: value })}
              >
                <SelectTrigger id="issue-site">
                  <SelectValue placeholder="Select site" />
                </SelectTrigger>
                <SelectContent>
                  {sites.map((site) => (
                    <SelectItem key={site.id} value={site.id}>
                      {site.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="issue-severity">Severity</Label>
                <Select
                  value={newIssue.severity}
                  onValueChange={(value) => setNewIssue({ ...newIssue, severity: value as Issue['severity'] })}
                >
                  <SelectTrigger id="issue-severity">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="issue-status">Status</Label>
                <Select
                  value={newIssue.status}
                  onValueChange={(value) => setNewIssue({ ...newIssue, status: value as Issue['status'] })}
                >
                  <SelectTrigger id="issue-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="issue-reported-by">Reported By</Label>
              <Input
                id="issue-reported-by"
                value={newIssue.reportedBy}
                onChange={(e) => setNewIssue({ ...newIssue, reportedBy: e.target.value })}
                placeholder="Name of reporter"
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Reported Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newIssue.reportedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newIssue.reportedDate ? format(newIssue.reportedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newIssue.reportedDate}
                    onSelect={(date) => date && setNewIssue({ ...newIssue, reportedDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="issue-owner">Owner</Label>
              <Input
                id="issue-owner"
                value={newIssue.owner}
                onChange={(e) => setNewIssue({ ...newIssue, owner: e.target.value })}
                placeholder="Issue owner"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddIssueDialog(false)}>Cancel</Button>
            <Button onClick={handleAddIssue}>Add Issue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Issue Dialog */}
      {currentIssue && (
        <Dialog open={showViewIssueDialog} onOpenChange={setShowViewIssueDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Issue Details: {currentIssue.id}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <h3 className="font-medium">{currentIssue.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{currentIssue.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Site</p>
                  <p className="text-sm">{getSiteName(currentIssue.siteId)}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Severity</p>
                  <Badge className={getSeverityColor(currentIssue.severity)}>
                    {currentIssue.severity}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge className={getStatusColor(currentIssue.status)}>
                    {currentIssue.status}
                  </Badge>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Owner</p>
                  <p className="text-sm">{currentIssue.owner}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Reported By</p>
                  <p className="text-sm">{currentIssue.reportedBy}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Reported Date</p>
                  <p className="text-sm">{format(currentIssue.reportedDate, 'PPP')}</p>
                </div>
              </div>
              
              {currentIssue.resolvedDate && (
                <div>
                  <p className="text-sm font-medium">Resolved Date</p>
                  <p className="text-sm">{format(currentIssue.resolvedDate, 'PPP')}</p>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowViewIssueDialog(false)}>Close</Button>
              <Button onClick={() => {
                setShowViewIssueDialog(false);
                handleEditIssue(currentIssue);
              }}>Edit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Edit Issue Dialog */}
      {currentIssue && (
        <Dialog open={showEditIssueDialog} onOpenChange={setShowEditIssueDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Issue: {currentIssue.id}</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-issue-name">Issue Name</Label>
                <Input
                  id="edit-issue-name"
                  value={currentIssue.name}
                  onChange={(e) => setCurrentIssue({ ...currentIssue, name: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-issue-description">Description</Label>
                <Textarea
                  id="edit-issue-description"
                  value={currentIssue.description}
                  onChange={(e) => setCurrentIssue({ ...currentIssue, description: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-issue-site">Site</Label>
                <Select
                  value={currentIssue.siteId}
                  onValueChange={(value) => setCurrentIssue({ ...currentIssue, siteId: value })}
                >
                  <SelectTrigger id="edit-issue-site">
                    <SelectValue placeholder="Select site" />
                  </SelectTrigger>
                  <SelectContent>
                    {sites.map((site) => (
                      <SelectItem key={site.id} value={site.id}>
                        {site.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-issue-severity">Severity</Label>
                  <Select
                    value={currentIssue.severity}
                    onValueChange={(value) => setCurrentIssue({ ...currentIssue, severity: value as Issue['severity'] })}
                  >
                    <SelectTrigger id="edit-issue-severity">
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Critical">Critical</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-issue-status">Status</Label>
                  <Select
                    value={currentIssue.status}
                    onValueChange={(value) => setCurrentIssue({ ...currentIssue, status: value as Issue['status'] })}
                  >
                    <SelectTrigger id="edit-issue-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-issue-owner">Owner</Label>
                <Input
                  id="edit-issue-owner"
                  value={currentIssue.owner}
                  onChange={(e) => setCurrentIssue({ ...currentIssue, owner: e.target.value })}
                />
              </div>
              
              {currentIssue.status === 'Resolved' || currentIssue.status === 'Closed' ? (
                <div className="grid gap-2">
                  <Label>Resolved Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !currentIssue.resolvedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {currentIssue.resolvedDate ? format(currentIssue.resolvedDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={currentIssue.resolvedDate}
                        onSelect={(date) => date && setCurrentIssue({ ...currentIssue, resolvedDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              ) : null}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditIssueDialog(false)}>Cancel</Button>
              <Button onClick={handleUpdateIssue}>Update Issue</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </MainLayout>
  );
};

export default IssueRegister;
