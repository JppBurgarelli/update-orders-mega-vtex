import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { ServiceExample } from '../services/service-example';

export const controllerMethodExample = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const zodSchema = z.object({
    idEstabelecimento: z.string(),
  });

  try {
    const { idEstabelecimento } = zodSchema.parse(request.body);

    const serviceExample = new ServiceExample();
    await serviceExample.execute(idEstabelecimento);

    return reply
      .status(200)
      .send({ message: 'Products processed successfully' });
  } catch (error) {
    console.error('Error processing products:', error);
    ('Internal error while processing products');
    return reply.status(500).send({});
  }
};
