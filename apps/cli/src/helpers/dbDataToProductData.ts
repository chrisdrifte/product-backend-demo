import { ProductData } from '@product-backend/types';

export function dbDataToProductData(dbData: unknown) {
  const productData = dbData as ProductData;

  return productData;
}
