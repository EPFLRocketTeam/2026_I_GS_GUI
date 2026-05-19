import { useNavigate } from "react-router-dom";
import "./dashboardContextMenu.css";

type Props = {
  ctxMenu: any;
  closeMenu: () => void;
  onAddDisplay: (x: number, y: number) => void;
  onDeleteRequest: (id: string) => void;
};

function DashboardContextMenu({
  ctxMenu,
  closeMenu,
  onAddDisplay,
  onDeleteRequest,
}: Props) {
  const navigate = useNavigate();

  if (!ctxMenu) return null;

  return (
    <ul
      className="dashboard-ctx-menu"
      style={{ top: ctxMenu.y, left: ctxMenu.x }}
      onClick={(e) => e.stopPropagation()}
    >
      {ctxMenu.type === "page" && (
        <li
          onClick={() => {
            onAddDisplay(ctxMenu.canvasX, ctxMenu.canvasY);
            closeMenu();
          }}
        >
          ＋ Add digital display
        </li>
      )}

      {ctxMenu.type === "card" && (
        <>
          <li
            onClick={() => {
              navigate(`/dashboard/display/${ctxMenu.displayId}`);
              closeMenu();
            }}
          >
            ⚙ Parameters
          </li>

          <li
            onClick={() => {
              onDeleteRequest(ctxMenu.displayId);
              closeMenu();
            }}
          >
            🗑 Remove display
          </li>
        </>
      )}
    </ul>
  );
}

export default DashboardContextMenu;