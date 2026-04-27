export const CARD_W = 220;
export const CARD_H = 140;
export const CARD_GAP = 18;

export const cardsOverlap = (a, b) => {
  return !(
    a.x + CARD_W + CARD_GAP <= b.x ||
    b.x + CARD_W + CARD_GAP <= a.x ||
    a.y + CARD_H + CARD_GAP <= b.y ||
    b.y + CARD_H + CARD_GAP <= a.y
  );
};

export const hasCardOverlap = (moving, displays) => {
  return displays.some((display) => {
    if (display.id === moving.id) return false;

    return cardsOverlap(
      { x: moving.x ?? 0, y: moving.y ?? 0 },
      { x: display.x ?? 0, y: display.y ?? 0 }
    );
  });
};

export const createDragState = ({ e, display, zoom, pan }) => {
  if (e.button !== 0) return null;

  const viewport = e.currentTarget.closest(".dashboard-zoom-viewport");
  if (!viewport) return null;

  const rect = viewport.getBoundingClientRect();

  const mouseWorldX = (e.clientX - rect.left - pan.x) / zoom;
  const mouseWorldY = (e.clientY - rect.top - pan.y) / zoom;

  return {
    id: display.id,
    startX: display.x ?? 0,
    startY: display.y ?? 0,
    offsetX: mouseWorldX - (display.x ?? 0),
    offsetY: mouseWorldY - (display.y ?? 0),
  };
};

export const getDraggedCardPosition = ({ e, dragging, zoom, pan }) => {
  const viewport = e.currentTarget.closest(".dashboard-zoom-viewport");
  const rect = viewport.getBoundingClientRect();
  const mouseWorldX = (e.clientX - rect.left - pan.x) / zoom;
  const mouseWorldY = (e.clientY - rect.top - pan.y) / zoom;

  return {
    x: mouseWorldX - dragging.offsetX,
    y: mouseWorldY - dragging.offsetY,
  };
};

export const moveDraggedDisplay = ({ displays, dragging, x, y }) => {
  return displays.map((display) =>
    display.id === dragging.id ? { ...display, x, y } : display
  );
};

export const resolveDroppedDisplay = ({ displays, dragging }) => {
  const moving = displays.find((display) => display.id === dragging.id);
  if (!moving) return displays;

  const overlaps = hasCardOverlap(moving, displays);

  if (!overlaps) return displays;

  return displays.map((display) =>
    display.id === moving.id
      ? { ...display, x: dragging.startX, y: dragging.startY }
      : display
  );
};