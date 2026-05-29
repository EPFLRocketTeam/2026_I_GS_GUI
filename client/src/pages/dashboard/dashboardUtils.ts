import { CARD_GAP, CARD_W, CARD_H, GRID_HEIGHT, GRID_WIDTH } from "../../constants/gridConstants";
import { DigitalDisplay } from "../../interfaces/dashboardInterfaces";
export const getCardWidth = (gridPx: number) =>
  CARD_W * gridPx;

export const getCardHeight = (gridPx: number) =>
  CARD_H * gridPx;

export const clampDisplayPosition = ({x, y, maxX, maxY} : 
  {x: number, y: number, maxX: number, maxY: number}) => ({
  x: Math.max(0, Math.min(x, maxX)),
  y: Math.max(0, Math.min(y, maxY)),
}); 

export const cardsOverlap = (a: DigitalDisplay, b: DigitalDisplay) => {
  return !(
    a.posx + CARD_W + CARD_GAP <= b.posx ||
    b.posx + CARD_W + CARD_GAP <= a.posx ||
    a.posx + CARD_H + CARD_GAP <= b.posy ||
    b.posx + CARD_H + CARD_GAP <= a.posy
  );
};

export const hasCardOverlap = (moving: DigitalDisplay, displays: DigitalDisplay[]) => {
  return displays.some((display) => {
    const movingId = moving.digitalDisplayId ?? moving.digitalDisplayId;
    const displayId = display.digitalDisplayId ?? display.digitalDisplayId;
    if (displayId === movingId) return false;

    const movingX = moving.posx ?? moving.posx ?? 0;
    const movingY = moving.posy ?? moving.posy ?? 0;
    const displayX = display.posx ?? display.posx ?? 0;
    const displayY = display.posy ?? display.posy ?? 0;

    return cardsOverlap({...moving, posx: movingX, posy: movingY }, {...display, posx: displayX, posy: displayY });
  });
};

export const createDragState = ({ e, display, zoom, pan }: 
  { e: React.MouseEvent, display: DigitalDisplay, zoom: number, pan: DigitalDisplay}
) => {
  if (e.button !== 0) return null;

  const viewport = e.currentTarget.closest(".dashboard-zoom-viewport");
  if (!viewport) return null;

  const rect = viewport.getBoundingClientRect();
  const mouseWorldX = (e.clientX - rect.left - pan.posx) / zoom;
  const mouseWorldY = (e.clientY - rect.top - pan.posy) / zoom;

  const id = display.digitalDisplayId ?? display.digitalDisplayId;
  const digitalDisplayId = display.digitalDisplayId ?? null;
  const startX = display.posx ?? display.posx ?? 0;
  const startY = display.posy ?? display.posy ?? 0;

  return {
    id,
    digitalDisplayId,
    startX,
    startY,
    offsetX: mouseWorldX - startX,
    offsetY: mouseWorldY - startY,
  };
};

export const getDraggedCardPosition = ({ e, dragging, zoom, pan }:
  {e: React.MouseEvent, dragging: DigitalDisplay, zoom: number, pan: DigitalDisplay}
) => {
  const viewport = e.currentTarget.closest(".dashboard-zoom-viewport");
  if (!viewport) {
    throw new Error("Viewport not found");
  }
  const rect = viewport.getBoundingClientRect();
  const mouseWorldX = (e.clientX - rect.left - pan.posx) / zoom;
  const mouseWorldY = (e.clientY - rect.top - pan.posy) / zoom;

  return {
    x: mouseWorldX - dragging.posx,
    y: mouseWorldY - dragging.posy,
  };
};

export const moveDraggedDisplay = ({ displays, dragging, x, y }: 
  {displays: DigitalDisplay[], dragging: DigitalDisplay, x: number, y: number}) => {
  const clamped = clampDisplayPosition({
    x,
    y,
    maxX: GRID_WIDTH - 100,  // TODO: fix magic number
    maxY: GRID_HEIGHT - 100,
  });
  return displays.map((display) => {
    const id = display.digitalDisplayId ?? display.digitalDisplayId;
    if (id === dragging.digitalDisplayId) {
      if (display.digitalDisplayId) {
        return { ...display, posx: clamped.x, posy: clamped.y };
      }
      return { ...display, x: clamped.x, y: clamped.y };
    }
    return display;
  });
};

export const resolveDroppedDisplay = ({ displays }: {displays: DigitalDisplay[]}) => displays;

export const clampZoom = (value: number) => Math.min(2, Math.max(1, value));

export const getViewportMousePos = (e: React.MouseEvent) => {
  const rect = e.currentTarget.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
};

export const getNextZoomPan = ({ mouseX, mouseY, zoom, pan, delta }: 
  {mouseX: number, mouseY: number, zoom: number, pan: DigitalDisplay, delta: number}
) => {
  const nextZoom = clampZoom(Number((zoom + delta).toFixed(2)));
  const worldX = (mouseX - pan.posx) / zoom;
  const worldY = (mouseY - pan.posy) / zoom;
  return {
    zoom: nextZoom,
    pan: {
      x: mouseX - worldX * nextZoom,
      y: mouseY - worldY * nextZoom,
    },
  };
};

export const createDisplayFromField = ({fieldInfo, count = 0}: 
  {fieldInfo: DigitalDisplay, count:number}
) => ({
  digitalDisplayId: crypto.randomUUID(),
  title: `Display ${count + 1}`,
  varName: fieldInfo.varName || "",
  varValue: "--",
  radioId: fieldInfo.radioId ?? null,
  type: fieldInfo.type || "",
  suffix: "",
  posx: fieldInfo.posx ?? GRID_WIDTH / 2 - CARD_W / 2 + (count % 3) * CARD_W,  // TODO: review logic here
  posy: fieldInfo.posy ?? GRID_HEIGHT / 2 - CARD_H / 2 + Math.floor(count / 3) * CARD_H,
});

export const buildFieldValueMap = (radios: ) => {
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


