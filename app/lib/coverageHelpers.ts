/**
 * 根據覆蓋率百分比返回顏色
 */
export const getCoverageColor = (percentage: number): { text: string; bar: string } => {
  if (percentage >= 95) {
    return { text: 'text-green-600', bar: 'bg-green-500' };
  } else if (percentage >= 76) {
    return { text: 'text-blue-600', bar: 'bg-blue-500' };
  } else if (percentage >= 50) {
    return { text: 'text-amber-600', bar: 'bg-amber-500' };
  } else {
    return { text: 'text-stone-400', bar: 'bg-stone-300' };
  }
};
