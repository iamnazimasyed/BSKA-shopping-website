import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'hoodie-1',
    name: 'Heavyweight Hoodie',
    description: 'Premium 450GSM cotton fleece hoodie',
    price: 999,
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800&h=1000',
    category: 'Hoodies',
    isSale: false
  },
  {
    id: 'tshirt-1',
    name: 'Boxy Graphic Tee',
    description: 'Vintage wash oversized graphic t-shirt',
    price: 999,
    oldPrice: 1499,
    imageUrl: 'https://images.unsplash.com/photo-1576566582417-4158872c638d?auto=format&fit=crop&q=80&w=800&h=1000',
    category: 'T-Shirts',
    isSale: true
  },
  {
    id: 'oversized-hoodie-1',
    name: 'Aesthetic Hoodie',
    description: 'Soft-touch relaxed fit hoodie',
    price: 999,
    oldPrice: 1499,
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800&h=1000',
    category: 'Hoodies',
    isSale: true
  },
  {
    id: 'jacket-1',
    name: 'Tech Bomber Jacket',
    description: 'Water-resistant urban utility jacket',
    price: 2000,
    oldPrice: 2499,
    imageUrl: 'https://images.unsplash.com/photo-1551028711-031cdaad6bb4?auto=format&fit=crop&q=80&w=800&h=1000',
    category: 'Jackets',
    isSale: true
  },
  {
    id: 'baggy-jeans-1',
    name: 'Loose Fit Denim',
    description: 'Vintage wash wide leg baggy jeans',
    price: 1700,
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800&h=1000',
    category: 'Jeans',
    isSale: false
  },
  {
    id: 'straight-jeans-1',
    name: 'Classic Straight Jeans',
    description: '14oz japanese selvedge denim',
    price: 1800,
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800&h=1000',
    category: 'Jeans',
    isSale: false
  },
  {
    id: 'cargo-pants-1',
    name: 'Tactical Cargoes',
    description: 'Modular pocket wide leg trousers',
    price: 1900,
    imageUrl: 'https://images.unsplash.com/photo-1517444810664-5e90eaaecb0a?auto=format&fit=crop&q=80&w=800&h=1000',
    category: 'Pants',
    isSale: false
  },
  {
    id: 'varsity-1',
    name: 'Varsity Jacket',
    description: 'Wool blend vintage sports jacket',
    price: 2800,
    oldPrice: 3500,
    imageUrl: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&q=80&w=800&h=1000',
    category: 'Jackets',
    isSale: true
  },
  {
    id: 'beanie-1',
    name: 'Ribbed Beanie',
    description: 'Acrylic blend stay-warm headwear',
    price: 499,
    imageUrl: 'https://images.unsplash.com/photo-1576871333020-0be11442f9ae?auto=format&fit=crop&q=80&w=800&h=1000',
    category: 'Accessories',
    isSale: false
  },
  {
    id: 'short-1',
    name: 'Mesh Gym Shorts',
    description: 'Breathable activewear double-layer shorts',
    price: 799,
    imageUrl: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=800&h=1000',
    category: 'Shorts',
    isSale: false
  }
];
