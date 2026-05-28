import DigitalDisplayCard from "../digitalDisplayCard/digitalDisplayCard";
import { DigitalDisplay } from "../../interfaces/dashboardInterfaces";
import { DashboardDisplayFactoryProps } from "../../types/types";

type Props = {
    display: DigitalDisplay;
    value: string | number;
    onContextMenu: (e: React.MouseEvent, display: DigitalDisplay) => void;
}

function DashboardDisplayFactory({ display, value, onContextMenu }: Readonly<DashboardDisplayFactoryProps>) {
  // ValveDisplay is not implemented yet; fall back to digital card
  return (
    <DigitalDisplayCard
      display={display}
      value={value}
      onContextMenu={onContextMenu}
    />
  );
}

export default DashboardDisplayFactory;