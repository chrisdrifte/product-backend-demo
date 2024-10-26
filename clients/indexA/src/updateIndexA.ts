import { ProductData } from '@product-backend/types';
import { productDataToIndexAData } from './productDataToIndexAData';

export function updateIndexA(productData: ProductData) {
  const indexAData = productDataToIndexAData(productData);

  console.info('[Index A] Indexed', indexAData);
}
