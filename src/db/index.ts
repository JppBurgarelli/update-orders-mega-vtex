import { DataSource } from 'typeorm';

import { env } from '../env';

export const AppDataSource = new DataSource({
  host: env.ORACLE_DB_HOST,
  logging: true,
  password: env.ORACLE_DB_PASSWORD,
  port: 1521,
  serviceName: env.ORACLE_DB_SERVICE_NAME,
  thickMode: true,
  type: 'oracle',
  username: env.ORACLE_DB_NAME,
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data-base is running! ');
  })
  .catch((err) => console.log(`Erro: ${err}`));
