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
  console.log('deleting category');
  if (req.method === 'POST') {
    const { category } = req.body;
    console.log(category);

    dbConnection.getConnection((err, connection) => {
      if (err) {
        console.error('Error connecting to database:', err);
        return res.status(500).json({ error: 'Error connecting to database' });
      }

      connection.query('DELETE FROM category WHERE categoryName = ?', [category], (error, results) => {
        connection.release(); // 释放数据库连接

        if (error) {
          console.error('Error executing query:', error);
          return res.status(500).json({ error: 'Error executing query' });
        }

        // 根据需要处理查询结果
        console.log('Deleted category:', results);

        res.status(200).json({ message: 'Category deleted successfully' });
      });
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
