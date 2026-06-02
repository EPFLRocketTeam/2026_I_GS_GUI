import { CARD_GAP, CARD_W, CARD_H, GRID_HEIGHT, GRID_WIDTH } from "../../constants/gridConstants";
import { DigitalDisplay } from "../../interfaces/dashboardInterfaces";
import { Radio } from "../../interfaces/radioInterfaces";
import { FieldValueMap, RadioConfigParamFromRadio, RadioUidGetter } from "../../types/types";

export const getCardWidth = (gridPx: number) =>
  CARD_W * gridPx;

export const getCardHeight = (gridPx: number) =>
  CARD_H * gridPx;

export const clampDisplayPosition = ({x, y, maxX, maxY} : 
  {x: number, y: number, maxX: number, maxY: number}) => ({
  x: Math.max(0, Math.min(x, maxX)),
  y: Math.max(0, Math.min(y, maxY)),
}); 

export const cardsOverlap = (a: Pick<DigitalDisplay, "posx" | "posy">,
  b: Pick<DigitalDisplay, "posx" | "posy">,) => {
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


type Point = {
  x: number;
  y: number;
};

export type DisplayDragState = {
  digitalDisplayId: string;
  offsetX: number;
  offsetY: number;
};

const getViewportRectFromEvent = (e: React.MouseEvent | MouseEvent) => {
  const target = e.target as HTMLElement | null;

  const viewport =
    target?.closest(".dashboard-zoom-viewport") ??
    document.querySelector(".dashboard-zoom-viewport");

  if (!viewport) {
    throw new Error("Viewport not found");
  }

  return viewport.getBoundingClientRect();
};

export const createDragState = ({
  e,
  display,
  zoom,
  pan,
}: {
  e: React.MouseEvent;
  display: DigitalDisplay;
  zoom: number;
  pan: Point;
}): DisplayDragState | null => {
  if (e.button !== 0) return null;

  e.preventDefault();
  e.stopPropagation();

  const rect = getViewportRectFromEvent(e);

  const mouseWorldX = (e.clientX - rect.left - pan.x) / zoom;
  const mouseWorldY = (e.clientY - rect.top - pan.y) / zoom;

  return {
    digitalDisplayId: display.digitalDisplayId,
    offsetX: mouseWorldX - display.posx,
    offsetY: mouseWorldY - display.posy,
  };
};

export const getDraggedCardPosition = ({
  e,
  dragging,
  zoom,
  pan,
}: {
  e: React.MouseEvent | MouseEvent;
  dragging: DisplayDragState;
  zoom: number;
  pan: Point;
}) => {
  const rect = getViewportRectFromEvent(e);

  const mouseWorldX = (e.clientX - rect.left - pan.x) / zoom;
  const mouseWorldY = (e.clientY - rect.top - pan.y) / zoom;

  return {
    x: mouseWorldX - dragging.offsetX,
    y: mouseWorldY - dragging.offsetY,
  };
};

export const moveDraggedDisplay = ({
  displays,
  dragging,
  x,
  y,
}: {
  displays: DigitalDisplay[];
  dragging: DisplayDragState;
  x: number;
  y: number;
}): DigitalDisplay[] => {
  const clamped = clampDisplayPosition({
    x,
    y,
    maxX: GRID_WIDTH - CARD_W,
    maxY: GRID_HEIGHT - CARD_H,
  });

  return displays.map((display) =>
    display.digitalDisplayId === dragging.digitalDisplayId
      ? {
          ...display,
          posx: clamped.x,
          posy: clamped.y,
        }
      : display,
  );
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

export interface AvailableVariable {
  radioId: DigitalDisplay["radioId"];
  radioUid: string | number;
  name: string;
  varName: string;
  label: string;
  value: string;
  type: RadioConfigParamFromRadio["control"];
  control: RadioConfigParamFromRadio["control"];
  options?: RadioConfigParamFromRadio["options"];
  min?: RadioConfigParamFromRadio["min"];
  max?: RadioConfigParamFromRadio["max"];
  maxLength?: RadioConfigParamFromRadio["maxLength"];
}

const toDisplayRadioId = (id: Radio["id"]): DigitalDisplay["radioId"] => {
  if (typeof id === "number") return id;

  const parsedId = Number(id);

  return Number.isFinite(parsedId) ? parsedId : null;
};

export const buildFieldValueMap = (radios: Radio[]): FieldValueMap => {
  const map: FieldValueMap = new Map();

  radios.forEach((radio) => {
    const radioId = toDisplayRadioId(radio.id);

    if (radioId === null) return;

    (radio.configParams ?? []).forEach((param) => {
      if (!param.key?.trim()) return;

      map.set(`${radioId}::${param.key}`, param.value?.trim() || "--");
    });
  });

  return map;
};

export const buildAvailableVariables = (
  radios: Radio[],
  getRadioUid?: RadioUidGetter,
): AvailableVariable[] =>
  radios.flatMap((radio) => {
    const radioId = toDisplayRadioId(radio.id);
    const radioUid = getRadioUid?.(radio) ?? radio.id;

    if (radioId === null) return [];

    return (radio.configParams ?? [])
      .filter((param) => param.key?.trim())
      .map((param) => ({
        radioId,
        radioUid,
        name: param.key,
        varName: param.key,
        label: param.label,
        value: param.value,
        type: param.control,
        control: param.control,
        options: param.options,
        min: param.min,
        max: param.max,
        maxLength: param.maxLength,
      }));
  });

export const getDisplayValue = (
  fieldValueMap: FieldValueMap,
  display: DigitalDisplay,
): string => {
  if (display.radioId === null || !display.varName?.trim()) {
    return "--";
  }

  const value = fieldValueMap.get(`${display.radioId}::${display.varName}`);

  return value !== undefined && value.trim() !== "" ? value : "--";
};

export const getOverlappingCardIds = (
  displays: DigitalDisplay[],
): Set<DigitalDisplay["digitalDisplayId"]> => {
  const overlappingIds = new Set<DigitalDisplay["digitalDisplayId"]>();

  for (let i = 0; i < displays.length; i++) {
    for (let j = i + 1; j < displays.length; j++) {
      const a = displays[i];
      const b = displays[j];

      if (cardsOverlap(a, b)) {
        overlappingIds.add(a.digitalDisplayId);
        overlappingIds.add(b.digitalDisplayId);
      }
    }
  }

  return overlappingIds;
};




