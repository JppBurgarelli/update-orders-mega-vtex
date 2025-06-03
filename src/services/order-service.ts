import axios from 'axios';

import { AppDataSource } from '../db';
import { env } from '../env';

export class OrderService {
  private readonly endDate = '2025-05-31T23:59:59.999Z';
  private readonly startDate = '2025-05-16T00:00:00.000Z';
  private readonly vtexAppKey = env.VTEX_KEY;

  private readonly vtexAuthToken = env.VTEX_TOKEN;
  private readonly vtexBaseUrl = env.VTEX_URL;

  async updateSellerIds(): Promise<void> {
    try {
      const vtexOrders = await this.getOrdersFromVtex();
      const filteredOrderIds = vtexOrders
        .filter((order) => order.salesChannel === '5')
        .map((order) => order.orderId);

      if (filteredOrderIds.length === 0) {
        console.log('No orders with salesChannel 5 found.');
        return;
      }

      const existingOrderIds =
        await this.getExistingOrderIdsFromDatabase(filteredOrderIds);

      for (const orderId of existingOrderIds) {
        const sellerId = await this.getSellerIdFromVtex(orderId);
        await this.updateOrderInDatabase(orderId, sellerId);
      }
    } catch (error) {
      console.error('Error in updateSellerIds:', error);
      throw error;
    }
  }

  private async getExistingOrderIdsFromDatabase(
    orderIds: string[]
  ): Promise<string[]> {
    const result = await AppDataSource.createQueryBuilder()
      .select('PEDIDOECOMMERCE')
      .from('T_ORCAMENTO', 't')
      .where('PEDIDOECOMMERCE IN (:...orderIds)', { orderIds })
      .andWhere('integrador LIKE :integrador', { integrador: '%VTEX%' })
      .getRawMany();

    return result.map((row: any) => row.PEDIDOECOMMERCE);
  }

  private async getOrdersFromVtex(): Promise<any[]> {
    const response = await axios.get(`${this.vtexBaseUrl}/api/oms/pvt/orders`, {
      headers: {
        'X-VTEX-API-AppKey': this.vtexAppKey,
        'X-VTEX-API-AppToken': this.vtexAuthToken,
      },
      params: {
        f_invoicedDate: `invoicedDate:[${this.startDate} TO ${this.endDate}]`,
      },
    });

    return response.data.list || [];
  }

  private async getSellerIdFromVtex(orderId: string): Promise<string> {
    const url = `${this.vtexBaseUrl}/api/oms/pvt/orders/${orderId}`;

    const response = await axios.get(url, {
      headers: {
        'X-VTEX-API-AppKey': this.vtexAppKey,
        'X-VTEX-API-AppToken': this.vtexAuthToken,
      },
    });

    const openTextField = response.data.openTextField;
    return openTextField && openTextField.value ? openTextField.value : 'XXXX';
  }

  private async updateOrderInDatabase(
    orderId: string,
    openTextFieldValue: string
  ): Promise<void> {
    const query = `
      UPDATE t_orcamento
      SET PEDIDOECOMMERCE = ?
      WHERE PEDIDOECOMMERCE = ?
    `;

    try {
      await AppDataSource.query(query, [openTextFieldValue, orderId]);
      console.log(
        `Order ${orderId} updated with openTextField value: ${openTextFieldValue}`
      );
    } catch (error) {
      console.error(`Error updating order ${orderId}:`, error);
    }
  }
}
