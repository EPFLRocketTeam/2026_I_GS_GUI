import { NavLink } from "react-router-dom";
import "./navBar.css";
import { DASHBOARD_LABEL, DATA_STRUCT_CONFIG, RADIO_CONFIG_LABEL, ROCKET_GUI } from "../../constants/navBarConstants";

function NavBar() {
  return (
    <nav className="navbar">
      <span className="navbar-brand">{ROCKET_GUI}</span>
      <div className="navbar-links">
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          {DASHBOARD_LABEL}
        </NavLink>
        <NavLink
          to="/radioConfig"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          {RADIO_CONFIG_LABEL}
        </NavLink>
        <NavLink
          to="/dataStructConfig"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          {DATA_STRUCT_CONFIG}
        </NavLink>
      </div>
    </nav>
  );
}
export default NavBar;
