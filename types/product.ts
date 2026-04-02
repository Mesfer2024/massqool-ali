export type ProductCategory = 'wall-clocks' | 'lamps' | 'side-tables' | 'signature';

export interface Product {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  category: ProductCategory;
  price: number;
  images: string[];
  descriptionAr: string;
  descriptionEn: string;
  isSignature: boolean;
  isFeatured: boolean;
  isSold?: boolean;
  dimensions?: { ar: string; en: string };
  isPlaceholderDimensions?: boolean;
  materials?: string;
  whatsappInquiryText: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

