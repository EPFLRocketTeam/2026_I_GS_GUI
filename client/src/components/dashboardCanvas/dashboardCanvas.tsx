import React from "react";
import { GRID_WIDTH, GRID_HEIGHT } from "../../constants/gridConstants";
import "./dashboardCanvas.css";
import { DashboardCanvasProps } from "../../types/dashboardCanvasTypes"; 

function DashboardCanvas({ children, gridSettings, gridStyle }: Readonly<DashboardCanvasProps>) {
  return (
    <div className="dashboard-canvas-wrapper">
      <div
        className={`dashboard-canvas ${gridSettings.visible ? "dashboard-grid-viewport" : ""}`}
        style={{
          width: `${GRID_WIDTH}px`,
          height: `${GRID_HEIGHT}px`,
          ...gridStyle,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default DashboardCanvas;