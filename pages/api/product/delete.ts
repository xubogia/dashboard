import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2';

const dbConnection = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'abiu',
  password: '8818637',
  database: 'huihe',
});

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(111);
  if (req.method === 'POST') {
    const ids = req.body.ids;
    console.log(ids.length);

    if (!ids || ids.length === 0) {
      return res.status(400).json({ error: 'Product IDs are required' });
    }

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
          return res.status(500).json({ error: 'Error deleting products' });
        }

        res.status(200).json({ message: 'Products deleted successfully' });
      });
    }
    );
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
