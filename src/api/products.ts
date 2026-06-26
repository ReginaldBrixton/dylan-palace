import { Product, ProductCategory } from '../types';
import { img } from '../utils/imageMap';
import shirtsRaw from '../data/shirts.json?raw';
import shoesRaw from '../data/shoes.json?raw';
import bagsRaw from '../data/bags.json?raw';
import trousersRaw from '../data/trousers.json?raw';

const shirtsData = JSON.parse(shirtsRaw);
const shoesData = JSON.parse(shoesRaw);
const bagsData = JSON.parse(bagsRaw);
const trousersData = JSON.parse(trousersRaw);

const CATEGORY_MAP: Record<string, ProductCategory> = {
  shirts: 'SHIRTS',
  shoes: 'SHOES',
  bags: 'BAGS',
  trousers: 'TROUSERS',
};

function mapProducts(items: any[], folder: string): Product[] {
  const category = CATEGORY_MAP[folder];
  return items.map((item: any) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    category,
    subCategory: item.subCategory,
    gender: item.gender,
    images: Array.isArray(item.image)
      ? item.image.map((imgPath: string) => img(`${folder}/${imgPath}`))
      : [img(`${folder}/${item.image}`)],
    description: item.description,
    sizes: item.sizes,
    deliversBy: '',
  }));
}

export const PRODUCTS: Product[] = [
  ...mapProducts(shirtsData.shirts, 'shirts'),
  ...mapProducts(trousersData.trousers, 'trousers'),
  ...mapProducts(shoesData.shoes, 'shoes'),
  ...mapProducts(bagsData.bags, 'bags'),
];

export function getProductsByCategory(category: ProductCategory): Product[] {
  return PRODUCTS.filter(p => p.category === category);
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find(p => p.id === id);
}

export function getRelatedProducts(product: Product, limit: number = 3): Product[] {
  return PRODUCTS.filter(p => p.category === product.category && p.id !== product.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, limit);
}
