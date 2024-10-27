import { DbClientConnection, ProductData } from '@product-backend/types';

export async function getProductDescriptionById(
  db: DbClientConnection,
  productId: number
) {
  const productData = (await db.query(
    `SELECT description WHERE id = ${productId}`
  )) as ProductData;

  return { id: productData.id, description: productData.description };
}
