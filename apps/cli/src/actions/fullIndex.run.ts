import { fullIndex } from './fullIndex';
import { services } from '../services';
import { timestampId } from '@product-backend/helpers';
import { updateAllProducts } from '../helpers/updateAllProducts';

const queueId = process.env.QUEUE_ID ?? timestampId();

updateAllProducts(`FULL_INDEX_${queueId}`, fullIndex, services);
