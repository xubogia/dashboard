import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2';

const dbConnection = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'abiu',
  password: '8818637',
  database: 'huihe',
});

interface NewOrder {
  id: string;
  image: string;
  title: string;
  color: string;
  size: string;
  amount: string;
  status: string;
  name: string;
  phone: string;
  address: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const newOrder: NewOrder = req.body;
    const { id, image, title, color, size, status, name, phone, address, amount } = newOrder;
    if (!image || !title || !color || !size || !amount || !status || !name || !phone || !address)
      return res.status(400).json({ err: 'value required' });

    console.log(newOrder);
    dbConnection.getConnection((err: NodeJS.ErrnoException | null, connection) => {
      if (err) {
        console.error('Error connecting to database:', err);
        return res.status(500).json({ error: 'Error connecting to database' });
      }

      const query = `
        UPDATE orders
        SET image = ?,
            title = ?,
            color = ?,
            size = ?,
            amount = ?,
            status = ?,
            name = ?,
            phone = ?,
            address = ?
        WHERE id = ?
      `;
      const queryParams = [image, title, color, size, amount, status, name, phone, address, id];

      // 输出调试信息
      console.log('SQL Query:', query);
      console.log('Query Params:', queryParams);

      connection.query(query, queryParams, (error, result) => {
        if (error) {
          console.error('Error updating order:', err);
          return res.status(500).json({ error: 'Error updating order' });
        }

        console.log('Order updated:', result);

        // 释放数据库连接
        connection.release();

        res.status(200).json({ message: 'Order updated successfully' });
      });
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
