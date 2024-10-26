import { createLocalKv } from '@product-backend/clients/localKv';

export async function readProductData(id: number) {
  // mimic data storage with local kv
  const localKv = createLocalKv();

  const kv = await localKv.connect({
    url: 'PDS',
  });

  const productKey = `PRODUCT_${id}`;

  const storedProductData = await kv.get(productKey);

  const productData = storedProductData && JSON.parse(storedProductData);

  return productData;
}
