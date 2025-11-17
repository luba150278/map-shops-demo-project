import { regionsData } from '../data/regions.js'

// ------------------------------------------------------------
// HELPER: Normalize region data into a flat array (shopArr)
// ------------------------------------------------------------
export function convertShopData() {
  const shopArr = regionsData.map((region) => ({
    id: region.slug,
    regionName: region.region_name,
    coord: region.coord,
    cities: region.cities,
  }));

  return shopArr;
}


// ------------------------------------------------------------
// isRegionWithShops(id)
// Checks if a region exists in shopArr
// @param {string} id - SVG region slug
// @returns {boolean}
// ------------------------------------------------------------
export function isRegionWithShops(id) {
  return Boolean(findRegionData(id));
}
// ------------------------------------------------------------
// findRegionData(id)
// Finds full region data in shopArr by slug
// @param {string} id - region slug
// @returns {object|null}
// ------------------------------------------------------------
function findRegionData(id) {
  return convertShopData().find((region) => region.id === id) || null;
}


// ------------------------------------------------------------
// getRegionShops(id)
// Returns stores info for region
// @param {string} id - region slug
// @returns {object|null} {regionName, cities, count}
// ------------------------------------------------------------
export function getRegionShops(id) {
  const region = findRegionData(id);
  if (!region) return null;

  return {
    regionName: region.regionName,
    cities: region.cities.sort((a, b) => a.id.localeCompare(b.id)),
    count: region.cities.reduce((acc, city) => acc + city.stores.length, 0),
  };
}