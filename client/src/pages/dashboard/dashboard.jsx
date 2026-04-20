import TelemetryChart from "../../components/telemetryChart/telemetryChart";
import TelemetrySummaryCards from "../../components/telemetrySummaryCards/telemetrySummaryCards";
import useTelemetrySocket from "../../useTelemetrySocket";
import useRadioSocket from "../../sockets/radio/useRadioSocket";
import "./dashboard.css"


function Dashboard() {

  return (
    <div className="main-container">
      <div className="App">
        <h1>Dashboard</h1>
      </div>
    </div>
  );
}

export default Dashboard;