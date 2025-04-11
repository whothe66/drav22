
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageTitle } from '@/components/ui/PageTitle';
import { FilterBar } from '@/components/ui/FilterBar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, AlertTriangle, RefreshCcw, Trash, Edit, Eye } from 'lucide-react';

interface Risk {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string;
  impact: string;
  probability: string;
  criticality: string;
  mitigationPlan: string;
  assignedTo?: string;
  dueDate?: string;
  createdDate: string;
}

const riskCategories = [
  "System Failure",
  "Data Breach",
  "Natural Disaster",
  "Human Error",
  "Cyber Attack"
];

const riskStatuses = [
  "Active",
  "Monitoring",
  "Mitigated"
];

const riskImpacts = [
  "High",
  "Medium",
  "Low"
];

const riskProbabilities = [
  "High",
  "Medium",
  "Low"
];

const initialRisks: Risk[] = [
  {
    id: 1,
    title: "Server Overload",
    description: "High traffic may cause server downtime.",
    category: "System Failure",
    status: "Active",
    impact: "Medium",
    probability: "High",
    criticality: "High",
    mitigationPlan: "Implement load balancing.",
    assignedTo: "Network Team",
    dueDate: "2025-05-30",
    createdDate: "2025-02-15"
  },
  {
    id: 2,
    title: "Phishing Attack",
    description: "Employees may fall victim to phishing emails.",
    category: "Cyber Attack",
    status: "Monitoring",
    impact: "High",
    probability: "Medium",
    criticality: "High",
    mitigationPlan: "Conduct security awareness training.",
    assignedTo: "Security Team",
    dueDate: "2025-04-15",
    createdDate: "2025-01-20"
  },
  {
    id: 3,
    title: "Data Loss",
    description: "Accidental deletion or corruption of critical data.",
    category: "Human Error",
    status: "Mitigated",
    impact: "High",
    probability: "Low",
    criticality: "Medium",
    mitigationPlan: "Regular data backups.",
    assignedTo: "Database Team",
    dueDate: "2025-03-10",
    createdDate: "2025-01-05"
  }
];

