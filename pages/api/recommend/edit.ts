import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2';

const dbConnection = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'abiu',
  password: '8818637',
  database: 'huihe',
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const productsRecommendChange: any[] = req.body;

    if (productsRecommendChange.length === 0) {
      return res.status(400).json({ error: 'Product IDs are required' });
    }

    const updatePromises = productsRecommendChange.map(
      (product) =>
        new Promise<void>((resolve, reject) => {
          // 添加 void 类型
          dbConnection.getConnection((err, connection) => {
            if (err) {
              console.error('Error connecting to database:', err);
              // eslint-disable-next-line prefer-promise-reject-errors
              reject('Error connecting to database');
              return;
            }

            connection.query(
              'UPDATE products SET `recommend`=? WHERE id=?',
              [product.newRecommend, product.id],
              (error) => {
                connection.release();

                if (error) {
                  console.error('Error updating product:', error);
                  // eslint-disable-next-line prefer-promise-reject-errors
                  reject(`Error updating product with ID ${product.id}`);
                  return;
                }

                resolve(); // 传递 void
              }
            );
          });
        })
    );

    Promise.all(updatePromises)
      .then(() => {
        res.status(200).json({ message: 'Products updated successfully' });
      })
      .catch((error) => res.status(500).json({ error }));
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
