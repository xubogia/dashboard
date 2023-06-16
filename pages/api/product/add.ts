import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import mysql from 'mysql2';


const dbConnection = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'abiu',
  password: '8818637',
  database: 'huihe',
});
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


    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'File upload failed' });
      }

      const title = fields.title as string;
      const category = fields.category as string;
      const amount = parseInt(fields.amount as string, 10);
      const status = fields.status as string;
      const imageDetail=fields.imageDetail.split(',');
      const detail=fields.detail;

      let imageUrls=[];
      const uploadedFiles = Object.values(files) as formidable.File[];

      if (uploadedFiles.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }
      console.log(uploadedFiles.length);

      try {
        let count=0
        for (const file of uploadedFiles) {
          const filePath = file.filepath;
          const fileName = file.originalFilename;
          const targetPath = `./public/product/${fileName}`;
          console.log(filePath);
          renameFile(filePath, targetPath);
          const imageUrl=targetPath.replace('./public','')
          imageUrls.push(imageUrl);
        }
        const product = {
          image: imageUrls,
          title: title,
          category: category,
          amount:  amount,
          status: status,
          imageDetail:imageDetail,
          detail: detail,
        };
        console.log(product);
        dbConnection.getConnection((err, connection) => {
          if (err) {
            console.error('Error connecting to database:', err);
            return res.status(500).json({ error: 'Error connecting to database' });
          }

          // 查询数据库中的产品数据
          connection.query('INSERT INTO products (image, title, category, amount, status,imageDetail,detail) VALUES (?, ?, ?, ?, ?, ?, ?)', [
            JSON.stringify(product.image),
            product.title,
            product.category,
            product.amount,
            product.status,
            JSON.stringify(product.imageDetail),
            product.detail,
          ])
        });

        res.status(200).json({ message: 'add product successfully' });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'File upload failed' });
      }
    });

  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

function renameFile(oldPath: string, newPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.renameSync(oldPath, newPath);
  });
}


