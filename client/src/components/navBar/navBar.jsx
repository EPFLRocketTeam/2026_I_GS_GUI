import { NavLink } from "react-router-dom";
import "./navBar.css";

function NavBar() {
  return (
    <nav className="navbar">
      <span className="navbar-brand">🚀 Rocket GUI</span>
      <div className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>
          Dashboard
        </NavLink>
        <NavLink to="/radioConfig" className={({ isActive }) => isActive ? "active" : ""}>
          RadioConfig
        </NavLink>
        <NavLink to="/dataStructConfig" className={({ isActive }) => isActive ? "active" : ""}>
          DataStructConfig
        </NavLink>
      </div>
    </nav>
  );
}
export default NavBar;