import TelemetryChart from "../../components/telemetryChart/telemetryChart";
import TelemetrySummaryCards from "../../components/telemetrySummaryCards/telemetrySummaryCards";
import useTelemetrySocket from "../../useTelemetrySocket";
import useRadioSocket from "../../sockets/radio/useRadioSocket";
import "./dashboard.css"


function Dashboard() {
  const { data: telemetryData } = useTelemetrySocket(
    "ws://127.0.0.1:8001/ws/telemetry/"
  );
  const {
    lastReceived: radioLastReceived,
  } = useRadioSocket("ws://127.0.0.1:8001/ws/radio/");

  const latest = telemetryData[telemetryData.length - 1];
  const radioFirstPinLabels = (radioLastReceived?.[0]?.pins ?? []).slice(0, 4).map((pin, index) => pin.label || pin.key || `Pin ${index + 1}`);

    const radioPinTimeseries = [
    telemetryData.map(d => ({ timeLabel: d.timeLabel, value: d.altitude })),
    telemetryData.map(d => ({ timeLabel: d.timeLabel, value: d.velocity })),
    telemetryData.map(d => ({ timeLabel: d.timeLabel, value: d.temperature })),
    telemetryData.map(d => ({ timeLabel: d.timeLabel, value: d.battery_voltage })),
  ];



  return (
    <div className="main-container">
      <div className="App">
        <h1>Dashboard</h1>
        <p style={{color:"gray", fontSize:"12px"}}>telemetry points: {telemetryData.length}</p>
        <h2>Current Status</h2>
        <TelemetrySummaryCards latest={latest} />
        <div style={{ marginTop: "2rem" }}>
          <h2>Radio Board 1 (live) - first 4 pins</h2>
          {radioPinTimeseries.map((series, idx) => (
            <TelemetryChart
              key={idx}
              data={series}
              title={`Radio1 ${radioFirstPinLabels[idx] ?? `Pin ${idx + 1}`}`}
              dataKey="value"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;