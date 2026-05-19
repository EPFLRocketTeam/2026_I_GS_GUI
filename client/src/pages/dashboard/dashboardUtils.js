import { CARD_GAP, CARD_W, CARD_H, GRID_HEIGHT, GRID_WIDTH } from "../../constants/gridConstants";

export const getCardWidth = (gridPx) =>
  CARD_W * gridPx;

export const getCardHeight = (gridPx) =>
  CARD_H * gridPx;

export const clampDisplayPosition = ({x, y, maxX, maxY}) => ({
  x: Math.max(0, Math.min(x, maxX)),
  y: Math.max(0, Math.min(y, maxY)),
}); 

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
    const movingId = moving.digitalDisplayId ?? moving.id;
    const displayId = display.digitalDisplayId ?? display.id;
    if (displayId === movingId) return false;

    const movingX = moving.posx ?? moving.x ?? 0;
    const movingY = moving.posy ?? moving.y ?? 0;
    const displayX = display.posx ?? display.x ?? 0;
    const displayY = display.posy ?? display.y ?? 0;

    return cardsOverlap({ x: movingX, y: movingY }, { x: displayX, y: displayY });
  });
};

export const createDragState = ({ e, display, zoom, pan }) => {
  if (e.button !== 0) return null;

  const viewport = e.currentTarget.closest(".dashboard-zoom-viewport");
  if (!viewport) return null;

  const rect = viewport.getBoundingClientRect();
  const mouseWorldX = (e.clientX - rect.left - pan.x) / zoom;
  const mouseWorldY = (e.clientY - rect.top - pan.y) / zoom;

  // support both legacy (`id`, `x`, `y`) and Dashboard component shape
  const id = display.digitalDisplayId ?? display.id;
  const digitalDisplayId = display.digitalDisplayId ?? null;
  const startX = display.posx ?? display.x ?? 0;
  const startY = display.posy ?? display.y ?? 0;

  return {
    id,
    digitalDisplayId,
    startX,
    startY,
    offsetX: mouseWorldX - startX,
    offsetY: mouseWorldY - startY,
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

export const moveDraggedDisplay = ({ displays, dragging, x, y, gridPixelSize }) => {
  const cardWidth = CARD_W * gridPixelSize;
  const cardHeight = CARD_H * gridPixelSize;
  const clamped = clampDisplayPosition({
    x,
    y,
    maxX: GRID_WIDTH - 100,
    maxY: GRID_HEIGHT - 100,
  });
  return displays.map((display) => {
    const id = display.digitalDisplayId ?? display.id;
    if (id === dragging.id) {
      // preserve existing field names
      if (display.digitalDisplayId) {
        return { ...display, posx: clamped.x, posy: clamped.y };
      }
      return { ...display, x: clamped.x, y: clamped.y };
    }
    return display;
  });
};

export const resolveDroppedDisplay = ({ displays }) => displays;

export const clampZoom = (value) => Math.min(2, Math.max(1, value));

export const getViewportMousePos = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
};

export const getNextZoomPan = ({ mouseX, mouseY, zoom, pan, delta }) => {
  const nextZoom = clampZoom(Number((zoom + delta).toFixed(2)));
  const worldX = (mouseX - pan.x) / zoom;
  const worldY = (mouseY - pan.y) / zoom;
  return {
    zoom: nextZoom,
    pan: {
      x: mouseX - worldX * nextZoom,
      y: mouseY - worldY * nextZoom,
    },
  };
};

export const createDisplayFromField = (fieldInfo, count = 0) => ({
  digitalDisplayId: crypto.randomUUID(),
  title: fieldInfo.name || `Display ${count + 1}`,
  varName: fieldInfo.name || "",
  varValue: "--",
  radioId: fieldInfo.radioId ?? null,
  type: fieldInfo.type || "",
  suffix: "",
  posx: fieldInfo.x ?? GRID_WIDTH / 2 - CARD_W / 2 + (count % 3) * CARD_W,
  posy: fieldInfo.y ?? GRID_HEIGHT / 2 - CARD_H / 2 + Math.floor(count / 3) * CARD_H,
});

export const buildFieldValueMap = (radios) => {
  const map = new Map();
  radios.forEach((radio) => {
    (radio.structFields ?? []).forEach((field) => {
      map.set(`${radio.id}::${field.name}`, field.value ?? "--");
    });
  });
  return map;
};

export const buildAvailableVariables = (radios, getRadioUid) =>
  radios.flatMap((radio) => {
    const radioUid = getRadioUid(radio) ?? radio.id;
    return (radio.structFields ?? [])
      .filter((field) => field?.name?.trim())
      .map((field) => ({
        radioId: radio.id,
        radioUid,
        name: field.name,
        type: field.type,
        address: field.address,
        bits: field.bits,
        comment: field.comment,
      }));
  });

export const getDisplayValue = (fieldValueMap, display) => {
  const value = fieldValueMap.get(`${display.radioId}::${display.variable}`);
  return value !== undefined && value !== "" ? value : "--";
};

export const getOverlappingCardIds = (displays) => {
  const overlappingIds = new Set();

  for (let i = 0; i < displays.length; i++) {
    for (let j = i + 1; j < displays.length; j++) {
      const a = displays[i];
      const b = displays[j];

      const ax = a.posx ?? a.x ?? 0;
      const ay = a.posy ?? a.y ?? 0;
      const bx = b.posx ?? b.x ?? 0;
      const by = b.posy ?? b.y ?? 0;

      if (cardsOverlap({ x: ax, y: ay }, { x: bx, y: by })) {
        overlappingIds.add(a.digitalDisplayId ?? a.id);
        overlappingIds.add(b.digitalDisplayId ?? b.id);
      }
    }
  }

  return overlappingIds;
};


