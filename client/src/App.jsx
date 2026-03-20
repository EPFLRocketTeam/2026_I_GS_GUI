import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navBar/navBar";
import Dashboard from "./pages/dashboard/dashboard";
import RadioBoard from "./pages/radioConfig/radioConfig";

function App() {
  return (
    <BrowserRouter>
      <div style={{ backgroundColor: "black", minHeight: "100vh", color: "white" }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/radioBoard" element={<RadioBoard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;