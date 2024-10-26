import { ProductData } from '@product-backend/types';
import { createLocalKv } from '@product-backend/clients/localKv';
import { productDataToIndexBData } from './productDataToIndexBData';

export async function updateIndexB(productData: ProductData) {
  const indexAData = productDataToIndexBData(productData);

  console.info('[Index B] Indexed', indexAData);

  // mimic storing in an index
  const localKv = createLocalKv();
  const kv = await localKv.connect({
    url: 'INDEX_B',
  });

  await kv.set(`PRODUCT_${indexAData.id}`, JSON.stringify(indexAData));
}
