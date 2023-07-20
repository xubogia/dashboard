import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2';
// @ts-ignore
import fs from 'fs-extra';

const dbConnection = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'abiu',
  password: '8818637',
  database: 'huihe',
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(111);
  if (req.method === 'POST') {
    const { ids } = req.body;

    if (!ids || ids.length === 0) {
      return res.status(400).json({ error: 'Product IDs are required' });
    }

    ids.forEach((id: string) => {
      const folderPath = `./public/product/${id}`;
      fs.remove(folderPath)
        .then(() => {
          console.log(`Folder ${folderPath} deleted successfully`);
        })
        .catch((error: any) => {
          console.error('Error deleting folder:', error);
          return res.status(500).json({ error: 'Error deleting products' });
        });
    });

    dbConnection.getConnection((err, connection) => {
      if (err) {
        console.error('Error connecting to database:', err);
        return res.status(500).json({ error: 'Error connecting to database' });
      }

      // 删除数据库中的产品数据
      connection.query('DELETE FROM products WHERE id IN (?)', [ids], (error, results) => {
        connection.release(); // 释放连接

        if (error) {
          console.error('Error deleting products:', error);
          return res.status(500).json({ error: 'Error deleting products', results });
        }

        res.status(200).json({ message: 'Products deleted successfully' });
      });
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
