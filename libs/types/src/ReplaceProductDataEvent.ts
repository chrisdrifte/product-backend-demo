import { ProductData } from './ProductData';

export type ReplaceProductDataEvent = {
  action: 'REPLACE';
  payload: ProductData;
};
