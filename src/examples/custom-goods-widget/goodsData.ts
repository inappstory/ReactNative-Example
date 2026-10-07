export interface Product {
  sku: string;
  title: string;
  subtitle?: string;
  imageURL?: string;
  price?: string;
  oldPrice?: string;
}

export const DEMO_GOODS_CATALOG: Record<string, Product> = {
  'SKU-001': {
    sku: 'SKU-001',
    title: 'Product One',
    subtitle: 'In stock',
    imageURL: 'https://example.com/images/sku-001.jpg',
    price: '99.99',
    oldPrice: '129.99',
  },
  'SKU-002': {
    sku: 'SKU-002',
    title: 'Product Two',
    subtitle: 'Limited offer',
    imageURL: 'https://example.com/images/sku-002.jpg',
    price: '49.99',
  },
  'SKU-003': {
    sku: 'SKU-003',
    title: 'Product Three',
    subtitle: 'Out of stock',
    imageURL: 'https://example.com/images/sku-003.jpg',
    price: '19.99',
  },
};
