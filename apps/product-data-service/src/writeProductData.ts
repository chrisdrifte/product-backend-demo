import { ProductData } from '@product-backend/types';
import { createLocalKv } from '@product-backend/clients/localKv';

export async function writeProductData(productData: ProductData) {
  // mimic data storage with local kv
  const localKv = createLocalKv();

  const kv = await localKv.connect({
    url: 'PDS',
  });

  const productKey = `PRODUCT_${productData.id}`;

  await kv.set(productKey, JSON.stringify(productData));
}
