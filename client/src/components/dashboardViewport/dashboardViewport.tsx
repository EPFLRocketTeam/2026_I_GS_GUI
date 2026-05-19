import React from "react";

type Props = {
  children: React.ReactNode;
  gridSettings: any;
  zoom?: number;
  pan?: { x: number; y: number };
  panning?: boolean | null;
  style?: React.CSSProperties;
  onContextMenu?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseUp?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onWheel?: (e: React.WheelEvent<HTMLDivElement>) => void;
};

const DashboardViewport = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      children,
      gridSettings,
      zoom = 1,
      pan = { x: 0, y: 0 },
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
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div className="dashboard-viewport-wrapper">
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
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