import { ProductData } from '@product-backend/types';
import { createFsKv } from '@product-backend/clients/fsKv';
import { productDataToIndexAData } from './productDataToIndexAData';

export async function updateIndexA(productData: ProductData) {
  const indexAData = productDataToIndexAData(productData);

  console.info('[Index A] Indexed', indexAData);

  // mimic storing in an index
  const fsKv = createFsKv();
  const kv = await fsKv.connect({
    url: 'INDEX_A',
  });

  await kv.set(`PRODUCT_${indexAData.id}`, JSON.stringify(indexAData));
}
