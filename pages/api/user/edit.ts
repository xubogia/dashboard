// 导入所需的依赖和模块
import { NextApiRequest, NextApiResponse } from 'next';
// @ts-ignore
import jwt from 'jsonwebtoken';
import mysql from 'mysql2';
// @ts-ignore
import bcrypt from 'bcrypt';
// 密钥用于签发和验证JWT令牌
const secretKey = '8818637';
const dbConnection = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'abiu',
  password: '8818637',
  database: 'huihe',
});
// 登录 API 处理函数
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('is editing password');
  // 设置允许跨域的请求源
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

  // 设置允许的请求方法
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

  // 设置允许的请求头
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    // 返回一个带有 HTTP 200 OK 状态的响应，处理预检请求
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (token) {
      try {
        // 验证令牌的有效性
        const decodedToken = jwt.verify(token, secretKey);
        console.log(decodedToken);
        const { username, password } = req.body;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log(hashedPassword);

        dbConnection.getConnection((err: NodeJS.ErrnoException | null, connection) => {
          if (err) {
            console.error('Error connecting to database:', err);
            return res.status(500).json({ error: 'Error connecting to database' });
          }
          connection.query(
            `UPDATE user SET password = ? where username= ?`,
            [hashedPassword, username],
            // eslint-disable-next-line @typescript-eslint/no-shadow
            (err) => {
              if (err) {
                console.error('Error updating order:', err);
                return res.status(500).json({ error: 'Error updating password' });
              }
              connection.release();
              res.status(200).json({ username, newPassword: hashedPassword });
            }
          );
        });
      } catch (error) {
        console.log('Token is invalid');
        // 令牌验证失败，返回验证错误的响应
        res.status(402).json({ message: 'Token is invalid', isLoggedIn: false });
      }
    } else {
      // 令牌不存在，返回未授权的响应
      res.status(401).json({ message: 'Token is missing', isLoggedIn: false });
    }
  } else {
    // 非 POST 和 GET 请求返回 405 Method Not Allowed 错误
    res.status(405).end();
  }
}
