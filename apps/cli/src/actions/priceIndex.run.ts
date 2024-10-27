import { priceIndex } from './priceIndex';
import { services } from '../services';
import { timestampId } from '@product-backend/helpers';
import { updateAllProducts } from '../helpers/updateAllProducts';

const queueId = process.env.QUEUE_ID ?? timestampId();

updateAllProducts(`PRICE_INDEX_${queueId}`, priceIndex, services);
