import * as fs from 'node:fs';
import * as path from 'node:path';

import { KvClient, KvClientConnection } from '@product-backend/types';

const fsKv: KvClient = {
  async connect(options: { url: string }) {
    const dir = path.join(process.cwd(), '.kv', options.url);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const keyToFile = (key: string) => path.join(dir, key + '.txt');

    const connection: KvClientConnection = {
      async set(key: string, value: string) {
        fs.writeFileSync(keyToFile(key), value);
      },

      async get(key: string) {
        const file = keyToFile(key);

        if (!fs.existsSync(file)) {
          return;
        }

        return fs.readFileSync(file).toString() || undefined;
      },

      async delete(key: string) {
        const file = keyToFile(key);

        if (!fs.existsSync(file)) {
          return;
        }

        fs.unlinkSync(file);
      },

      async destroy() {
        fs.readdir(dir, (err, files) => {
          if (err) throw err;

          for (const file of files) {
            fs.unlink(path.join(dir, file), (err) => {
              if (err) throw err;
            });
          }
        });
      },
    };

    return connection;
  },
};

export function createFsKv() {
  return fsKv;
}