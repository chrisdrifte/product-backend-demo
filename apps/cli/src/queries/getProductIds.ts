import { DbClientConnection } from '@product-backend/types';

type ProductId = number;

export async function getProductIds(db: DbClientConnection<ProductId[]>) {
  const productIds = (await db.query('SELECT id')) as ProductId[];

  return productIds;
}
