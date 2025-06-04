import axios from 'axios';
import * as fs from 'fs';

import { AppDataSource } from '../db';
import { env } from '../env';

export class OrderService {
  private readonly logFilePath = './logs/order-service.log';

  private readonly mockOrdersData = [
    { orderId: '1535980579175-01', sellerId: '94475' },
    { orderId: '1535950579058-01', sellerId: '98112' },
    { orderId: '1536160579503-01', sellerId: '98923' },
    { orderId: '1535730578614-01', sellerId: '103220' },
    { orderId: '1536160579488-01', sellerId: '70242' },
    { orderId: '1535960579116-01', sellerId: '102162' },
    { orderId: '1536170579539-01', sellerId: '103268' },
    { orderId: '1535950579056-01', sellerId: '102705' },
    { orderId: '1535470578079-01', sellerId: '102926' },
    { orderId: '1535920578960-01', sellerId: '98262' },
    { orderId: '1535710578512-01', sellerId: '101618' },
    { orderId: '1535970579139-01', sellerId: '94638' },
    { orderId: '1535890578867-01', sellerId: '98423' },
    { orderId: '1536180579546-01', sellerId: '28101' },
    { orderId: '1535770578743-01', sellerId: '99788' },
    { orderId: '1536190579568-01', sellerId: '95691' },
    { orderId: '1535750578693-01', sellerId: '102667' },
    { orderId: '1535760578708-01', sellerId: '76468' },
    { orderId: '1535640578328-01', sellerId: '37280' },
    { orderId: '1536000579233-01', sellerId: '103220' },
    { orderId: '1535900578887-01', sellerId: '43428' },
    { orderId: '1535700578472-01', sellerId: '79911' },
    { orderId: '1535990579205-01', sellerId: '15602' },
    { orderId: '1536150579425-01', sellerId: '15602' },
    { orderId: '1535900578890-01', sellerId: '90041' },
    { orderId: '1536160579460-01', sellerId: '72845' },
    { orderId: '1536150579443-01', sellerId: '103080' },
    { orderId: '1535680578412-01', sellerId: '45721' },
    { orderId: '1535970579144-01', sellerId: '44901' },
    { orderId: '1535890578864-01', sellerId: '45961' },
    { orderId: '1535740578658-01', sellerId: '98923' },
    { orderId: '1535710578506-01', sellerId: '83873' },
    { orderId: '1536150579432-01', sellerId: '61280' },
    { orderId: '1535700578482-01', sellerId: '101062' },
    { orderId: '1535730578590-01', sellerId: '66241' },
    { orderId: '1535960579136-01', sellerId: '103148' },
    { orderId: '1535720578558-01', sellerId: '103339' },
    { orderId: '1535740578661-01', sellerId: '103268' },
    { orderId: '1535900578885-01', sellerId: '45623' },
    { orderId: '1535910578916-01', sellerId: '48641' },
    { orderId: '1535910578927-01', sellerId: '15602' },
    { orderId: '1535710578528-01', sellerId: '82448' },
    { orderId: '1535710578506-02', sellerId: '83873' },
    { orderId: '1535890578860-01', sellerId: '85506' },
    { orderId: '1535410577915-01', sellerId: '88870' },
    { orderId: '1535450578039-01', sellerId: '63760' },
    { orderId: '1535930579022-01', sellerId: '37280' },
    { orderId: '1535920578965-01', sellerId: '102785' },
    { orderId: '1535900578895-01', sellerId: '85506' },
    { orderId: '1535480578109-01', sellerId: '100945' },
    { orderId: '1535740578641-01', sellerId: '99788' },
    { orderId: '1535900578896-01', sellerId: '43428' },
    { orderId: '1535920578975-01', sellerId: '97921' },
    { orderId: '1535970579153-01', sellerId: '99486' },
    { orderId: '1535730578614-02', sellerId: '103220' },
    { orderId: '1535690578446-01', sellerId: '95436' },
    { orderId: '1535770578743-02', sellerId: '99788' },
    { orderId: '1535880578836-01', sellerId: '45071' },
    { orderId: '1535470578092-01', sellerId: '102245' },
    { orderId: '1535900578912-01', sellerId: '103096' },
    { orderId: '1535480578135-01', sellerId: '98441' },
    { orderId: '1535740578658-02', sellerId: '98923' },
    { orderId: '1535730578607-01', sellerId: '100341' },
    { orderId: '1535670578383-01', sellerId: '99486' },
    { orderId: '1535920578968-01', sellerId: '97821' },
    { orderId: '1535930579027-02', sellerId: '37280' },
    { orderId: '1535260577718-01', sellerId: '63760' },
    { orderId: '1535890578852-01', sellerId: '68276' },
    { orderId: '1535240577633-01', sellerId: '89615' },
    { orderId: '1535400577905-01', sellerId: '38220' },
    { orderId: '1535940579037-01', sellerId: '94641' },
    { orderId: '1535720578565-01', sellerId: '1731' },
    { orderId: '1535460578056-01', sellerId: '92952' },
    { orderId: '1535930579014-01', sellerId: '91251' },
    { orderId: '1535890578857-01', sellerId: '102663' },
    { orderId: '1535460578054-01', sellerId: '91233' },
    { orderId: '1535710578505-01', sellerId: '46360' },
    { orderId: '1535920578986-01', sellerId: '103302' },
    { orderId: '1535740578638-01', sellerId: '99788' },
    { orderId: '1535910578942-01', sellerId: '99061' },
    { orderId: '1535910578953-01', sellerId: '103096' },
    { orderId: '1535710578497-01', sellerId: '45721' },
    { orderId: '1535460578049-01', sellerId: '103080' },
    { orderId: '1535670578392-01', sellerId: '66104' },
    { orderId: '1535680578425-01', sellerId: '1731' },
    { orderId: '1534490576333-01', sellerId: '101026' },
    { orderId: '1535190577499-01', sellerId: '44703' },
    { orderId: '1535710578490-01', sellerId: '80532' },
    { orderId: '1535660578362-01', sellerId: '91757' },
    { orderId: '1535650578332-01', sellerId: '89465' },
    { orderId: '1535450578037-01', sellerId: '95370' },
    { orderId: '1535540578238-01', sellerId: '103028' },
    { orderId: '1535680578412-02', sellerId: '45721' },
    { orderId: '1535240577679-01', sellerId: '91437' },
    { orderId: '1535440578003-01', sellerId: '27726' },
    { orderId: '1535670578382-01', sellerId: '66104' },
    { orderId: '1535700578474-01', sellerId: '97529' },
    { orderId: '1535230577623-01', sellerId: '15602' },
    { orderId: '1535650578336-01', sellerId: '78968' },
    { orderId: '1535210577582-01', sellerId: '103148' },
  ];

