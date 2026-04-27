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

export const resolveDroppedDisplay = ({ displays }) => displays;

export const clampZoom = (value) => Math.min(2, Math.max(0.4, value));

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
  id: crypto.randomUUID(),
  title: fieldInfo.name || `Display ${count + 1}`,
  variable: fieldInfo.name || "",
  suffix: "",
  radioId: fieldInfo.radioId,
  radioUid: fieldInfo.radioUid,
  type: fieldInfo.type || "",
  x: window.innerWidth / 2 - CARD_W / 2 + (count % 3) * 24,
  y: window.innerHeight / 2 - CARD_H / 2 + Math.floor(count / 3) * 24,
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

      if (
        cardsOverlap(
          { x: a.x ?? 0, y: a.y ?? 0 },
          { x: b.x ?? 0, y: b.y ?? 0 }
        )
      ) {
        overlappingIds.add(a.id);
        overlappingIds.add(b.id);
      }
    }
  }

  return overlappingIds;
};
