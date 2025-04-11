
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '@/hooks/use-theme';

interface MaturityData {
  month: string;
  [key: string]: string | number;
}

interface MaturityLineChartProps {
  data: MaturityData[];
  sites: string[];
}

export function MaturityLineChart({ data, sites }: MaturityLineChartProps) {
  // Create a theme hook
  const { theme } = useTheme();
  
  // Dynamic colors based on site index
  const getLineColor = (index: number) => {
    const colors = [
      'hsl(198, 92%, 48%)',
      'hsl(329, 84%, 60%)',
      'hsl(142, 76%, 36%)',
      'hsl(31, 92%, 45%)',
      'hsl(261, 84%, 60%)',
      'hsl(60, 84%, 60%)',
    ];
    return colors[index % colors.length];
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">DR Maturity Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 10,
                bottom: 15,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                stroke={theme === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                domain={[0, 5]}
                stroke={theme === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: theme === 'dark' ? 'rgba(26,31,44,0.9)' : 'rgba(255,255,255,0.9)',
                  borderRadius: '8px',
                  border: '1px solid rgba(0,0,0,0.1)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  padding: '8px',
                  color: theme === 'dark' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)'
                }} 
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              {sites.map((site, index) => (
                <Line
                  key={site}
                  type="monotone"
                  dataKey={site}
                  name={site}
                  stroke={getLineColor(index)}
                  activeDot={{ r: 6 }}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
