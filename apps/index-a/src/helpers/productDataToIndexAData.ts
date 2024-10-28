import { IndexAProductData } from '../types/IndexAProductData';
import { ProductData } from '@product-backend/types';

export function productDataToIndexAData(
  productData: ProductData
): IndexAProductData {
  return {
    id: productData.id,
    name: productData.name,
    description: productData.description,
  };
}
