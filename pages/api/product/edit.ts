import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2';
// @ts-ignore
import formidable from 'formidable';
import fs from 'fs';

const dbConnection = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'abiu',
  password: '8818637',
  database: 'huihe',
});


interface EachDetail {
  image:string;
  imageDetail:string;
  size:string[]
}
interface Product {
  eachDetail:EachDetail[];
  title: string;
  id: number;
  category: string;
  amount: number;
  status: string;
  detail: string;
}
interface NewProduct {
  eachDetail: string;
  title: string;
  id: number;
  category: string;
  amount: string;
  status: string;
  detail: string;
  newImage: any[];
}

export const config = {
  api: {
    bodyParser: false,
  },
};

function renameFile(oldPath: string, newPath: string): Promise<void> {
  return new Promise((resolve, reject) => {

    try {
      fs.renameSync(oldPath, newPath);
    } catch (error: any) {
      reject();
    }

    resolve();
  });
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('editing');
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();
    form.multiples = true;

    let id: number;
    let newProduct: Product;

    form.parse(req, async (err: ErrorEvent, fields: NewProduct, files: File[]) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'File upload failed' });
      }

      try {
        id = fields.id;
        const amount = parseInt(fields.amount);

        const { detail, title, category, status } = fields;

        const eachDetail: EachDetail[] = JSON.parse(fields.eachDetail);

        const uploadedFiles = Object.values(files) as formidable.File[];
        const oldProductNum = eachDetail.length - uploadedFiles.length;

        for (let i = 0; i < uploadedFiles.length; i++) {
          const file = uploadedFiles[i];
          const filePath = file.filepath;

          const timestamp = Date.now();
          const fileName = file.originalFilename.split(',').pop();
          const targetPath = `./public/product/${timestamp}.${fileName}`;

          await renameFile(filePath, targetPath);

          const imageUrl = targetPath.replace('./public', '');
          eachDetail[oldProductNum + i].image = imageUrl;
        }

        newProduct = {
          eachDetail,
          id,
          title,
          category,
          amount,
          status,
          detail,
        };

        console.log(id, newProduct);

        // 更新数据库中的产品数据
        dbConnection.getConnection((err, connection) => {
          if (err) {
            console.error('Error connecting to database:', err);
            return res.status(500).json({ error: 'Error connecting to database' });
          }

          connection.query(
            'UPDATE products SET `title` = ?, `category` = ?, `amount` = ?, `status` = ?,`detail`=?,`eachDetail`= ? WHERE id = ?',
            [newProduct.title, newProduct.category, newProduct.amount, newProduct.status, newProduct.detail, JSON.stringify(newProduct.eachDetail), id],
            (error) => {
              if (error) {
                console.error('Database update error:', error);
                return res.status(500).json({ error: 'Database update error' });
              }
              res.status(200).json({ message: 'Product updated successfully' });
            },
          );

          connection.release(); // 释放数据库连接
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'File upload failed' });
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}


