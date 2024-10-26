import { DbClientConnection, ProductData } from '@product-backend/types';

export async function getProductDataById(
  db: DbClientConnection,
  productId: number
) {
  // mimic slow queries
  // await new Promise((resolve) => setTimeout(resolve, 1000));

  const productData = (await db.query(
    `SELECT * WHERE id = ${productId}`
  )) as ProductData;

  return productData;
}
