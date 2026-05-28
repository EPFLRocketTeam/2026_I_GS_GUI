import { useNavigate } from "react-router-dom";
import "./dashboardContextMenu.css";
import { DashboardContextMenuProps } from "../../types/dashboardCanvasTypes";
import {CONTEXT_MENU_TYPES, CONTEXT_MENU_OPTIONS} from "../../constants/contextMenuConstants"

function DashboardContextMenu({
  ctxMenu,
  closeMenu,
  onAddDisplay,
  onDeleteRequest,
}: Readonly<DashboardContextMenuProps>) {
  const navigate = useNavigate();

  if (!ctxMenu) return null;

  return (
    <ul>
      <button
      type="button"
      className="dashboard-ctx-menu"
      style={{ top: ctxMenu.y, left: ctxMenu.x }}
      onClick={(e) => e.stopPropagation()}
    >
      {ctxMenu.type ===  CONTEXT_MENU_TYPES.page && (
        <li>
          <button
            type="button"
            onClick={() => {
            onAddDisplay(ctxMenu.canvasX, ctxMenu.canvasY);
            closeMenu();
          }}
          >
          {CONTEXT_MENU_OPTIONS.addDigitalDisplay}
          </button>
        </li>
      )}

      {ctxMenu.type === CONTEXT_MENU_TYPES.card && (
        <>
          <li>
            <button
            type="button"
            onClick={() => {
              navigate(`/dashboard/display/${ctxMenu.displayId}`);
              closeMenu();
            }}
          >
            {CONTEXT_MENU_OPTIONS.parameters}
            </button>
          </li>

          <li>
            <button
            type="button"
            onClick={() => {
              onDeleteRequest(ctxMenu.displayId);
              closeMenu();
            }}
          >
            {CONTEXT_MENU_OPTIONS.removeDisplay}
            </button>
          </li>
        </>
      )}
      </button>
    </ul>
  );
}

export default DashboardContextMenu;