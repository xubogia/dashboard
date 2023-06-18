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
  interface EachDetail {
    image:string;
    imageDetail:string;
    size:string[]
  }
  interface Product {
    eachDetail:EachDetail[];
    title: string;
    id?: number;
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
      const form = new formidable.IncomingForm();
      form.multiples = true;

      let newProduct: Product;
      form.parse(req, async (err:any, fields:NewProduct, files:any) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'File upload failed' });
        }
        const amount = parseInt(fields.amount);
        const { detail, title, category, status } = fields;
        const eachDetail:EachDetail[]=JSON.parse(fields.eachDetail);
        console.log(eachDetail);


        const uploadedFiles = Object.values(files) as formidable.File[];

        if (uploadedFiles.length === 0) {
          return res.status(400).json({ error: 'No files uploaded' });
        }
        console.log(uploadedFiles.length);

        try {
          for (let i = 0; i < uploadedFiles.length; i++){
            const file = uploadedFiles[i];
            const filePath = file.filepath;
            const timestamp = Date.now(); // 获取当前时间戳
            const fileName = file.originalFilename.split('.').pop();
            const targetPath = `./public/product/${timestamp}.${fileName}`;
            console.log(targetPath);
            console.log(filePath);
            renameFile(filePath, targetPath).then(() => {
              const imageUrl=targetPath.replace('./public','')
             eachDetail[i].image=imageUrl;
              console.log(eachDetail[i].image);
            });
          }

          newProduct = {
            eachDetail,
            title,
            category,
            amount,
            status,
            detail,
          };

          // eslint-disable-next-line @typescript-eslint/no-shadow
          // console.log(newProduct);
          dbConnection.getConnection((err:NodeJS.ErrnoException|null, connection) => {
            if (err) {
              console.error('Error connecting to database:', err);
              return res.status(500).json({ error: 'Error connecting to database' });
            }

            // 查询数据库中的产品数据
            connection.query('INSERT INTO products (title, category, amount, status,detail,eachDetail) VALUES (?, ?, ?, ?, ?, ?)',
              [ newProduct.title, newProduct.category,
                newProduct.amount, newProduct.status,
                newProduct.detail, JSON.stringify(newProduct.eachDetail),]
            )


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



