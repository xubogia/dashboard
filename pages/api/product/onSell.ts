import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2';
import formidable from 'formidable';
import fs from 'fs';
import product from '@/components/product';

const dbConnection = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'abiu',
  password: '8818637',
  database: 'huihe',
});
interface NewProduct {
  newImage:File[];
  image:string;//need split ','
  title: string;
  id: number;
  category: string;
  amount: string;
  status: string;
}

interface Product {
  image:string[];
  title: string;
  category: string;
  amount: number;
  status: string;
}

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    console.log(req.body)
   const ids=req.body.ids;
    console.log(ids);
    const updateStatus = () => {
      const promises = ids.map((id) => {
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



    // dbConnection.getConnection((err, connection) => {
    //   if (err) {
    //     console.error('Error connecting to database:', err);
    //     return res.status(500).json({ error: 'Error connecting to database' });
    //   }
    //
    //   // 更新数据库中的产品数据
    //   connection.query(
    //     'UPDATE products SET `image` = ?, `title` = ?, `category` = ?, `amount` = ?, `status` = ? WHERE id = ?',
    //     [ JSON.stringify(newProduct.image), newProduct.title, newProduct.category, newProduct.amount, newProduct.status, id],
    //     (error, results) => {
    //       // ...
    //     }
    //   );
    //
    // })

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

