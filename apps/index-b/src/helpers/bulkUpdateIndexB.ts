import { ProductData } from '@product-backend/types';
import { createFsKv } from '@product-backend/clients/fsKv';
import { productDataToIndexBData } from './productDataToIndexBData';

export async function bulkUpdateIndexB(productDataList: ProductData[]) {
  console.info(
    '[Index B] Indexed',
    productDataList.map(productDataToIndexBData)
  );

  for (const productData of productDataList) {
    const indexAData = productDataToIndexBData(productData);

    // mimic storing in an index
    const fsKv = createFsKv();
    const kv = await fsKv.connect({
      url: 'INDEX_B',
    });

    await kv.set(`PRODUCT_${indexAData.id}`, JSON.stringify(indexAData));
  }
}
