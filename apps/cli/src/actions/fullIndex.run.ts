import { fullIndex } from './fullIndex';
import { services } from '../services';
import { updateAllProducts } from '../helpers/updateAllProducts';

updateAllProducts('FULL_INDEX_QUEUE', fullIndex, services);
