import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import type { ReadabilityScores } from '@/utils/readabilityScores';

interface ReadabilityChartProps {
  scores: ReadabilityScores;
}

const ReadabilityChart = ({ scores }: ReadabilityChartProps) => {
  const data = [
    {
      name: 'Flesch-Kincaid',
      score: scores.fleschKincaid,
      description: 'Grade level (lower is easier)',
      fill: '#4d82c6'
    },
    {
      name: 'Flesch Reading',
      score: scores.fleschReading / 10, // Normalize to 0-10 scale
      description: 'Ease of reading (higher is easier)',
      fill: '#80a6d6'
    },
    {
      name: 'Gunning Fog',
      score: scores.gunningFog,
      description: 'Years of education needed',
      fill: '#b3c9e6'
    },
    {
      name: 'Coleman-Liau',
      score: scores.colemanLiau,
      description: 'US grade level',
      fill: '#e6edf5'
    }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <Card className="p-2 bg-white shadow-lg border">
          <CardContent className="p-2">
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-muted-foreground">{item.description}</p>
            <p className="text-sm font-medium">
              Score: {item.name === 'Flesch Reading' ? item.score * 10 : item.score}
            </p>
          </CardContent>
        </Card>
      );
    }
    return null;
  };

  return (
    <Card className="w-full mb-4">
      <CardHeader>
        <CardTitle>Readability Analysis</CardTitle>
        <CardDescription>
          Multiple metrics to evaluate your text's readability
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                domain={[0, 20]}
                tickCount={5}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="score" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReadabilityChart;