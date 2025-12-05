import { Product } from "./product.types";

export function calculateDiscountPrice(product: Product, discount: number) {
  return product.price - (product.price * discount) / 100;
}

export function searchProducts(products: Product[], keyword: string) {
  return products.filter(p =>
    p.name.toLowerCase().includes(keyword.toLowerCase())
  );
}
