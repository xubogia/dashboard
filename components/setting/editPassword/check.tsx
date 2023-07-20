import { FC, useState } from 'react';
import axios from 'axios';

interface Props {
  step: number;
  handleChange: (step: number) => void;
}

const Index: FC<Props> = ({ step, handleChange }) => {
  const cookies = document.cookie.split(';'); // 将所有的 Cookie 字符串拆分为数组

  const usernameCookie = cookies.find((cookie) => cookie.trim().startsWith('username=')); // 查找以 'username=' 开头的 Cookie

  const usernameValue = usernameCookie ? usernameCookie.split('=')[1] : ''; // 获取 Cookie 的值

  console.log(usernameValue); // 打印 username 的值

  const [usernameLogging, setUsernameLogging] = useState(usernameValue);
  const handleLoginFormSubmit = async (event: any) => {
    event.preventDefault();
    handleChange(step + 1);
    // 获取表单数据
    const { username, password } = event.target.elements;

    try {
      const userdata = {
        username: username.value,
        password: password.value,
      };

      const response = await axios.post('/api/user/login', userdata);

      if (response.status === 200) {
        handleChange(step + 1);
      } else {
        // 登录失败，显示错误提示
        console.error('Login failed');
      }
    } catch (error) {
      console.error('An error occurred', error);
    }
  };

  return (
    <form className="space-y-6" action="#" onSubmit={handleLoginFormSubmit}>
      <div>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
          用户名
        </label>
        <div className="mt-2">
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            value={usernameLogging}
            onChange={(event) => setUsernameLogging(event.target.value)}
            className="block w-full rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
            原密码
          </label>
        </div>
        <div className="mt-2">
          <input
            id="password"
            name="password"
            type="text"
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
          验证
        </button>
      </div>
    </form>
  );
};
export default Index;
