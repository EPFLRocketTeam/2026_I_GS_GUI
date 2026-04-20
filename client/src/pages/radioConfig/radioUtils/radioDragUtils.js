import { useCallback, useState } from "react";

export const handleDragStart = (radioId, setDraggedRadioId, setDragOverRadioId) => {
  setDraggedRadioId(radioId);
  setDragOverRadioId(null);
};

export const handleDragEnter = (radioId, draggedRadioId, setDragOverRadioId) => {
  if (radioId !== draggedRadioId) {
    setDragOverRadioId(radioId);
  }
};

export const handleDrop = (
  targetRadioId,
  draggedRadioId,
  setDraggedRadioId,
  setDragOverRadioId,
  setRadios
) => {
  if (!draggedRadioId || draggedRadioId === targetRadioId) {
    setDraggedRadioId(null);
    setDragOverRadioId(null);
    return;
  }

  setRadios((prev) => moveRadio(prev, draggedRadioId, targetRadioId));
  setDraggedRadioId(null);
  setDragOverRadioId(null);
};

export const handleDragEnd = (setDraggedRadioId, setDragOverRadioId) => {
  setDraggedRadioId(null);
  setDragOverRadioId(null);
};

export const moveRadio = (list, fromId, toId) => {
  const fromIndex = list.findIndex((r) => r.id === fromId);
  const toIndex = list.findIndex((r) => r.id === toId);

  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
    return list;
  }

  const updated = [...list];
  const [moved] = updated.splice(fromIndex, 1);
  updated.splice(toIndex, 0, moved);
  return updated;
};

function useRadioDrag(setRadios) {
  const [draggedRadioId, setDraggedRadioId] = useState(null);
  const [dragOverRadioId, setDragOverRadioId] = useState(null);

  const handleDragStart = useCallback((radioId) => {
    setDraggedRadioId(radioId);
    setDragOverRadioId(null);
  }, []);

  const handleDragEnter = useCallback((radioId) => {
    setDragOverRadioId((current) => {
      if (radioId === draggedRadioId) return current;
      return radioId;
    });
  }, [draggedRadioId]);

  const handleDrop = useCallback((targetRadioId) => {
    if (!draggedRadioId || draggedRadioId === targetRadioId) {
      setDraggedRadioId(null);
      setDragOverRadioId(null);
      return;
    }

    setRadios((prev) => moveRadio(prev, draggedRadioId, targetRadioId));
    setDraggedRadioId(null);
    setDragOverRadioId(null);
  }, [draggedRadioId, setRadios]);

  const handleDragEnd = useCallback(() => {
    setDraggedRadioId(null);
    setDragOverRadioId(null);
  }, []);

  return {
    draggedRadioId,
    dragOverRadioId,
    handleDragStart,
    handleDragEnter,
    handleDrop,
    handleDragEnd,
  };
}

export default useRadioDrag;