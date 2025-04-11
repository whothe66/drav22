
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { Building, ClipboardList } from 'lucide-react';
import { Site } from '@/data/officeSites';

interface AssessmentSetupProps {
  sites: Site[];
  onStartAssessment: (siteId: number, auditorName: string) => void;
}

interface FormData {
  siteId: string;
  auditorName: string;
}

const AssessmentSetup: React.FC<AssessmentSetupProps> = ({ sites, onStartAssessment }) => {
  const form = useForm<FormData>({
    defaultValues: {
      siteId: '',
      auditorName: ''
    }
  });

  const handleSubmit = (data: FormData) => {
    onStartAssessment(parseInt(data.siteId), data.auditorName);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-6 w-6" />
          New Maturity Assessment
        </CardTitle>
        <CardDescription>
          Select an office site and enter auditor information to begin the assessment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="siteId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Office Site</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select office site" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sites.map(site => (
                        <SelectItem key={site.id} value={site.id.toString()}>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span>{site.name} ({site.city}, {site.country})</span>
                            {site.tier && (
                              <span className="text-xs text-muted-foreground ml-1">{site.tier}</span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="auditorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Auditor Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name of the assessment auditor" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full">Start Assessment</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AssessmentSetup;
