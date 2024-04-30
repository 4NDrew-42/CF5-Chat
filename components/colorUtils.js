/**
 * Blends a given color with white.
 * @param color - The hex color code to blend with white.
 * @param opacity - The level of blending, where 0 is the original color and 1 is full white.
 * @returns {string} - The resulting color code.
 */
export const blendWithWhite = (color, opacity) => {
  const colorValue = color.substring(1) // Remove the '#' from the color if it's there.
  const rgb = parseInt(colorValue, 16) // Convert hex to decimal.

  const r = (rgb >> 16) & 0xff // Extract red.
  const g = (rgb >> 8) & 0xff // Extract green.
  const b = rgb & 0xff // Extract blue.

  // Calculate the blended color components.
  const rBlended = Math.round(r + (255 - r) * opacity)
  const gBlended = Math.round(g + (255 - g) * opacity)
  const bBlended = Math.round(b + (255 - b) * opacity)

  // Convert blended color back to hex.
  return `#${((rBlended << 16) | (gBlended << 8) | bBlended).toString(16).padStart(6, '0')}`
}
