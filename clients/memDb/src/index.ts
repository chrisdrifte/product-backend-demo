import {
  DbClient,
  DbClientConnection,
  ProductData,
} from '@product-backend/types';

const db: Map<ProductData['id'], ProductData> = new Map([
  [
    1,
    {
      id: 1,
      name: 'Apple',
      description: 'Avoid pesky doctors',
      price: 1000,
    },
  ],
  [
    2,
    {
      id: 2,
      name: 'Orange',
      description: "Orange you glad I didn't say banana?",
      price: 800,
    },
  ],
  [
    3,
    {
      id: 3,
      name: 'Pear',
      description: 'Minimum two per purchase',
      price: 1200,
    },
  ],
]);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const connection: DbClientConnection<any> = {
  query: async (query) => {
    switch (query) {
      case 'SELECT id':
        return Array.from(db.keys());

      case 'SELECT * WHERE id = 1':
        return db.get(1);

      case 'SELECT * WHERE id = 2':
        return db.get(2);

      case 'SELECT * WHERE id = 3':
        return db.get(3);

      default:
        throw new Error('Invalid query');
    }
  },
};

const connect = async () => {
  return connection;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const memDb: DbClient<any> = {
  connect,
};

export function createMemDb() {
  return memDb;
}
