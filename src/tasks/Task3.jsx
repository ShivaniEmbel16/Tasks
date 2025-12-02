import React, { useState, useMemo } from "react";
import {
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, CartesianGrid
} from "recharts";

const rawData = [
  { date: "2025-01-10", value: 30 },
  { date: "2025-01-12", value: 50 },
  { date: "2025-01-15", value: 80 },
  { date: "2025-02-01", value: 60 },
  { date: "2025-02-10", value: 100 },
];

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#3B82F6"];

const Task3 = () => {
  const [chartType, setChartType] = useState("bar");
  const [startDate, setStartDate] = useState("2025-01-01");
  const [endDate, setEndDate] = useState("2025-12-31");

 
    /* ---------------------------------------------
      Filter data by date range
     --------------------------------------------- */
  const filteredData = useMemo(() => {
    return rawData.filter((item) => {
      return item.date >= startDate && item.date <= endDate;
    });
  }, [startDate, endDate]);


//   ✔ Why use useMemo?

// Because without it, every render would re-calculate filtering.

// ✔ What it does?

// Shows data only between selected start and end dates.

// Example:
// If start = 2025-01-11 and end = 2025-02-05
// Only entries matching this date range will appear.

  return (
    <>
    <div className="w-full p-6  bg-gradient-to-br from-blue-50 to-indigo-100">
      <h2 className="text-xl font-semibold mb-4">Chart Widget Customization</h2>
      <div className="flex flex-wrap gap-4 mb-6 items-end">
        
        {/* Start Date */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border px-3 py-2 rounded-md"
          />
        </div>

        {/* End Date */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border px-3 py-2 rounded-md"
          />
        </div>

        {/* Chart Type Dropdown */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Chart Type</label>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="border px-3 py-2 rounded-md bg-white cursor-pointer"
          >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="pie">Pie Chart</option>
          </select>
        </div>
      </div>

      {/* Chart Section */}
      <div className="p-6 bg-white shadow rounded-lg flex justify-center">
        {chartType === "bar" && (
          <BarChart width={500} height={300} data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip wrapperStyle={{ background: "#fff" }} />
            <Legend />
            <Bar dataKey="value" fill="#4F46E5" radius={[6, 6, 0, 0]} />
          </BarChart>
        )}

        {chartType === "line" && (
          <LineChart width={500} height={300} data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip wrapperStyle={{ background: "#fff" }} />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#10B981"
              strokeWidth={3}
            />
          </LineChart>
        )}

        {chartType === "pie" && (
          <PieChart width={450} height={350}>
            <Pie
              data={filteredData}
              dataKey="value"
              nameKey="date"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
            >
              {filteredData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip wrapperStyle={{ background: "#fff" }} />
            <Legend />
          </PieChart>
        )}
      </div>
    </div>
    
    </>
  );
};

export default Task3;
