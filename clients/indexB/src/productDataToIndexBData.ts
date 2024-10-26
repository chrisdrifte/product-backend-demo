import { IndexBProductData } from './IndexBProductData';
import { ProductData } from '@product-backend/types';

export function productDataToIndexBData(
  productData: ProductData
): IndexBProductData {
  return {
    name: productData.name,
    price: productData.price,
  };
}
