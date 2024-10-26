import { ProductData } from '@product-backend/types';
import { createLocalKv } from '@product-backend/clients/localKv';
import { productDataToIndexAData } from './productDataToIndexAData';

export async function updateIndexA(productData: ProductData) {
  const indexAData = productDataToIndexAData(productData);

  console.info('[Index A] Indexed', indexAData);

  // mimic storing in an index
  const localKv = createLocalKv();
  const kv = await localKv.connect({
    url: 'INDEX_A',
  });

  await kv.set(`PRODUCT_${indexAData.id}`, JSON.stringify(indexAData));
}
