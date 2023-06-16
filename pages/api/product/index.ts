import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2';

interface Product {
  image: string[];
  title: string;
  id: number;
  category: string;
  price: number;
  status: string;
}

const dbConnection = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'abiu',
  password: '8818637',
  database: 'huihe',
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Getting products');

  dbConnection.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Error connecting to database' });
    }

    // 查询数据库中的产品数据
    connection.query('SELECT * FROM products', (error, results: Product[]) => {
      // 释放连接
      connection.release();

      if (error) {
        console.error('Error executing query:', error);
        return res.status(500).json({ error: 'Error executing query' });
      }

      // 将产品数据发送回客户端
      console.log(Array.isArray(results[0].image));
      return res.status(200).json(results);
    });
  });
}
