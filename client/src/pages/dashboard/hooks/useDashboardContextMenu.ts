import { useState } from "react";

export function useDashboardContextMenu() {
  const [ctxMenu, setCtxMenu] = useState<any>(null);

  const closeMenu = () => setCtxMenu(null);

  return {
    ctxMenu,
    setCtxMenu,
    closeMenu,
  };
}
