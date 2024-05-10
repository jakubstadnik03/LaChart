import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { io } from "socket.io-client";

const LivePerformanceChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const socket = io("your_backend_socket_endpoint");
    socket.on("liveData", (newData) => {
      setData((currentData) => [...currentData.slice(-50), newData]); // keep only the latest 50 data points
    });

    return () => socket.disconnect();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="value"
          stroke="#8884d8"
          isAnimationActive={false}
        />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LivePerformanceChart;
