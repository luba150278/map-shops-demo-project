import { regionsData } from '../data/regions.js';
import { isRegionWithShops, getRegionShops } from '../utils/regions-utils.js';

// ------------------------------------------------------------
// addRegionsToSvg()
// Draws region markers (circle + label) on the map
// @returns {void}
// ------------------------------------------------------------
export function addRegionsToSvg() {
  const svgns = 'http://www.w3.org/2000/svg';
  const parent = document.getElementById('map-svg');

  if (!parent) return;

  regionsData.forEach((region) => {
    const [x, y] = region.coord || [];

    if (!x || !y) return;

    // Draw region circle unless hidden
    if (!region.isCircleHide) {
      const circle = document.createElementNS(svgns, 'circle');
      circle.setAttribute('cx', x);
      circle.setAttribute('cy', y);
      circle.setAttribute('r', 2);
      circle.setAttribute('style', 'fill:#fff; stroke-width:1px;');
      parent.appendChild(circle);
    }

    // Draw region label
    const text = document.createElementNS(svgns, 'text');
    text.setAttribute('x', x - 15);
    text.setAttribute('y', y + 8);
    text.textContent = region.title;

    parent.appendChild(text);
  });
}

// ------------------------------------------------------------
// markRegionsWithShops()
// Adds '.shop' class to SVG regions that have stores
// @returns {void}
// ------------------------------------------------------------
export function markRegionsWithShops() {
  const pathElements = document.getElementsByTagName('path');
  if (!pathElements.length) return;

  Array.from(pathElements).forEach((el) => {
    const title = el.getAttribute('title');
    if (isRegionWithShops(title)) {
      el.classList.add('shop');
    }

    el.addEventListener('click', handleRegionClick);
  });
}

// ------------------------------------------------------------
// handleRegionClick(event)
// Handles clicking on an SVG region — UI update, scroll, render list
// @param {MouseEvent} event
// @returns {void}
// ------------------------------------------------------------
function handleRegionClick(event) {
  clearPreviousRegionUI();

  const id = event.currentTarget.getAttribute('title');
  highlightActiveRegion(id);

  const regionData = getRegionShops(id);

  if (regionData) {
    document.getElementById(
      'region'
    ).innerHTML = `${regionData.regionName}<span>${regionData.count}</span>`;
    renderCities(regionData.cities);
  } else {
    document.getElementById('region').textContent =
      'Для цієї області магазини не знайдені';
  }

  scrollToDealersBlock();
}

// ------------------------------------------------------------
// clearPreviousRegionUI()
// Removes previous list of cities and side blocks
// @returns {void}
// ------------------------------------------------------------
function clearPreviousRegionUI() {
  document.querySelectorAll('.data-region').forEach((el) => el.remove());

  const citiesBlock = document.getElementById('cities');
  while (citiesBlock.firstChild) {
    citiesBlock.removeChild(citiesBlock.firstChild);
  }
}

// ------------------------------------------------------------
// highlightActiveRegion(id)
// Highlights the clicked SVG region, removes highlight from others
// @param {string} id - region slug
// @returns {void}
// ------------------------------------------------------------
function highlightActiveRegion(id) {
  const pathElements = document.getElementsByTagName('path');
  if (!pathElements) return;
  Array.from(pathElements).forEach((el) => {
    el.classList.toggle('active', el.getAttribute('title') === id);
  });
}

// ------------------------------------------------------------
// renderCities(cities, isCommon = false, targetId)
// Renders list of cities and their stores
//
// @param {Array} cities - array of cities with stores
// @param {boolean} isCommon - append into custom container if true
// @param {string} targetId - id of target element (when isCommon = true)
// @returns {void}
// ------------------------------------------------------------
function renderCities(cities, isCommon = false, targetId = '') {
  cities.forEach((city) => {
    if (!city.stores.length) return;

    const container = isCommon
      ? document.getElementById(targetId)
      : document.getElementById('cities');

    if (!container) return;

    const li = document.createElement('li');
    li.classList.add('city-item');

    const header = document.createElement('div');
    header.innerHTML = `<h4>${city.id}<span>${city.stores.length}</span></h4>`;
    li.appendChild(header);

    const ul = document.createElement('ul');
    ul.classList.add('shops-list');

    const sortedStores = city.stores.sort((a, b) => {
      const nameCmp = a.name.localeCompare(b.name);
      return nameCmp !== 0 ? nameCmp : a.address.localeCompare(b.address);
    });

    sortedStores.forEach((store, index) => {
      const storeItem = document.createElement('li');
      storeItem.classList.add('shop-item');

      storeItem.innerHTML = `
        <p>${index + 1}</p>
        <p>${store.name}</p>
        <p>${store.address}</p>
        <p>${store.phones.join(', ')}</p>
      `;

      ul.appendChild(storeItem);
    });

    li.appendChild(ul);
    container.appendChild(li);
  });
}

// ------------------------------------------------------------
// scrollToDealersBlock()
// Smooth-scroll to dealers list
// @returns {void}
// ------------------------------------------------------------
function scrollToDealersBlock() {
  const target = document.getElementById('show-dealers');
  if (!target) return;

  window.scrollTo({
    top: target.offsetTop,
    behavior: 'smooth',
  });
}

export { handleRegionClick };
