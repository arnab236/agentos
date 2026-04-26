export const confColor = (v) => {
  if (v >= 0.75) return "#3ecfaa";
  if (v >= 0.45) return "#f4a94a";
  return "#e05c5c";
};

export const confLabel = (v) => {
  if (v >= 0.75) return "high confidence";
  if (v >= 0.45) return "moderate confidence";
  return "low confidence";
};
