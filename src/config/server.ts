import 'reflect-metadata';

import { env } from '../env';
import { apm } from './apm';
import { app } from './app';
import './scheduler';

app.addHook('onRequest', (request, reply, done) => {
  if (request.url === '/healthcheck') {
    return done();
  }

  const transaction = apm.startTransaction(
    `${request.method} ${request.url}`,
    'request'
  );

  if (transaction) {
    transaction.addLabels({ project: 'Hub-Ecommerce' });
    (request as any).apmTransaction = transaction;
  }

  done();
});

app.addHook('onResponse', (request, reply, done) => {
  const transaction = (request as any).apmTransaction;

  if (transaction) {
    transaction.setResult(reply.statusCode.toString());
    transaction.end();
  }

  done();
});

app
  .listen({
    host: '0.0.0.0',
    port: env.APP_PORT,
  })
  .then(() => {
    console.log(`Server is Running on port ${env.APP_PORT}`);
  });
