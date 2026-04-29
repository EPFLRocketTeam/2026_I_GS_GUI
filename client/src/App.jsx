import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navBar/navBar";
import { useState } from "react";
import Dashboard from "./pages/dashboard/dashboard";
import RadioConfig from "./pages/radioConfig/radioConfig";
import DataStructConfig from "./pages/dataStructConfig/dataStructConfig";
import DigitalDisplayParams from "./components/digitalDisplayParams/digitalDisplayParams";

function App() {
  const [radios, setRadios] = useState([]);
  const [dashboardDisplays, setDashboardDisplays] = useState([]); 

  return (
    <BrowserRouter>
      <div style={{ backgroundColor: "black", minHeight: "100vh", color: "white" }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard displays={dashboardDisplays} setDisplays={setDashboardDisplays} radios={radios} />} />
          <Route path="/radioConfig" element={<RadioConfig radios={radios} setRadios={setRadios}/>} />
          <Route path="/dataStructConfig" element={<DataStructConfig
            radios={radios}
            setRadios={setRadios}
            displays={dashboardDisplays}
            setDisplays={setDashboardDisplays}
          />} />
          <Route path="/dashboard/display/:id" element={<DigitalDisplayParams
            displays={dashboardDisplays}
            setDisplays={setDashboardDisplays}
            radios={radios}
          /> } />        
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;