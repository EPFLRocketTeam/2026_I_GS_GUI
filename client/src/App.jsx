import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navBar/navBar";
import Dashboard from "./pages/dashboard/dashboard";
import RadioConfig from "./pages/radioConfig/radioConfig";
import DataStructConfig from "./pages/dataStructConfig/dataStructConfig";

function App() {
  return (
    <BrowserRouter>
      <div style={{ backgroundColor: "black", minHeight: "100vh", color: "white" }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/radioConfig" element={<RadioConfig />} />
          <Route path="/dataStructConfig" element={<DataStructConfig />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;