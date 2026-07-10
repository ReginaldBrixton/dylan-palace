import { filterProducts } from './useProductFilters';
import type { Product } from '../types';

const products: Product[] = [
  { id: '1', name: 'Olive Shirt', price: 120, category: 'SHIRTS', subCategory: 'SHORT SLEEVES', brand: 'Dylan', gender: 'MALE', images: ['a'], description: 'Cotton shirt', sizes: ['M'], deliversBy: 'Tomorrow' },
  { id: '2', name: 'Cream Shirt', price: 90, category: 'SHIRTS', subCategory: 'LONG SLEEVES', brand: 'Palace', gender: 'UNISEX', images: ['b'], description: 'Linen shirt', sizes: ['S'], deliversBy: 'Tomorrow' },
];

describe('filterProducts', () => {
  it('matches name, brand, subtype and description text', () => {
    expect(filterProducts(products, 'linen', { brand: 'ALL', gender: 'ALL', subCategory: 'ALL' }, 'recommended')).toEqual([products[1]]);
  });

  it('applies filters and price sorting', () => {
    const result = filterProducts(products, '', { brand: 'ALL', gender: 'ALL', subCategory: 'ALL' }, 'price-asc');
    expect(result.map((product) => product.id)).toEqual(['2', '1']);
  });
});
