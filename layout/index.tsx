import {FC} from 'react';
import { GetServerSideProps } from 'next';
import axios from 'axios';
import Main from './main'
import Nav from '../components/nav'

interface Props {
  right?: any;
  currentPage:string;
}

const Index: FC<Props> = ({right,currentPage}) => (

    <div className="flex flex-row h-screen">
      <Nav currentPage={currentPage}/>
      <Main Right={right}/>
    </div>
  );

export const getServerSideProps: GetServerSideProps = async (context) => {
  // 在这里进行登录验证的逻辑判断
  let isLoggedIn = false;

  try {
    // 从请求的 Cookie 中获取令牌
    const {token} = context.req.cookies;
    console.log(token);
    // 发送登录验证请求到服务器，并在请求头中包含令牌
    const response = await axios.get('http://localhost:3000/api/login', {
      headers: {
        Authorization: `Bearer ${token}`, // 在请求头中添加令牌
      },
    });

    // 假设登录验证成功的响应中包含一个名为 "isLoggedIn" 的字段来表示用户是否已登录
    isLoggedIn = response.data.isLoggedIn;
    console.log('isLoggedIn',isLoggedIn)
  } catch (error) {
    console.error('An error occurred during login verification', error);
  }

  if (!isLoggedIn) {
    // 如果用户未登录，则重定向到登录页
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  // 用户已登录，继续渲染页面内容
  return {
    props: {},
  };
};

export default Index;
