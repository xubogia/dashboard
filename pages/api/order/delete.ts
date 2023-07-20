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
  console.log(111);
  if (req.method === 'POST') {
    const { ids } = req.body;

    if (!ids || ids.length === 0) {
      return res.status(400).json({ error: 'Order IDs are required' });
    }

    dbConnection.getConnection((err, connection) => {
      if (err) {
        console.error('Error connecting to database:', err);
        return res.status(500).json({ error: 'Error connecting to database' });
      }

      // 删除数据库中的产品数据
      connection.query('DELETE FROM orders WHERE id IN (?)', [ids], (error, results) => {
        connection.release(); // 释放连接

        if (error) {
          console.error('Error deleting products:', error);
          return res.status(500).json({ error: 'Error deleting order', results });
        }

        res.status(200).json({ message: 'Order deleted successfully' });
      });
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
