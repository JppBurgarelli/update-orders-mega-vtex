import { AppDataSource } from '../db';

export type productInfo = {
  BRAND: string;
  COST_PRICE: number;
  DISCOUNT_PRICE: number;
  EAN: string;
  FIRST_SALE_PRICE: number;
  PRODUCT_COLOR: string;
  PRODUCT_IMAGE: Buffer;
  PRODUCT_NAME: string;
  PRODUCT_REFERENCE: string;
  PRODUCT_SIZE: string;
  ROWNUM_ALIAS: number;
  SALE_PRICE: number;
  SKU: number;
  STOCK: number;
};

const query: string = `
                      SELECT
                        tp.IDPRODUTO,
                        te.CODIGOBARRA,
                        tp.EAN	
                      FROM
                        T_ESTOQUE te
                      INNER JOIN T_PRODUTO tp ON
                        tp.IDPRODUTO = te.IDPRODUTO
                      WHERE
                        ROWNUM = 1
                        AND te.IDESTABELECIMENTO = :idEstabelecimento  
                        AND (te.CODIGOBARRA	IS NOT NULL OR tp.EAN IS NOT NULL)
                    `;

export class ServiceExample {
  async execute(idEstabelecimento: string): Promise<productInfo[]> {
    try {
      const products = await AppDataSource.query(query, [idEstabelecimento]);

      return products;
    } catch (error) {
      console.error('Error getting product by estabelecimento [Mega]:', error);
      throw error;
    }
  }
}
