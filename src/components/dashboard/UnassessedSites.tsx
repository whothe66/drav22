
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { unassessedSites } from '@/data/dashboardData';

const UnassessedSites = () => {
  const [sites, setSites] = useState(unassessedSites);
  const [sortField, setSortField] = useState<keyof typeof sites[0] | 'location'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Handle sorting
  const handleSort = (field: keyof typeof sites[0] | 'location') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort sites based on current sort settings
  const sortedSites = [...sites].sort((a, b) => {
    let aValue, bValue;
    
    if (sortField === 'location') {
      aValue = `${a.city}, ${a.country}`;
      bValue = `${b.city}, ${b.country}`;
    } else if (sortField === 'lastAssessment') {
      // Special handling for date comparisons
      const dateA = a.lastAssessment === 'Never' ? new Date(0) : new Date(a.lastAssessment);
      const dateB = b.lastAssessment === 'Never' ? new Date(0) : new Date(b.lastAssessment);
      return sortDirection === 'asc' 
        ? dateA.getTime() - dateB.getTime() 
        : dateB.getTime() - dateA.getTime();
    } else {
      aValue = a[sortField];
      bValue = b[sortField];
    }
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    // For numeric values
    return sortDirection === 'asc' 
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });

  const renderSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-1 h-4 w-4 inline" />;
    }
    return sortDirection === 'asc' 
      ? <ChevronUp className="ml-1 h-4 w-4 inline" /> 
      : <ChevronDown className="ml-1 h-4 w-4 inline" />;
  };

  return (
    <Card className="col-span-12 xl:col-span-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Unassessed Sites</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link to="/maturity-assessment">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Assessment
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  Site {renderSortIcon('name')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('location')}
                >
                  Location {renderSortIcon('location')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('tier')}
                >
                  Tier {renderSortIcon('tier')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('lastAssessment')}
                >
                  Last Assessment {renderSortIcon('lastAssessment')}
                </TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedSites.slice(0, 5).map((site) => (
                <TableRow key={site.id}>
                  <TableCell className="font-medium">{site.name}</TableCell>
                  <TableCell>{`${site.city}, ${site.country}`}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {site.tier}
                    </Badge>
                  </TableCell>
                  <TableCell>{site.lastAssessment}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="secondary" size="sm" asChild>
                      <Link to={`/maturity-assessment?site=${site.id}`}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Assess
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnassessedSites;
