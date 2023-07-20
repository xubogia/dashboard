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
  console.log('Getting sliders');

  dbConnection.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Error connecting to database' });
    }

    // 查询数据库中的产品数据
    connection.query('SELECT * FROM introduction', (error, results: any[]) => {
      // 释放连接
      connection.release();

      if (error) {
        console.error('Error executing query:', error);
        return res.status(500).json({ error: 'Error executing query' });
      }

      return res.status(200).json(results[0]);
    });
  });
}
