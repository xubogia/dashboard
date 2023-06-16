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
   const ids=req.body.ids;
    console.log(ids);
    const updateStatus = () => {
      const promises = ids.map((id:number) => {
        return new Promise((resolve, reject) => {
          dbConnection.query(
            'UPDATE products SET `status` = ? WHERE id = ?',
            ['已上架', id],
            (error, results) => {
              if (error) {
                reject(error);
              } else {
                resolve(results);
              }
            }
          );
        });
      });

      return Promise.all(promises);
    };



    updateStatus()
      .then(() => {
        res.status(200).json({ message: 'Products updated successfully' });
      })
      .catch((error) => {
        console.error('Error updating products:', error);
        res.status(500).json({ error: 'Error updating products' });
      });


  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

