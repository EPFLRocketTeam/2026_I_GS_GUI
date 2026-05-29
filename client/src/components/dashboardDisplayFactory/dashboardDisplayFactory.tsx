import DigitalDisplayCard from "../digitalDisplayCard/digitalDisplayCard";
import { DashboardDisplayFactoryProps } from "../../types/types";

function DashboardDisplayFactory({ display, value, onContextMenu }: Readonly<DashboardDisplayFactoryProps>) {
  // Other types of displays are not implemented yet; fall back to digital card
  return (
    <DigitalDisplayCard
      display={display}
      value={value}
      onContextMenu={onContextMenu}
    />
  );
}

export default DashboardDisplayFactory;