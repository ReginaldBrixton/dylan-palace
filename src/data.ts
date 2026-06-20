import { Product } from './types';
import { img } from './imageMap';
import shirtsRaw from './data/shirts.json?raw';
import shoesRaw from './data/shoes.json?raw';
import bagsRaw from './data/bags.json?raw';
import trousersRaw from './data/trousers.json?raw';

const shirtsData = JSON.parse(shirtsRaw);
const shoesData = JSON.parse(shoesRaw);
const bagsData = JSON.parse(bagsRaw);
const trousersData = JSON.parse(trousersRaw);

function mapProducts(items: any[], folder: string): Product[] {
  return items.map((item: any) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    category: folder === 'shirts' ? 'SHIRTS' : folder === 'shoes' ? 'SHOES' : folder === 'bags' ? 'BAGS' : 'TROUSERS',
    subCategory: item.subCategory,
    gender: item.gender,
    images: Array.isArray(item.image)
      ? item.image.map((imgPath: string) => img(`${folder}/${imgPath}`))
      : [img(`${folder}/${item.image}`)],
    description: item.description,
    sizes: item.sizes,
    deliversBy: ''
  }));
}

export const PRODUCTS: Product[] = [
  ...mapProducts(shirtsData.shirts, 'shirts'),
  ...mapProducts(trousersData.trousers, 'trousers'),
  ...mapProducts(shoesData.shoes, 'shoes'),
  ...mapProducts(bagsData.bags, 'bags'),
];
