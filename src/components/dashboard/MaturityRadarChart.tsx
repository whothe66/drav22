
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { useTheme } from '@/hooks/use-theme';

interface MaturityRadarChartProps {
  data: {
    parameter: string;
    score: number;
    fullMark: number;
  }[];
  site: string;
}

export function MaturityRadarChart({ data, site }: MaturityRadarChartProps) {
  const { theme } = useTheme();
  
  const textColor = theme === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)';
  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)';
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Maturity Breakdown for {site}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
              <PolarGrid stroke={gridColor} />
              <PolarAngleAxis
                dataKey="parameter"
                tick={{ fill: textColor, fontSize: 12 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 5]}
                stroke={gridColor}
                tick={{ fill: textColor, fontSize: 10 }}
              />
              <Radar
                name={site}
                dataKey="score"
                stroke="hsl(198, 92%, 48%)"
                fill="hsl(198, 92%, 48%, 0.4)"
                fillOpacity={0.6}
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
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
