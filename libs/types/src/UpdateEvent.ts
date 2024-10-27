import { EventAction } from './EventAction';
import { ProductData } from './ProductData';

export type UpdateEvent = {
  action: EventAction.Update;
  productData: Partial<ProductData>;
  tags: string[];
};
