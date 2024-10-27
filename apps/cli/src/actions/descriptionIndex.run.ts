import { descriptionIndex } from './descriptionIndex';
import { services } from '../services';
import { timestampId } from '@product-backend/helpers';
import { updateAllProducts } from '../helpers/updateAllProducts';

const queueId = process.env.QUEUE_ID ?? timestampId();

updateAllProducts(`DESCRIPTION_INDEX_${queueId}`, descriptionIndex, services);
