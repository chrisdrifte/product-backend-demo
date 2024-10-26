import {
  DbClient,
  DbClientConnection,
  ProductData,
} from '@product-backend/types';

import { mockData } from './mockData';

const DATASET_SIZE = 3;

const connect = async () => {
  const db: Map<ProductData['id'], ProductData> = new Map(
    mockData.slice(0, DATASET_SIZE).map((data) => [data.id, data])
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
