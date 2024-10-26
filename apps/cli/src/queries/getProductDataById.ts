import { DbClientConnection, ProductData } from '@product-backend/types';

import { dbDataToProductData } from '../helpers/dbDataToProductData';

export async function getProductDataById(
  db: DbClientConnection<ProductData>,
  productId: number
) {
  const dbData = await db.query(`SELECT * WHERE id = ${productId}`);

  const productData = dbDataToProductData(dbData);

  return productData;
}
