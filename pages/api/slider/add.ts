import { NextApiRequest, NextApiResponse } from 'next';
// @ts-ignore
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

function renameFile(oldPath: string, newPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      fs.renameSync(oldPath, newPath);
    } catch (err) {
      reject(err);
    }
    resolve();
  });
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();
    form.multiples = true;

    form.parse(req, async (err: any, files: any) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'File upload failed' });
      }

      const uploadedFiles = Object.values(files) as formidable.File[];

      if (uploadedFiles.length === 0) {
        console.log('no files upload');
        return res.status(400).json({ error: 'No files uploaded' });
      }

      try {
        const allImagesCount = uploadedFiles.length;
        console.log('all', allImagesCount);

        const newProduct: any[] = [];
        for (let i = 0; i < allImagesCount; i++) {
          const file = uploadedFiles[i];
          const filePath = file.filepath;
          const currentDate = new Date();
          const year = currentDate.getFullYear();
          const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
          const day = currentDate.getDate().toString().padStart(2, '0');
          const hours = currentDate.getHours().toString().padStart(2, '0');
          const minutes = currentDate.getMinutes().toString().padStart(2, '0');
          const seconds = currentDate.getSeconds().toString().padStart(2, '0');
          const id = year + month + day + hours + minutes + seconds;
          const targetDirectory = `./public/slider/${id}`;

          fs.mkdirSync(targetDirectory, { recursive: true });

          const targetPath = `${targetDirectory}/${file.originalFilename}`;

          // eslint-disable-next-line no-await-in-loop
          await renameFile(filePath, targetPath);

          console.log(targetPath);
          console.log(filePath);
          const imageUrl = targetPath.replace('./public', '');
          newProduct.push([id, imageUrl]);
        }

        console.log(newProduct);

        // eslint-disable-next-line @typescript-eslint/no-shadow
        dbConnection.getConnection((err: NodeJS.ErrnoException | null, connection) => {
          if (err) {
            console.error('Error connecting to database:', err);
            return res.status(500).json({ error: 'Error connecting to database' });
          }

          // 查询数据库中的产品数据
          connection.query('INSERT INTO slider (id, image) VALUES ?', [newProduct], (error) => {
            connection.release(); // 释放连接

            if (error) {
              console.error('Error inserting data:', error);
              return res.status(500).json({ error: 'Error inserting data into database' });
            }

            res.status(200).json({ message: 'Product added successfully' });
          });
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
