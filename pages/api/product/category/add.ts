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
  console.log('posting new category');
  if(req.method==='POST'){
    const {newCategory} = req.body;
    console.log(newCategory);
    dbConnection.getConnection((err, connection) => {
      if (err) {
        console.error('Error connecting to database:', err);
        return res.status(500).json({ error: 'Error connecting to database' });
      }

      // 查询数据库中的产品数据
      connection.query('INSERT INTO category (categoryName) VALUE (?)', (newCategory),
        (err, result)=>{})
    });

    res.status(200).json({ message: 'add newCategory successfully' });
  }else{
    res.status(405).json({ error: 'Method not allowed' });
  }


}
