import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2';
// @ts-ignore
import formidable from 'formidable';
import fs from 'fs';
import { Simulate } from 'react-dom/test-utils';

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

export const config = {
  api: {
    bodyParser: false,
  },
};
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    console.log(111);
    const form = new formidable.IncomingForm();
    form.multiples = true;

    let id:number;
    let newProduct:Product;
    form.parse(req, async (err:ErrorEvent, fields:NewProduct, files:File[]) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'File upload failed' });
      }
       id=fields.id;
      const title = fields.title as string;
      const category = fields.category as string;
      const amount = parseInt(fields.amount as string, 10);
      const status = fields.status as string;


      let imageUrls = fields.image.split(',') as string[];

      console.log(Array.isArray(imageUrls));
      const uploadedFiles = Object.values(files) as formidable.File[];

      // if (uploadedFiles.length === 0) {
      //   return res.status(400).json({ error: 'No files uploaded' });
      // }
      console.log(uploadedFiles.length);

      try {
        for (const file of uploadedFiles) {
          const filePath = file.filepath;
          const fileName = file.originalFilename;
          const targetPath = `./public/product/${fileName}`;
          console.log(filePath);
          renameFile(filePath, targetPath);
          const imageUrl=targetPath.replace('./public','');

          console.log('imageUrls',imageUrls);
          imageUrls.push(imageUrl);
          console.log('imageUrls',imageUrl);
        }
        newProduct = {
          image: imageUrls,
          title: title,
          category: category,
          amount:  amount,
          status: status,
        };

        console.log(id,newProduct);
        // res.status(200).json({ message: 'add product successfully' });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'File upload failed' });
      }
    });


    dbConnection.getConnection((err, connection) => {
      if (err) {
        console.error('Error connecting to database:', err);
        return res.status(500).json({ error: 'Error connecting to database' });
      }

      // 更新数据库中的产品数据
      connection.query(
        'UPDATE products SET `image` = ?, `title` = ?, `category` = ?, `amount` = ?, `status` = ? WHERE id = ?',
        [ JSON.stringify(newProduct.image), newProduct.title, newProduct.category, newProduct.amount, newProduct.status, id],
        (error, results) => {
          res.status(500).json({error:error,result:results})
        }
      );

    })



    res.status(200).json({ message: 'Product updated successfully' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

function renameFile(oldPath: string, newPath: string): Promise<void> {
  return new Promise((resolve, reject) => {

    try {
      fs.renameSync(oldPath, newPath);
    }catch (error:any){
      reject();
    }

    resolve();
  });
}
