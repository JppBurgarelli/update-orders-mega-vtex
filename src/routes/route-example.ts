/* eslint-disable @typescript-eslint/require-await */
import type { FastifyInstance } from 'fastify';

import { controllerMethodExample } from '../controllers/controller-example';
import { updateSellerIdsController } from '../controllers/orders-controller';

export const ordersRoute = async (app: FastifyInstance) => {
  app.get('/updateOrders', updateSellerIdsController);
  app.get('/RoutePatheExample', controllerMethodExample);
};
