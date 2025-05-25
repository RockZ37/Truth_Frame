import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { SentimentMetrics } from '../../types/analysisTypes';

ChartJS.register(ArcElement, Tooltip, Legend);

interface SentimentChartProps {
  sentiment: SentimentMetrics;
  size?: 'sm' | 'md' | 'lg';
}

const SentimentChart: React.FC<SentimentChartProps> = ({ sentiment, size = 'md' }) => {
  const data = {
    labels: ['Positive', 'Negative', 'Neutral'],
    datasets: [
      {
        data: [sentiment.positive, sentiment.negative, sentiment.neutral],
        backgroundColor: [
          'rgba(34, 197, 94, 0.7)',  // success-500
          'rgba(239, 68, 68, 0.7)',  // error-500
          'rgba(148, 163, 184, 0.7)'   // neutral-400
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(148, 163, 184, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const options = {
    cutout: '70%',
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            size: size === 'sm' ? 10 : size === 'md' ? 12 : 14,
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw;
            return `${label}: ${(value * 100).toFixed(1)}%`;
          }
        }
      }
    },
  };
  
  // Calculate overall sentiment text and color
  const getSentimentInfo = (score: number) => {
    if (score >= 0.4) return { text: 'Very Positive', color: 'text-success-500' };
    if (score >= 0.1) return { text: 'Somewhat Positive', color: 'text-success-400' };
    if (score > -0.1) return { text: 'Neutral', color: 'text-neutral-500' };
    if (score > -0.4) return { text: 'Somewhat Negative', color: 'text-error-400' };
    return { text: 'Very Negative', color: 'text-error-500' };
  };
  
  const sentimentInfo = getSentimentInfo(sentiment.overall);
  
  const containerClass = {
    sm: 'max-w-[200px]',
    md: 'max-w-[250px]',
    lg: 'max-w-[300px]'
  }[size];
  
  return (
    <div className={`${containerClass} mx-auto`}>
      <h4 className="text-center mb-2 font-medium">Sentiment Analysis</h4>
      <div className="relative">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`font-medium ${sentimentInfo.color}`}>
              {sentimentInfo.text}
            </div>
            <div className="text-sm">
              {(sentiment.overall * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentChart;