
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface DimensionScore {
  name: string;
  score: number;
}

interface ServiceScore {
  serviceId: number;
  serviceName: string;
  score: number;
}

interface Assessment {
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

interface CompactAssessmentViewProps {
  assessment: Assessment;
}

const CompactAssessmentView = ({ assessment }: CompactAssessmentViewProps) => {
  const [view, setView] = useState<'dimensions' | 'services'>('dimensions');

  // Format dimension data for the radar chart
  const dimensionChartData = assessment.dimensions?.map(dim => ({
    dimension: dim.name,
    score: dim.score
  })) || [];

  return (
    <div className="space-y-6">
      <div className="bg-muted p-4 rounded-md">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Site</h3>
            <p className="text-lg font-medium">{assessment.site}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Overall Score</h3>
            <p className="text-lg font-medium">{parseFloat(assessment.score).toFixed(1)}/5.0</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Assessed</h3>
            <p className="text-lg font-medium">{assessment.assessedOn}</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="dimensions" onValueChange={(val) => setView(val as 'dimensions' | 'services')}>
        <TabsList>
          <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
          <TabsTrigger value="services" disabled={!assessment.services?.length}>IT Services</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dimensions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dimension Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Dimension</TableHead>
                        <TableHead className="text-right">Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assessment.dimensions?.map(dim => (
                        <TableRow key={dim.name}>
                          <TableCell className="font-medium">{dim.name}</TableCell>
                          <TableCell className="text-right">{dim.score.toFixed(1)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={90} data={dimensionChartData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 5]} />
                      <Radar
                        name="Maturity Score"
                        dataKey="score"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Service Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead className="text-right">Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assessment.services?.map(service => (
                      <TableRow key={service.serviceId}>
                        <TableCell className="font-medium">{service.serviceName}</TableCell>
                        <TableCell className="text-right">{service.score.toFixed(1)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {assessment.services && assessment.services.length > 0 && (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart 
                        outerRadius={90} 
                        data={assessment.dimensions?.map(dim => {
                          const dataPoint: any = { dimension: dim.name };
                          assessment.services?.forEach(service => {
                            dataPoint[service.serviceName] = service.score;
                          });
                          return dataPoint;
                        })}
                      >
                        <PolarGrid />
                        <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 5]} />
                        {assessment.services?.map((service, index) => {
                          const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c'];
                          return (
                            <Radar
                              key={service.serviceId}
                              name={service.serviceName}
                              dataKey={service.serviceName}
                              stroke={colors[index % colors.length]}
                              fill={colors[index % colors.length]}
                              fillOpacity={0.6}
                            />
                          );
                        })}
                        <Legend />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompactAssessmentView;
