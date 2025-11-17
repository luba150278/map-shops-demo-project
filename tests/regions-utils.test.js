/**
 * @jest-environment jsdom
 */

import {
  convertShopData,
  isRegionWithShops,
  getRegionShops,
} from '../public/js/utils/regions-utils.js';


jest.mock('../public/js/data/regions.js', () => ({
  regionsData: [
    {
      slug: 'kyiv',
      region_name: 'Київська',
      coord: [100, 200],
      cities: [
        {
          id: 'Київ',
          stores: [{ name: 'Shop1', address: 'Addr1', phones: ['111'] }],
        },
      ],
    },
    {
      slug: 'lviv',
      region_name: 'Львівська',
      coord: [120, 150],
      cities: [],
    },
  ],
}));

describe('regions-utils', () => {
  test('convertShopData() should convert to flat array', () => {
    const result = convertShopData();

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: 'kyiv',
      regionName: 'Київська',
      coord: [100, 200],
      cities: expect.any(Array),
    });
  });

  test('isRegionWithShops() should return true for existing region', () => {
    expect(isRegionWithShops('kyiv')).toBe(true);
  });

  test('isRegionWithShops() should return false for non-existing region', () => {
    expect(isRegionWithShops('odessa')).toBe(false);
  });

  test('getRegionShops() should return region data with count', () => {
    const result = getRegionShops('kyiv');

    expect(result.regionName).toBe('Київська');
    expect(result.count).toBe(1);
    expect(result.cities[0].id).toBe('Київ');
  });

  test('getRegionShops() should return null for missing region', () => {
    expect(getRegionShops('unknown')).toBeNull();
  });
});
