import { IndexAProductData } from './IndexAProductData';
import { ProductData } from '@product-backend/types';

export function productDataToIndexAData(
  productData: ProductData
): IndexAProductData {
  return {
    name: productData.name,
    description: productData.description,
  };
}
