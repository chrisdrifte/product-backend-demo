import { DbClientConnection, ProductData } from '@product-backend/types';

export async function getProductDataById(
  db: DbClientConnection,
  productId: number
) {
  const productData = (await db.query(
    `SELECT * WHERE id = ${productId}`
  )) as ProductData;

  return productData;
}
