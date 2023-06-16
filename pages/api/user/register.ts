import bcrypt from 'bcrypt';
import mysql from 'mysql2';

const dbConnection = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'abiu',
  password: '8818637',
  database: 'huihe',
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    try {
      // 在后端对密码进行加密
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // 检查用户名是否已存在
      const checkUsernameQuery = 'SELECT * FROM user WHERE username = ?';
      dbConnection.query(checkUsernameQuery, [username], (err, results) => {
        if (err) {
          console.error('查询用户名时出现错误', err);
          res.status(500).json({ message: '注册失败' });
        } else {
          if (results.length > 0) {
            // 用户名已存在，返回错误消息
            res.status(409).json({ message: '用户名已存在' });
          } else {
            // 插入用户数据到数据库
            const insertQuery = 'INSERT INTO user (username, password) VALUES (?, ?)';
            const values = [username, hashedPassword];
            dbConnection.query(insertQuery, values, (err, results) => {
              if (err) {
                console.error('插入数据时出现错误', err);
                res.status(500).json({ message: '注册失败' });
              } else {
                console.log('用户数据插入成功');
                res.status(200).json({ message: '注册成功' });
              }
            });
          }
        }
      });
    } catch (error) {
      // 处理错误情况
      console.error('注册时出现错误', error);
      res.status(500).json({ message: '注册失败' });
    }
  } else {
    // 处理非POST请求的情况
    res.status(405).json({ message: '只支持POST请求' });
  }
}
