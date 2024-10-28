import { ProductData } from '@product-backend/types';
import { createFsKv } from '@product-backend/clients/fsKv';

export async function writeProductData(productData: ProductData) {
  // mimic data storage with local kv
  const fsKv = createFsKv();

  const kv = await fsKv.connect({
    url: 'PDS',
  });

  const productKey = `PRODUCT_${productData.id}`;

  await kv.set(productKey, JSON.stringify(productData));
}
