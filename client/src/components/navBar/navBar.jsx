import { NavLink } from "react-router-dom";
import "./navBar.css";

function NavBar() {
  return (
    <nav className="navbar">
      <span className="navbar-brand">🚀 Rocket Telemetry</span>
      <div className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>
          Dashboard
        </NavLink>
        <NavLink to="/radioBoard" className={({ isActive }) => isActive ? "active" : ""}>
          RadioBoard
        </NavLink>
      </div>
    </nav>
  );
}
export default NavBar;