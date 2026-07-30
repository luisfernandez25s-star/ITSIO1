// Vite-compatible image loading utility
// Uses import.meta.glob to preload all images

// Vehicle type images (e.g., reaction.png, rescue.png)
const vehicleTypeImages = import.meta.glob('@/assets/vehiclesImages/*.png', { eager: true })

// Vehicle unit images
const vehicleUnitImages = import.meta.glob('@/assets/vehiclesUnitImg/**/*.png', { eager: true })

/**
 * Get vehicle type image URL
 * @param {string} imgName - Image name without extension (e.g., "reaction")
 * @returns {string} - Image URL or placeholder
 */
export function getVehicleTypeImage(imgName) {
  const key = `/src/assets/vehiclesImages/${imgName}.png`
  const module = vehicleTypeImages[key]
  return module?.default || '/placeholder-vehicle.png'
}

/**
 * Get vehicle unit image URL
 * @param {string} imgPath - Image path without extension (e.g., "reaction/u1/u-1right")
 * @returns {string} - Image URL or placeholder
 */
export function getVehicleUnitImage(imgPath) {
  const key = `/src/assets/vehiclesUnitImg/${imgPath}.png`
  const module = vehicleUnitImages[key]
  return module?.default || '/placeholder-vehicle.png'
}

/**
 * Get specific vehicle view image
 * @param {string} category - Vehicle category folder (e.g., "reaction")
 * @param {number} unitNumber - Unit number
 * @param {string} view - View type (right, front, back, left, up)
 * @returns {string} - Image URL or placeholder
 */
export function getVehicleViewImage(category, unitNumber, view) {
  return getVehicleUnitImage(`${category}/u${unitNumber}/u-${unitNumber}${view}`)
}

/**
 * Get simple vehicle unit thumbnail
 * @param {string} imgName - Image name without extension
 * @returns {string} - Image URL or placeholder
 */
export function getVehicleThumbnail(imgName) {
  return getVehicleUnitImage(imgName)
}
