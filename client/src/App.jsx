import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navBar/navBar";
import { useState, useEffect } from "react";
import Dashboard from "./pages/dashboard/dashboard";
import RadioConfig from "./pages/radioConfig/radioConfig";
import DataStructConfig from "./pages/dataStructConfig/dataStructConfig";
import DigitalDisplayParams from "./components/digitalDisplayParams/digitalDisplayParams";

function App() {
  const [radios, setRadios] = useState([]);
  const [dashboardDisplays, setDashboardDisplays] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("dashboardDisplays") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("dashboardDisplays", JSON.stringify(dashboardDisplays));
  }, [dashboardDisplays]);

  return (
    <BrowserRouter>
      <div style={{ backgroundColor: "black", minHeight: "100vh", color: "white" }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard displays={dashboardDisplays} setDisplays={setDashboardDisplays} radios={radios} />} />
          <Route path="/radioConfig" element={<RadioConfig />} element={<RadioConfig radios={radios} setRadios={setRadios} />} />
          <Route path="/dataStructConfig" element={<DataStructConfig />} element={<DataStructConfig radios={radios} setRadios={setRadios} />} />
          <Route path="/dashboard/display/:id" element={<DigitalDisplayParams displays={dashboardDisplays} setDisplays={setDashboardDisplays} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;