import type { FastifyReply, FastifyRequest } from 'fastify';

import { OrderService } from '../services/order-service';

export const updateSellerIdsController = async (
  _: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const orderService = new OrderService();
    await orderService.updateSellerIds();
    return reply
      .status(200)
      .send({ message: 'Seller IDs updated successfully.' });
  } catch (error) {
    console.error('Error updating seller IDs:', error);
    return reply.status(500).send({ message: 'Internal server error.' });
  }
};
