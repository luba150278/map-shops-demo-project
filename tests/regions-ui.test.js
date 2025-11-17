/**
 * @jest-environment jsdom
 */

import {
  addRegionsToSvg,
  markRegionsWithShops,
  handleRegionClick,
} from '../public/js/ui/regions-ui.js';
import * as utils from '../public/js/utils/regions-utils.js';

jest.mock('../public/js/data/regions.js', () => ({
  regionsData: [
    {
      title: 'Київ',
      coord: [100, 200],
      isCircleHide: false,
    },
    {
      title: 'Львів',
      coord: [150, 250],
      isCircleHide: true,
    },
  ],
}));

describe('regions-ui', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <svg id="map-svg"></svg>
      <div id="cities"></div>
      <div id="region"></div>
      <div id="show-dealers"></div>
    `;
  });

  test('addRegionsToSvg() renders circles and text', () => {
    addRegionsToSvg();

    const circles = document.querySelectorAll('circle');
    const texts = document.querySelectorAll('text');

    expect(circles.length).toBe(1);
    expect(texts.length).toBe(2);
  });

  test('markRegionsWithShops() adds classes', () => {
    document.body.innerHTML += `
      <path title="kyiv"></path>
      <path title="lviv"></path>
    `;

    jest
      .spyOn(utils, 'isRegionWithShops')
      .mockImplementation((id) => id === 'kyiv');

    markRegionsWithShops();

    expect(
      document.querySelector('path[title="kyiv"]').classList.contains('shop')
    ).toBe(true);
    expect(
      document.querySelector('path[title="lviv"]').classList.contains('shop')
    ).toBe(false);
  });
});

test('handleRegionClick() highlights region and renders cities', () => {
  jest.spyOn(utils, 'getRegionShops').mockReturnValue({
    regionName: 'Київська',
    cities: [
      {
        id: 'Київ',
        stores: [{ name: 'Shop1', address: 'Addr1', phones: ['111'] }],
      },
    ],
    count: 1,
  });

  document.body.innerHTML = `
    <svg>
      <path title="kyiv"></path>
      <path title="lviv"></path>
    </svg>

    <div id="region"></div>
    <ul id="cities"></ul>
    <div id="show-dealers"></div>
  `;

  const event = {
    currentTarget: document.querySelector('path[title="kyiv"]'),
  };

  handleRegionClick(event);

  expect(
    document.querySelector('path[title="kyiv"]').classList.contains('active')
  ).toBe(true);
  expect(document.getElementById('region').textContent).toContain('Київська');
  expect(document.querySelectorAll('.shop-item').length).toBe(1);
});
