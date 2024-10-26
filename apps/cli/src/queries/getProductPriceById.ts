import { DbClientConnection, ProductData } from '@product-backend/types';

export async function getProductPriceById(
  db: DbClientConnection,
  productId: number
) {
  const productData = (await db.query(
    `SELECT price WHERE id = ${productId}`
  )) as ProductData;

  return { id: productData.id, price: productData.price };
}
