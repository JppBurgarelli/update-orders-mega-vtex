/* eslint-disable @typescript-eslint/require-await */
import type { FastifyInstance } from 'fastify';

import * as controllerExample from '../controllers/controller-example';

export const routeExample = async (app: FastifyInstance) => {
  app.post('/RoutePatheExample', controllerExample.controllerMethodExample);
};
