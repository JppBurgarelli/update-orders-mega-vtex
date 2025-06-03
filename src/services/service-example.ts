import { AppDataSource } from '../db';

const query: string = `
  SELECT * FROM T_ORCAMENTO
  WHERE ROWNUM <= 10
`;

export class ServiceExample {
  async execute(): Promise<any[]> {
    try {
      const products = await AppDataSource.query(query);
      return products;
    } catch (error) {
      console.error('Error getting products [Mega]:', error);
      throw error;
    }
  }
}
