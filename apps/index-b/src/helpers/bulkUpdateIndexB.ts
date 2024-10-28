import { ProductData } from '@product-backend/types';
import { createFsKv } from '@product-backend/clients/fsKv';
import { productDataToIndexBData } from './productDataToIndexBData';

export async function bulkUpdateIndexB(productDataList: ProductData[]) {
  const indexBDataList = productDataList.map(productDataToIndexBData);

  console.info('[Index B] Indexed', indexBDataList);

  for (const indexBData of indexBDataList) {
    // mimic storing in an index
    const fsKv = createFsKv();
    const kv = await fsKv.connect({
      url: 'INDEX_B',
    });

    await kv.set(`PRODUCT_${indexBData.id}`, JSON.stringify(indexBData));
  }
}
