import { useRouter } from 'next/router';
import axios from 'axios';
import Image from 'next/image';
import HuiHe from '../../asset/image/huihe.jpg';

const Index = () => {
  // 获取路由实例
  const router = useRouter();

  // 处理登录表单提交事件
  const handleLoginFormSubmit = async (event: any) => {
    event.preventDefault();

    // 获取表单数据
    const { username, password } = event.target.elements;

    try {
      const userData = {
        username: username.value,
        password: password.value,
      };
      const response = await axios.post('http://localhost:3000/api/user/login', userData);

      if (response.status === 200) {
        // 登录成功，获取令牌
        const { token } = response.data;

        // 将令牌保存在本地（Cookie 或本地存储）
        document.cookie = `token=${token};  path=/`;
        document.cookie = `username=${username.value}; path=/`;

        console.log(document.cookie);
        // 或者使用本地存储
        // localStorage.setItem('token', token);

        // 重定向由服务器端逻辑处理
        await router.push('/');
        // 不在前端进行重定向
      } else {
        // 登录失败，显示错误提示
        console.error('Login failed');
      }
    } catch (error) {
      console.error('An error occurred', error);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 ">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Image className="mx-auto " width={160} height={160} src={HuiHe} alt="Your Company" />
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" action="#" onSubmit={handleLoginFormSubmit}>
          <div>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
              账号
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                密码
              </label>
              <div className="text-sm">
                <a href="#" className="font-semibold text-red-600 hover:text-indigo-500">
                  忘记密码？
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              登录
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          没有账号？{' '}
          <a href="#" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
            注册成为新用户
          </a>
        </p>
      </div>
    </div>
  );
};

export default Index;
