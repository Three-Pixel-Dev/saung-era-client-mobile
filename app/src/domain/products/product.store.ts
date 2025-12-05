import { create } from "zustand";
import { Product } from "./product.types";
import { fetchProducts } from "./product.api";

interface ProductStore {
  products: Product[];
  loading: boolean;
  loadProducts: () => Promise<void>;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  loading: false,

  loadProducts: async () => {
    set({ loading: true });
    try {
      const result = await fetchProducts();
      set({ products: result.data });
    } catch (err) {
      console.log("Error loading products:", err);
    } finally {
      set({ loading: false });
    }
  },
}));
