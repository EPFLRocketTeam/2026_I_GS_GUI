import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navBar/navBar";
import { useState } from "react";
import Dashboard from "./pages/dashboard/dashboard";
import RadioConfig from "./pages/radioConfig/radioConfig";
import DataStructConfig from "./pages/dataStructConfig/dataStructConfig";

function App() {
  const [radios, setRadios] = useState([]);
  return (
    <BrowserRouter>
      <div style={{ backgroundColor: "black", minHeight: "100vh", color: "white" }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/radioConfig" element={<RadioConfig />} element={<RadioConfig radios={radios} setRadios={setRadios} />} />
          <Route path="/dataStructConfig" element={<DataStructConfig />} element={<DataStructConfig radios={radios} setRadios={setRadios} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;