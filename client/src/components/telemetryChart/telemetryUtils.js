export const handleClick = (chartData, setPinnedPoint) => {
    if (chartData?.activePayload?.[0]) {
      const point = chartData.activePayload[0].payload;
      // toggle off if clicking same timeLabel
      setPinnedPoint(prev => prev?.timeLabel === point.timeLabel ? null : point);
    }
  };

export const displayData = (pinnedPoint, data, dataKey) => {
  return pinnedPoint
    ? data.map(d => ({ ...d, [dataKey]: d.timeLabel === pinnedPoint.timeLabel ? d[dataKey] : null }))
    : data;
};