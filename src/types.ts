export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  imageUrl: string;
  category: string;
  isSale: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface UserProfile {
  email: string;
  cart: CartItem[];
  updatedAt: string;
}
