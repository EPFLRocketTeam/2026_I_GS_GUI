import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import "./telemetryChart.css";

function TelemetryChart({ data, title, dataKey }) {
  const yAxisWidth = 60;

  return (
    <div className="chart-container">
      <div className="chart-inner">
        <h2 className="chart-title">{title}</h2>

        <AreaChart
          width={900}
          height={300}
          data={data}
          margin={{ top: 5, right: yAxisWidth, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#666" />
          <XAxis dataKey="timeLabel" stroke="#fff" />
          <YAxis stroke="#fff" width={yAxisWidth} />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.25}
            connectNulls={false}
            />   
        </AreaChart>
      </div>
    </div>
  );
}

export default TelemetryChart;