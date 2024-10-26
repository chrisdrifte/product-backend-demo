import {
  DbClient,
  DbClientConnection,
  ProductData,
} from '@product-backend/types';

import { mockData } from './mockData';

const USE_LARGE_DATASET = true;

const connect = async () => {
  const db: Map<ProductData['id'], ProductData> = new Map(
    (USE_LARGE_DATASET ? mockData : mockData.slice(0, 3)).map((data) => [
      data.id,
      data,
    ])
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const connection: DbClientConnection<any> = {
    async query(query) {
      switch (query) {
        case 'SELECT id':
          return Array.from(db.keys());

        default: {
          const [, id] = query.split(' id = ');
          if (id) {
            return db.get(Number(id));
          }

          throw new Error('Invalid query');
        }
      }
    },

    async destroy() {
      db.clear();
    },
  };

  return connection;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const memDb: DbClient<any> = {
  connect,
};

export function createMemDb() {
  return memDb;
}
