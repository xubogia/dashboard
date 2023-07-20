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

interface Order {
  image: string;
  title: string;
  color: string;
  size: string;
  amount: number;
  status: string;
  name: string;
  phone: string;
  address: string;
  time: string;
  count: number;
}

interface NewOrder {
  title: string;
  color: string;
  size: string;
  amount: string;
  status: string;
  name: string;
  phone: string;
  address: string;
  image?: string;
  count: number;
}

function renameFile(oldPath: string, newPath: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        console.error('Error renaming file:', err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();
    form.multiples = true;

    let newOrder: Order;
    form.parse(req, async (err: any, fields: NewOrder, files: any) => {
      if (err) {
        console.error('Error parsing form:', err);
        return res.status(500).json({ error: 'File upload failed' });
      }

      const amount = parseFloat(fields.amount);
      const { title, color, size, status, name, phone, address, count } = fields;

      if (
        !title ||
        !color ||
        !size ||
        !amount ||
        !status ||
        !name ||
        !phone ||
        !address ||
        !count
      ) {
        return res.status(400).json({ err: 'value required' });
      }

      let imageUrl: string | undefined = fields.image;
      const uploadedFiles = Object.values(files) as formidable.File[];

      if (uploadedFiles.length === 0 && !imageUrl) {
        console.log('no files uploaded');
        return res.status(400).json({ error: 'No image uploaded' });
      }

      if (uploadedFiles.length !== 0) {
        const file = uploadedFiles[0];
        const filePath = file.filepath;
        const timestamp = Date.now();
        const fileName = file.name.split('.').pop();
        const targetPath = `./public/order/${timestamp}.${fileName}`;

        try {
          await renameFile(filePath, targetPath);
          imageUrl = targetPath.replace('./public', '');
          console.log('imageUrl', imageUrl);
        } catch (error) {
          console.error('Error renaming file:', error);
          return res.status(500).json({ error: 'File upload failed' });
        }
      }

      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const day = currentDate.getDate().toString().padStart(2, '0');
      const time = `${year}-${month}-${day}`;

      if (imageUrl) {
        newOrder = {
          image: imageUrl,
          title,
          color,
          size,
          amount,
          status,
          name,
          phone,
          address,
          time,
          count,
        };
      } else {
        return res.status(400).json({ error: 'No image uploaded' });
      }

      dbConnection.getConnection((error: NodeJS.ErrnoException | null, connection) => {
        if (error) {
          console.error('Error connecting to database:', err);
          return res.status(500).json({ error: 'Error connecting to database' });
        }

        connection.query(
          'INSERT INTO orders (image, title, color, size, amount, status, name, phone, address, time, count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [
            newOrder.image,
            newOrder.title,
            newOrder.color,
            newOrder.size,
            newOrder.amount,
            newOrder.status,
            newOrder.name,
            newOrder.phone,
            newOrder.address,
            newOrder.time,
            newOrder.count,
          ],
          (queryError) => {
            connection.release();

            if (queryError) {
              console.error('Error executing query:', queryError);
              return res.status(500).json({ error: 'Error inserting data into database' });
            }

            res.status(200).json({ message: 'Add order successfully' });
          }
        );
      });
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
