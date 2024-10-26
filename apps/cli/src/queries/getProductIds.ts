import { DbClientConnection } from '@product-backend/types';

type ProductId = number;

export async function getProductIds(db: DbClientConnection<ProductId[]>) {
  const productIds: ProductId[] = await db.query('SELECT id');

  return productIds;
}
