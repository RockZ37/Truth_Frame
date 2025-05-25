import React from 'react';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { TopicCoverage } from '../../types/analysisTypes';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SourceComparisonChartProps {
  topicCoverage: TopicCoverage;
}

const SourceComparisonChart: React.FC<SourceComparisonChartProps> = ({ 
  topicCoverage 
}) => {
  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Coverage of "${topicCoverage.topic}"`,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const datasetLabel = context.dataset.label || '';
            const value = context.raw;
            if (datasetLabel === 'Coverage') {
              return `${datasetLabel}: ${(value * 100).toFixed(0)}%`;
            }
            return `${datasetLabel}: ${value.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Coverage (%)',
        },
        ticks: {
          callback: function(value: any) {
            return value * 100 + '%';
          }
        }
      },
    },
  };
  
  // Get source colors based on bias
  const getSourceColor = (bias: number, alpha: number = 1): string => {
    if (bias <= -0.6) return `rgba(29, 78, 216, ${alpha})`; // primary-600
    if (bias <= -0.2) return `rgba(96, 165, 250, ${alpha})`; // primary-400
    if (bias <= 0.2) return `rgba(148, 163, 184, ${alpha})`; // neutral-400
    if (bias <= 0.6) return `rgba(251, 146, 60, ${alpha})`; // accent-400
    return `rgba(234, 88, 12, ${alpha})`; // accent-600
  };
  
  const data = {
    labels: topicCoverage.sources.map(s => s.source),
    datasets: [
      {
        label: 'Coverage',
        data: topicCoverage.sources.map(s => s.coverage),
        backgroundColor: topicCoverage.sources.map(s => getSourceColor(s.bias, 0.7)),
        borderColor: topicCoverage.sources.map(s => getSourceColor(s.bias)),
        borderWidth: 1,
      },
    ],
  };
  
  return (
    <div className="w-full h-64">
      <Bar options={options} data={data} />
    </div>
  );
};

export default SourceComparisonChart;