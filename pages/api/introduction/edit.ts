// 导入所需的依赖和模块
import { NextApiRequest, NextApiResponse } from 'next';
// @ts-ignore

import mysql from 'mysql2';

// 密钥用于签发和验证JWT令牌
const dbConnection = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'abiu',
  password: '8818637',
  database: 'huihe',
});
// 登录 API 处理函数
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('is editing introduction');
  // 设置允许跨域的请求源

  if (req.method === 'POST') {
    const { wechat, phone, detail } = req.body;

    dbConnection.getConnection((err: NodeJS.ErrnoException | null, connection) => {
      if (err) {
        console.error('Error connecting to database:', err);
        return res.status(500).json({ error: 'Error connecting to database' });
      }
      connection.query(
        `UPDATE introduction SET wechat = ?, phone =?, detail =?`,
        [wechat, phone, detail],
        (error) => {
          if (error) {
            console.error('Error updating order:', err);
            return res.status(500).json({ error: 'Error updating introduction' });
          }
          connection.release();
          res.status(200).json({ message: 'introduction update success' });
        }
      );
    });
  } else {
    // 非 POST 和 GET 请求返回 405 Method Not Allowed 错误
    res.status(405).end();
  }
}