const RiskRegister = () => {
  const { toast } = useToast();
  const [risks, setRisks] = useState<Risk[]>(initialRisks);
  const [open, setOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);
  const [newRisk, setNewRisk] = useState<Risk>({
    id: risks.length + 1,
    title: "",
    description: "",
    category: riskCategories[0],
    status: riskStatuses[0],
    impact: riskImpacts[0],
    probability: riskProbabilities[0],
    criticality: "",
    mitigationPlan: "",
    assignedTo: "",
    dueDate: "",
    createdDate: new Date().toISOString().split('T')[0]
  });

  // Calculate criticality based on impact and probability
  const calculateCriticality = (impact: string, probability: string): string => {
    if (impact === "High" && probability === "High") return "Critical";
    if (impact === "High" && probability === "Medium") return "High";
    if (impact === "Medium" && probability === "High") return "High";
    if (impact === "High" && probability === "Low") return "Medium";
    if (impact === "Medium" && probability === "Medium") return "Medium";
    if (impact === "Low" && probability === "High") return "Medium";
    if (impact === "Medium" && probability === "Low") return "Low";
    if (impact === "Low" && probability === "Medium") return "Low";
    if (impact === "Low" && probability === "Low") return "Low";
    return "Medium"; // Default
  };

  // Update criticality when impact or probability changes
  useEffect(() => {
    if (newRisk.impact && newRisk.probability) {
      const criticality = calculateCriticality(newRisk.impact, newRisk.probability);
      setNewRisk(prev => ({ ...prev, criticality }));
    }
  }, [newRisk.impact, newRisk.probability]);

  // Same effect for editing
  useEffect(() => {
    if (selectedRisk && selectedRisk.impact && selectedRisk.probability) {
      const criticality = calculateCriticality(selectedRisk.impact, selectedRisk.probability);
      setSelectedRisk(prev => prev ? { ...prev, criticality } : null);
    }
  }, [selectedRisk?.impact, selectedRisk?.probability]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewRisk(prev => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!selectedRisk) return;
    const { name, value } = e.target;
    setSelectedRisk(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewRisk(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSelectChange = (name: string, value: string) => {
    if (!selectedRisk) return;
    setSelectedRisk(prev => prev ? { ...prev, [name]: value } : null);
  };

  const addRisk = () => {
    const criticality = calculateCriticality(newRisk.impact, newRisk.probability);
    const riskToAdd = { ...newRisk, criticality, id: risks.length + 1 };
    
    setRisks([...risks, riskToAdd]);
    setNewRisk({
      id: risks.length + 2,
      title: "",
      description: "",
      category: riskCategories[0],
      status: riskStatuses[0],
      impact: riskImpacts[0],
      probability: riskProbabilities[0],
      criticality: "",
      mitigationPlan: "",
      assignedTo: "",
      dueDate: "",
      createdDate: new Date().toISOString().split('T')[0]
    });
    setOpen(false);
    toast({
      title: "Risk added",
      description: `Successfully added risk: ${riskToAdd.title}`
    });
  };

  const updateRisk = () => {
    if (!selectedRisk) return;
    
    const updatedRisks = risks.map(risk => 
      risk.id === selectedRisk.id ? selectedRisk : risk
    );
    
    setRisks(updatedRisks);
    setEditDialogOpen(false);
    toast({
      title: "Risk updated",
      description: `Successfully updated risk: ${selectedRisk.title}`
    });
  };

  const viewRisk = (risk: Risk) => {
    setSelectedRisk(risk);
    setViewDialogOpen(true);
  };

  const editRisk = (risk: Risk) => {
    setSelectedRisk(risk);
    setEditDialogOpen(true);
  };

  const deleteRisk = (id: number) => {
    setRisks(risks.filter(risk => risk.id !== id));
    toast({
      title: "Risk deleted",
      description: `Successfully deleted risk with id: ${id}`
    });
  };

  const refreshRisks = () => {
    setRisks(initialRisks);
    toast({
      title: "Risks refreshed",
      description: "Successfully refreshed risks from initial state."
    });
  };

  const renderStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge variant="destructive">{status}</Badge>;
      case 'monitoring':
        return <Badge variant="outline">{status}</Badge>;
      case 'mitigated':
        return <Badge variant="secondary">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const renderCriticalityBadge = (criticality: string) => {
    switch (criticality.toLowerCase()) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="outline">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge>{criticality}</Badge>;
    }
  };

  return (
    <MainLayout>
      <PageTitle
        title="Risk Register"
        description="Identify, assess, and manage potential risks to your organization."
        actions={
          <>
            <Button variant="ghost" onClick={refreshRisks}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Risk
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Risk</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Title
                    </Label>
                    <Input id="title" name="title" value={newRisk.title} onChange={handleInputChange} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Textarea id="description" name="description" value={newRisk.description} onChange={handleInputChange} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Category
                    </Label>
                    <Select onValueChange={(value) => handleSelectChange("category", value)}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder={newRisk.category} />
                      </SelectTrigger>
                      <SelectContent>
                        {riskCategories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Status
                    </Label>
                    <Select onValueChange={(value) => handleSelectChange("status", value)}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder={newRisk.status} />
                      </SelectTrigger>
                      <SelectContent>
                        {riskStatuses.map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="impact" className="text-right">
                      Impact
                    </Label>
                    <Select onValueChange={(value) => handleSelectChange("impact", value)}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder={newRisk.impact} />
                      </SelectTrigger>
                      <SelectContent>
                        {riskImpacts.map(impact => (
                          <SelectItem key={impact} value={impact}>{impact}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="probability" className="text-right">
                      Probability
                    </Label>
                    <Select onValueChange={(value) => handleSelectChange("probability", value)}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder={newRisk.probability} />
                      </SelectTrigger>
                      <SelectContent>
                        {riskProbabilities.map(probability => (
                          <SelectItem key={probability} value={probability}>{probability}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="criticality" className="text-right">
                      Criticality
                    </Label>
                    <div className="col-span-3">
                      {renderCriticalityBadge(newRisk.criticality || calculateCriticality(newRisk.impact, newRisk.probability))}
                      <span className="ml-2 text-xs text-muted-foreground">(Auto-calculated)</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="mitigationPlan" className="text-right">
                      Mitigation Plan
                    </Label>
                    <Textarea id="mitigationPlan" name="mitigationPlan" value={newRisk.mitigationPlan} onChange={handleInputChange} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="assignedTo" className="text-right">
                      Assigned To
                    </Label>
                    <Input id="assignedTo" name="assignedTo" value={newRisk.assignedTo || ''} onChange={handleInputChange} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dueDate" className="text-right">
                      Due Date
                    </Label>
                    <Input id="dueDate" name="dueDate" type="date" value={newRisk.dueDate || ''} onChange={handleInputChange} className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" onClick={addRisk}>
                    Add Risk
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        }
      />

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Criticality</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {risks.map(risk => (
              <TableRow key={risk.id}>
                <TableCell>{risk.title}</TableCell>
                <TableCell>{risk.category}</TableCell>
                <TableCell>{renderStatusBadge(risk.status)}</TableCell>
                <TableCell>{renderCriticalityBadge(risk.criticality)}</TableCell>
                <TableCell>{risk.assignedTo || "Unassigned"}</TableCell>
                <TableCell>{risk.dueDate || "Not set"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => viewRisk(risk)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => editRisk(risk)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteRisk(risk.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* View Risk Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Risk Details</DialogTitle>
          </DialogHeader>
          {selectedRisk && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Title:</Label>
                <div className="col-span-3">{selectedRisk.title}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Description:</Label>
                <div className="col-span-3">{selectedRisk.description}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Category:</Label>
                <div className="col-span-3">{selectedRisk.category}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Status:</Label>
                <div className="col-span-3">{renderStatusBadge(selectedRisk.status)}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Impact:</Label>
                <div className="col-span-3">{selectedRisk.impact}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Probability:</Label>
                <div className="col-span-3">{selectedRisk.probability}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Criticality:</Label>
                <div className="col-span-3">{renderCriticalityBadge(selectedRisk.criticality)}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Mitigation Plan:</Label>
                <div className="col-span-3">{selectedRisk.mitigationPlan}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Assigned To:</Label>
                <div className="col-span-3">{selectedRisk.assignedTo || "Unassigned"}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Due Date:</Label>
                <div className="col-span-3">{selectedRisk.dueDate || "Not set"}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Created Date:</Label>
                <div className="col-span-3">{selectedRisk.createdDate}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Risk Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Risk</DialogTitle>
          </DialogHeader>
          {selectedRisk && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-title" className="text-right">
                  Title
                </Label>
                <Input id="edit-title" name="title" value={selectedRisk.title} onChange={handleEditInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Description
                </Label>
                <Textarea id="edit-description" name="description" value={selectedRisk.description} onChange={handleEditInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-category" className="text-right">
                  Category
                </Label>
                <Select 
                  value={selectedRisk.category} 
                  onValueChange={(value) => handleEditSelectChange("category", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder={selectedRisk.category} />
                  </SelectTrigger>
                  <SelectContent>
                    {riskCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">
                  Status
                </Label>
                <Select 
                  value={selectedRisk.status} 
                  onValueChange={(value) => handleEditSelectChange("status", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder={selectedRisk.status} />
                  </SelectTrigger>
                  <SelectContent>
                    {riskStatuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-impact" className="text-right">
                  Impact
                </Label>
                <Select 
                  value={selectedRisk.impact} 
                  onValueChange={(value) => handleEditSelectChange("impact", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder={selectedRisk.impact} />
                  </SelectTrigger>
                  <SelectContent>
                    {riskImpacts.map(impact => (
                      <SelectItem key={impact} value={impact}>{impact}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-probability" className="text-right">
                  Probability
                </Label>
                <Select 
                  value={selectedRisk.probability} 
                  onValueChange={(value) => handleEditSelectChange("probability", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder={selectedRisk.probability} />
                  </SelectTrigger>
                  <SelectContent>
                    {riskProbabilities.map(probability => (
                      <SelectItem key={probability} value={probability}>{probability}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-criticality" className="text-right">
                  Criticality
                </Label>
                <div className="col-span-3">
                  {renderCriticalityBadge(selectedRisk.criticality)}
                  <span className="ml-2 text-xs text-muted-foreground">(Auto-calculated)</span>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-mitigationPlan" className="text-right">
                  Mitigation Plan
                </Label>
                <Textarea 
                  id="edit-mitigationPlan" 
                  name="mitigationPlan" 
                  value={selectedRisk.mitigationPlan} 
                  onChange={handleEditInputChange} 
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-assignedTo" className="text-right">
                  Assigned To
                </Label>
                <Input 
                  id="edit-assignedTo" 
                  name="assignedTo" 
                  value={selectedRisk.assignedTo || ''} 
                  onChange={handleEditInputChange} 
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-dueDate" className="text-right">
                  Due Date
                </Label>
                <Input 
                  id="edit-dueDate" 
                  name="dueDate" 
                  type="date" 
                  value={selectedRisk.dueDate || ''} 
                  onChange={handleEditInputChange} 
                  className="col-span-3" 
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={updateRisk}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default RiskRegister;
