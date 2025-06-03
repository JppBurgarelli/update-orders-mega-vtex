import axios from 'axios';
import * as fs from 'fs';

import { AppDataSource } from '../db';
import { env } from '../env';

export class OrderService {
  private readonly endDate = '2025-05-31T23:59:59.999Z';
  private readonly logFilePath = './logs/order-service.log';
  private readonly startDate = '2025-05-16T00:00:00.000Z';
  private readonly vtexAppKey = env.VTEX_KEY;
  private readonly vtexAuthToken = env.VTEX_TOKEN;
  private readonly vtexBaseUrl = env.VTEX_URL;

  async updateSellerIds(): Promise<void> {
    try {
      const vtexOrders = await this.getOrdersFromVtex();
      const filteredOrders = vtexOrders.filter(
        (order) => order.salesChannel === '5'
      );

      if (filteredOrders.length === 0) {
        const message = 'No orders with salesChannel 5 found.';
        console.log(message);
        this.logMessage(message);
        return;
      }

      const processingMessage = `Processing ${filteredOrders.length} orders with salesChannel 5`;
      console.log(processingMessage);
      this.logMessage(processingMessage);

      for (const order of filteredOrders) {
        const sellerId = await this.getSellerIdFromVtex(order.orderId);
        await this.updateOrderInDatabase(order.orderId, sellerId);
      }

      const successMessage = 'All orders processed successfully';
      console.log(successMessage);
      this.logMessage(successMessage);
    } catch (error) {
      const errorMessage = `Error in updateSellerIds: ${error.message}`;
      console.error(errorMessage);
      this.logMessage(errorMessage);
      throw error;
    }
  }

  private async getOrdersFromVtex(): Promise<any[]> {
    const response = await axios.get(`${this.vtexBaseUrl}/api/oms/pvt/orders`, {
      headers: {
        'X-VTEX-API-AppKey': this.vtexAppKey,
        'X-VTEX-API-AppToken': this.vtexAuthToken,
      },
      params: {
        f_creationDate: `invoicedDate:[${this.startDate} TO ${this.endDate}]`,
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
    return openTextField && openTextField.value ? openTextField.value : '15602';
  }

  private logMessage(message: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;

    fs.appendFileSync(this.logFilePath, logEntry, 'utf8');
  }

  private async updateOrderInDatabase(
    orderId: string,
    openTextFieldValue: string
  ): Promise<void> {
    const query = `UPDATE t_orcamento
      SET IDVENDEDOR = :1
      WHERE PEDIDOECOMMERCE = :2`;

    try {
      await AppDataSource.query(query, [openTextFieldValue, orderId]);
      const successMessage = `Order ${orderId} updated with openTextField value: ${openTextFieldValue}`;
      console.log(successMessage);
      this.logMessage(successMessage);
    } catch (error) {
      const errorMessage = `Error updating order ${orderId}: ${error.message}`;
      console.error(errorMessage);
      this.logMessage(errorMessage);
    }
  }
}
