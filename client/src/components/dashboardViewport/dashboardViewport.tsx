import React from "react";
import { DashboardViewportProps } from "../../types/types";

const DashboardViewport = React.forwardRef<HTMLDivElement, DashboardViewportProps>(
  (
    {
      children,
      zoom = 1,
      pan = { x: 0, y: 0 },  // set default in separate variable
      panning = false,
      style,
      onContextMenu,
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onMouseLeave,
      onWheel,
    },
    ref,
  ) => {
    return (
      <div className="dashboard-viewport-wrapper">
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}  
      <div  // this part should be interactive, no easy way to remove SONARQUBE warning
        ref={ref}
        className={`dashboard-viewport dashboard-zoom-viewport ${
          panning ? "is-panning" : ""
        }`}
        style={style}
        onContextMenu={onContextMenu}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onWheel={onWheel}
      >
        <div
          className="dashboard-zoom-layer"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          }}
        >
          {children}
        </div>
      </div>
      </div>
    );
  },
  
);

DashboardViewport.displayName = "DashboardViewport";

export default DashboardViewport;