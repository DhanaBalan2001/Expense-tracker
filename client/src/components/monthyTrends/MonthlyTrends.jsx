import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './MonthlyTrends.css';

const MonthlyTrends = ({ data = [] }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (data.length === 0) {
      return;
    }

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    
    // Sort data by date
    const sortedData = [...data].sort((a, b) => {
      const dateA = new Date(a._id.year, a._id.month - 1);
      const dateB = new Date(b._id.year, b._id.month - 1);
      return dateA - dateB;
    });
    
    // Prepare data for the chart
    const labels = sortedData.map(item => {
      const date = new Date(item._id.year, item._id.month - 1);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    });
    
    const values = sortedData.map(item => item.total);
    
    // Create the chart
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Monthly Expenses',
          data: values,
          fill: false,
          borderColor: '#007bff',
          tension: 0.1,
          pointBackgroundColor: '#007bff',
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '$' + value;
              }
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                return `Total: $${context.raw}`;
              }
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  if (data.length === 0) {
    return <p className="text-center text-muted">No monthly data available.</p>;
  }

  return (
    <div className="monthly-trends">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default MonthlyTrends;
