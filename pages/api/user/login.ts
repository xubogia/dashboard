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
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    try {
      // 查询数据库以获取用户记录
      const sql = `SELECT * FROM user WHERE username = ?`;
      const values = [username];
      dbConnection.query(sql, values, async (err, results:mysql.RowDataPacket[]) => {
        if (err) {
          console.error('查询数据时出现错误', err);
          res.status(500).json({ message: '登录失败' });
        } else if (results.length > 0) {
            // 找到匹配的用户记录
            const user = results[0];

            // 使用 bcrypt.compare() 方法比较密码
            const passwordMatched = await bcrypt.compare(password, user.password);

            if (passwordMatched) {
              // 密码匹配，表示登录成功
              console.log('登录成功');
              const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });

              // 将令牌和 isLoggedIn 字段作为响应返回给客户端
              res.status(200).json({ token, isLoggedIn: true });
            } else {
              // 密码不匹配，登录失败
              console.log('密码错误');
              res.status(401).json({ message: '密码错误' });
            }
          } else {
            // 没有找到匹配的用户记录，登录失败
            console.log('用户不存在');
            res.status(404).json({ message: '用户不存在' });
          }
      });
    } catch (error) {
      // 处理错误情况
      console.error('登录时出现错误', error);
      res.status(500).json({ message: '登录失败' });
    }
  }
  else if (req.method === 'GET') {
    // 获取前端发送的令牌
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (token) {
      try {
        // 验证令牌的有效性
        console.log('now',token);
        const decodedToken = jwt.verify(token, secretKey);
        console.log(decodedToken);
        // 在此处进行其他验证逻辑
        // 假设验证成功

        // 返回验证成功的响应，包含 isLoggedIn 字段
        res.status(200).json({ message: 'Token is valid', isLoggedIn: true });
      } catch (error) {
        // 令牌验证失败，返回验证错误的响应
        res.status(401).json({ message: 'Token is invalid', isLoggedIn: false });
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
