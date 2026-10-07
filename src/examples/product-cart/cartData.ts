export interface LocalCartItem {
  offerId: string;
  name?: string;
  price?: string;
  currency?: string;
  quantity: number;
}

export interface LocalCartState {
  items: LocalCartItem[];
  totalPrice: number;
  currency: string;
}

export const INITIAL_CART: LocalCartState = {
  items: [
    {
      offerId: 'product-1',
      name: 'Smart Watch Series 7',
      price: '299.99',
      currency: 'EUR',
      quantity: 1,
    },
    {
      offerId: 'product-2',
      name: 'Wireless Earbuds',
      price: '129.50',
      currency: 'EUR',
      quantity: 2,
    },
  ],
  totalPrice: 558.99,
  currency: 'EUR',
};

// Simulated product catalog to look up prices for additions
export const MOCK_CATALOG: Record<string, Omit<LocalCartItem, 'quantity'>> = {
  'product-1': { offerId: 'product-1', name: 'Smart Watch Series 7', price: '299.99', currency: 'EUR' },
  'product-2': { offerId: 'product-2', name: 'Wireless Earbuds', price: '129.50', currency: 'EUR' },
  'product-3': { offerId: 'product-3', name: 'Fitness Band', price: '49.99', currency: 'EUR' },
};
