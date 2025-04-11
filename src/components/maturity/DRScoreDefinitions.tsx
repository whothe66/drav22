
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// DR maturity score definitions with disaster recovery focused descriptions
export const drScoreDescriptions = {
  1: {
    label: "Critical Vulnerability",
    description: "No DR capability exists. Complete failure of service is inevitable in a disaster event with significant business impact.",
    color: "bg-destructive/10 text-destructive border-destructive"
  },
  2: {
    label: "Basic Capability",
    description: "Basic DR documentation exists but implementation is incomplete. Extended recovery time expected with potential business impact.",
    color: "bg-destructive/5 text-destructive/80 border-destructive/80"
  },
  3: {
    label: "Standard Compliance",
    description: "DR controls meet minimum requirements with documented recovery procedures. Recovery within acceptable timeframes is possible.",
    color: "bg-warning/10 text-warning border-warning"
  },
  4: {
    label: "Advanced Capability",
    description: "Comprehensive DR strategy with regular testing. Recovery time objectives likely to be met with minimal business impact.",
    color: "bg-success/10 text-success border-success"
  },
  5: {
    label: "Best Practice",
    description: "Fully automated DR with redundant systems, continuous testing, and improvement processes. Recovery with negligible business impact.",
    color: "bg-success/20 text-success/80 border-success/80"
  }
};

const DRScoreDefinitions = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">DR Maturity Score Definitions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Score</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(drScoreDescriptions).map(([score, { label, description, color }]) => (
              <TableRow key={score}>
                <TableCell>
                  <Badge variant="outline" className={color}>
                    {score}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{label}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default DRScoreDefinitions;
