import { ProductData } from '@product-backend/types';
import { productDataToIndexBData } from './productDataToIndexBData';

export function updateIndexB(productData: ProductData) {
  const indexAData = productDataToIndexBData(productData);

  console.info('[Index B] Indexed', indexAData);
}
