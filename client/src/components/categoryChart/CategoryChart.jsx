import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './CategoryChart.css';

const CategoryChart = ({ data = [] }) => {
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
    
    // Prepare data for the chart
    const labels = data.map(item => item._id);
    const values = data.map(item => item.total);
    
    // Generate colors
    const backgroundColors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
      '#8AC249', '#EA5545', '#F46A9B', '#EF9B20', '#EDBF33', '#87BC45'
    ];

    // Create the chart
    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: backgroundColors.slice(0, data.length),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 12,
              padding: 15
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: $${value} (${percentage}%)`;
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
    return <p className="text-center text-muted">No category data available.</p>;
  }

  return (
    <div className="category-chart">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default CategoryChart;
