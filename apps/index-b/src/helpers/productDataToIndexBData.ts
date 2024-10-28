import { IndexBProductData } from '../types/IndexBProductData';
import { ProductData } from '@product-backend/types';

export function productDataToIndexBData(
  productData: ProductData
): IndexBProductData {
  return {
    id: productData.id,
    name: productData.name,
    price: productData.price,
  };
}