  public getMockDataSummary(): void {
    console.log(`Total mock orders: ${this.mockOrdersData.length}`);

    const uniqueSellers = new Set(
      this.mockOrdersData.map((order) => order.sellerId)
    );
    console.log(`Unique sellers: ${uniqueSellers.size}`);

    console.log('First 5 orders:');
    this.mockOrdersData.slice(0, 5).forEach((order) => {
      console.log(`  ${order.orderId} -> Seller: ${order.sellerId}`);
    });
  }

  async updateSellerIds(): Promise<void> {
    try {
      const processingMessage = `Processing ${this.mockOrdersData.length} mock orders`;
      console.log(processingMessage);
      this.logMessage(processingMessage);

      let processedCount = 0;
      let successCount = 0;
      let errorCount = 0;

      for (const orderData of this.mockOrdersData) {
        try {
          await this.updateOrderInDatabase(
            orderData.orderId,
            orderData.sellerId
          );
          successCount++;
        } catch (error) {
          errorCount++;
          const errorMessage = `Error processing order ${orderData.orderId}: ${error.message}`;
          console.error(errorMessage);
          this.logMessage(errorMessage);
        }
        processedCount++;

        if (processedCount % 10 === 0) {
          const progressMessage = `Progress: ${processedCount}/${this.mockOrdersData.length} orders processed`;
          console.log(progressMessage);
          this.logMessage(progressMessage);
        }
      }

      const summaryMessage = `Processing completed. Total: ${processedCount}, Success: ${successCount}, Errors: ${errorCount}`;
      console.log(summaryMessage);
      this.logMessage(summaryMessage);
    } catch (error) {
      const errorMessage = `Error in updateSellerIds: ${error.message}`;
      console.error(errorMessage);
      this.logMessage(errorMessage);
      throw error;
    }
  }

  private logMessage(message: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;

    const logDir = './logs';
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    fs.appendFileSync(this.logFilePath, logEntry, 'utf8');
  }

  private async updateOrderInDatabase(
    orderId: string,
    sellerId: string
  ): Promise<void> {
    const query = `UPDATE t_orcamento
      SET IDVENDEDOR = :1
      WHERE PEDIDOECOMMERCE = :2`;

    try {
      await AppDataSource.query(query, [sellerId, orderId]);
      const successMessage = `Order ${orderId} updated with seller ID: ${sellerId}`;
      console.log(successMessage);
      this.logMessage(successMessage);
    } catch (error) {
      const errorMessage = `Error updating order ${orderId}: ${error.message}`;
      console.error(errorMessage);
      this.logMessage(errorMessage);
      throw error;
    }
  }
}
