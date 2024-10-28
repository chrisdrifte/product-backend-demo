import { createFsKv } from '@product-backend/clients/fsKv';

export async function readProductData(id: number) {
  // mimic data storage with local kv
  const fsKv = createFsKv();

  const kv = await fsKv.connect({
    url: 'PDS',
  });

  const productKey = `PRODUCT_${id}`;

  const storedProductData = await kv.get(productKey);

  const productData = storedProductData && JSON.parse(storedProductData);

  return productData;
}
