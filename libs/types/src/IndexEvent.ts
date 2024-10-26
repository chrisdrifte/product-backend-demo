import { EventAction } from './EventAction';
import { ProductData } from './ProductData';

export type IndexEvent = {
  action: EventAction.Index;
  productData: ProductData;
};
