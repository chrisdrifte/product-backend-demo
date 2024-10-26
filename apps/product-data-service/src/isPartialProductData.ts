import { ProductData } from '@product-backend/types';

export function isPartialProductData(partialProductData: Partial<ProductData>) {
  if (typeof partialProductData.id === 'undefined') {
    throw new Error('id is required');
  }

  if (typeof partialProductData.name === 'undefined') {
    return true;
  }

  if (typeof partialProductData.description === 'undefined') {
    return true;
  }

  if (typeof partialProductData.price === 'undefined') {
    return true;
  }

  return false;
}
