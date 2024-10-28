import { ProductData } from '@product-backend/types';

export function mergeProductData(
  prevProductData: ProductData,
  newProductData: Partial<ProductData>
) {
  return {
    ...prevProductData,
    ...newProductData,
  };
}
