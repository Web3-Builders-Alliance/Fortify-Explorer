"use client";

import React, { FC, useState, useEffect, useRef } from "react";

import ApexCharts from "apexcharts";

interface RadialBarChartProps {
  score: number;
}

const Arc: React.FC<RadialBarChartProps> = ({ score }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const options: ApexCharts.ApexOptions = {
        series: [score],
        chart: {
          type: "radialBar",
          offsetY: -20,
          sparkline: {
            enabled: true,
          },
        },
        plotOptions: {
          radialBar: {
            startAngle: -90,
            endAngle: 90,
            track: {
              background: "#999",
              strokeWidth: "97%",
              margin: 5, // margin is in pixels
              dropShadow: {
                enabled: true,
                top: 2,
                left: 0,
                color: "#e7e7e7",
                opacity: 1,
                blur: 0,
              },
            },
            dataLabels: {
              name: {
                show: false,
              },
              value: {
                offsetY: -2,
                fontSize: "15px",
                color: "white",
              },
            },
          },
        },
        grid: {
          padding: {
            top: -10,
          },
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "light",
            shadeIntensity: 0.4,
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 50, 53, 91],
          },
        },
        labels: ["Average Results"],
      };

      const chart = new ApexCharts(chartRef.current, options);
      chart.render();

      return () => {
        chart.destroy();
      };
    }
  }, [score]);

  return <div ref={chartRef} />;
};

export default Arc;
