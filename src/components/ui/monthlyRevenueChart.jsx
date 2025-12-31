import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from "recharts";

const BenchmarkPriceChart = ({ priceData }) => {
  const monthColors = {
    Jan: { lower: "#9b5cff", upper: "#2d2d2d" },
    Feb: { lower: "#ff6b9d", upper: "#3d3d3d" },
    Mar: { lower: "#4ecdc4", upper: "#2d2d2d" },
    Apr: { lower: "#9b5cff", upper: "#2d2d2d" },
    May: { lower: "#ff6b9d", upper: "#3d3d3d" },
    Jun: { lower: "#9b5cff", upper: "#2d2d2d" },
    Jul: { lower: "#ffd93d", upper: "#4d4d4d" },
    Aug: { lower: "#9b5cff", upper: "#2d2d2d" },
    Sep: { lower: "#9b5cff", upper: "#2d2d2d" },
    Oct: { lower: "#ff6b9d", upper: "#3d3d3d" },
    Nov: { lower: "#9b5cff", upper: "#2d2d2d" },
    Dec: { lower: "#9b5cff", upper: "#2d2d2d" },
  };

  const chartData = priceData.map(item => ({
    month: item.month || "",
    lowerPrice: Number(item.totalPrice || 0) * 0.7,
    upperPrice: Number(item.totalPrice || 0) * 0.3,
  }));

  const maxValue = chartData.length ? Math.max(...chartData.map(i => i.lowerPrice + i.upperPrice)) : 1;
  const scaleFactor = maxValue ? 100000 / maxValue : 1;

  const scaledData = chartData.map(item => ({
    ...item,
    lowerPrice: item.lowerPrice * scaleFactor,
    upperPrice: item.upperPrice * scaleFactor,
  }));

  const avgPrice = scaledData.length
    ? scaledData.reduce((sum, item) => sum + item.lowerPrice + item.upperPrice, 0) / scaledData.length
    : 0;

  const formatYAxis = (value) => `${(value / 1000).toFixed(0)}k`;

  return (
    <div className="h-[300px] bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl border border-gray-100">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={scaledData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }} barSize={45}>
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
          <YAxis axisLine={false} tickLine={false} tickFormatter={formatYAxis} tick={{ fontSize: 12, fill: "#6b7280" }} />
          <Tooltip cursor={{ fill: "transparent" }} wrapperStyle={{ outline: "none" }} contentStyle={{
            background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
            border: "none",
            borderRadius: "12px",
            padding: "12px 16px"
          }} labelStyle={{ color: "#1f2937", fontSize: 13, fontWeight: 600, marginBottom: 4 }}
            itemStyle={{ color: "#6b7280", fontSize: 12, padding: "2px 0" }} 
          />
          <ReferenceLine y={avgPrice} stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} label={{
            value: "Avg",
            position: "right",
            fill: "#64748b",
            fontSize: 12,
            fontWeight: 600
          }} />
          <Bar dataKey="lowerPrice" stackId="a" radius={[0,0,0,0]}>
            {scaledData.map((e, i) => <Cell key={i} fill={monthColors[e.month]?.lower || "#9b5cff"} />)}
          </Bar>
          <Bar dataKey="upperPrice" stackId="a" radius={[6,6,0,0]}>
            {scaledData.map((e, i) => <Cell key={i} fill={monthColors[e.month]?.upper || "#2d2d2d"} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BenchmarkPriceChart;
