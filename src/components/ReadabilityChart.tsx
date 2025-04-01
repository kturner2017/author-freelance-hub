
import React from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { ReadabilityScores } from '@/utils/readabilityScores';

interface ReadabilityChartProps {
  scores: ReadabilityScores;
}

const ReadabilityChart = ({ scores }: ReadabilityChartProps) => {
  const data = [
    {
      name: 'Flesch-Kincaid',
      score: scores.fleschKincaid,
      color: '#3b82f6'
    },
    {
      name: 'Flesch Reading Ease',
      score: scores.fleschReading / 10, // Scale down to match other scores
      color: '#10b981'
    },
    {
      name: 'Gunning Fog',
      score: scores.gunningFog,
      color: '#f59e0b'
    },
    {
      name: 'Coleman-Liau',
      score: scores.colemanLiau,
      color: '#8b5cf6'
    }
  ];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis domain={[0, 20]} />
        <Tooltip 
          formatter={(value: number, name: string) => {
            if (name === 'Flesch Reading Ease') {
              return [scores.fleschReading.toFixed(1), name];
            }
            return [value.toFixed(1), name];
          }}
        />
        <Bar dataKey="score" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ReadabilityChart;
