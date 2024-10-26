import { priceIndex } from './priceIndex';
import { services } from '../services';
import { updateAllProducts } from '../helpers/updateAllProducts';

updateAllProducts('PRICE_INDEX_QUEUE', priceIndex, services);
