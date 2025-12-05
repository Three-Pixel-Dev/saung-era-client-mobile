import { ProductResponse } from "./product.types";
import { api } from "../../services/api";

export async function fetchProducts(): Promise<ProductResponse> {
  const res = await api.get("/products");
  return res.data;
}
