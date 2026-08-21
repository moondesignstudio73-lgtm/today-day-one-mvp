export function getWrappedFocusIndex(currentIndex, total, backwards = false) {
  if (!Number.isInteger(total) || total < 1) return -1;
  if (currentIndex < 0) return backwards ? total - 1 : 0;
  if (backwards && currentIndex === 0) return total - 1;
  if (!backwards && currentIndex === total - 1) return 0;
  return currentIndex + (backwards ? -1 : 1);
}
