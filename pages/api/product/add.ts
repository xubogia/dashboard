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
  interface Product {
    image: any[];
    imageDetail: any;
    amount: number;
    detail: any;
    title: any;
    category: any;
    status: any
  };

  function renameFile(oldPath: string, newPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        fs.renameSync(oldPath, newPath);
      }catch (err){
        reject()
      }
      resolve();
    });
  }

  export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
      console.log(111);
      const form = new formidable.IncomingForm();
      form.multiples = true;


      form.parse(req, async (err:any, fields:any, files:any) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'File upload failed' });
        }



        const {status,title,category,detail} = fields ;
        const amount = parseInt(fields.amount as string);
        const imageDetail=fields.imageDetail.split(',');


        const directoryPath = `./public/product/${title}`;
        if (!fs.existsSync(directoryPath)) {
          fs.mkdirSync(directoryPath, { recursive: true });
        }
        const imageUrls:string[]=[];
        const uploadedFiles = Object.values(files) as formidable.File[];

        if (uploadedFiles.length === 0) {
          return res.status(400).json({ error: 'No files uploaded' });
        }
        console.log(uploadedFiles.length);

        try {
          for (let i = 0; i < uploadedFiles.length; i++){
            const file = uploadedFiles[i];
            const filePath = file.filepath;
            const fileName = file.originalFilename;
            const targetPath = `${directoryPath}/${fileName}`;
            console.log(filePath);
            renameFile(filePath, targetPath).then(() => {
              const imageUrl=targetPath.replace('./public','')
              imageUrls.push(imageUrl);
            });
          }

          const product:Product = {
            image: imageUrls,
            title,
            category,
            amount,
            status,
            imageDetail,
            detail,
          };
          console.log(product);
          // eslint-disable-next-line @typescript-eslint/no-shadow
          dbConnection.getConnection((err:NodeJS.ErrnoException|null, connection) => {
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



