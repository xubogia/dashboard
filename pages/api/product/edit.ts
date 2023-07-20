import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2';
// @ts-ignore
import formidable from 'formidable';
import fs from 'fs';
import { Product, EachDetail } from '../../../interface';

const dbConnection = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'abiu',
  password: '8818637',
  database: 'huihe',
});

interface NewProductForm {
  eachDetail: string;
  title: string;
  id: number;
  category: string;
  amount: string;
  status: string;
  detail: string;
  newImage: any[];
  recommend: string;
  newProductImageCount: string;
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
      reject(error);
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

    form.parse(req, async (err: ErrorEvent, fields: NewProductForm, files: File[]) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'File upload failed' });
      }

      try {
        id = fields.id;

        const { title, category, status, recommend } = fields;
        const newProductImageCountTemp = parseInt(fields.newProductImageCount);
        const eachDetail: EachDetail[] = JSON.parse(fields.eachDetail);
        const detail: string[] = JSON.parse(fields.detail);

        const uploadedFiles = Object.values(files) as formidable.File[];
        const oldProductNum = eachDetail.length - newProductImageCountTemp;
        const newDetailImageNum = uploadedFiles.length - newProductImageCountTemp;
        console.log(uploadedFiles.length);
        console.log(oldProductNum);
        console.log(newDetailImageNum);
        const targetDirectory = `./public/product/${id}`;
        for (let i = 0; i < uploadedFiles.length; i++) {
          const file = uploadedFiles[i];
          const filePath = file.filepath;

          const targetPath = `${targetDirectory}/${file.originalFilename}`;

          // eslint-disable-next-line no-await-in-loop
          await renameFile(filePath, targetPath);
          const imageUrl = targetPath.replace('./public', '');
          if (i < newProductImageCountTemp) {
            eachDetail[oldProductNum + i].image = imageUrl;
            console.log(eachDetail[oldProductNum + i].image);
          } else {
            detail.push(imageUrl);
          }
        }

        newProduct = {
          eachDetail,
          id,
          title,
          category,
          status,
          detail,
          recommend,
        };

        console.log(id, newProduct);
        // eslint-disable-next-line @typescript-eslint/no-shadow
        dbConnection.getConnection((err, connection) => {
          if (err) {
            console.error('Error connecting to database:', err);
            return res.status(500).json({ error: 'Error connecting to database' });
          }

          connection.query(
            'UPDATE products SET `title` = ?, `category` = ?,  `status` = ?,`detail`=?,`eachDetail`= ? WHERE id = ?',
            [
              newProduct.title,
              newProduct.category,
              newProduct.status,
              JSON.stringify(newProduct.detail),
              JSON.stringify(newProduct.eachDetail),
              id,
            ],
            (error) => {
              if (error) {
                console.error('Database update error:', error);
                return res.status(500).json({ error: 'Database update error' });
              }
              res.status(200).json({ message: 'Product updated successfully' });
            }
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
