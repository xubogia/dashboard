import { FC } from 'react';
import axios from 'axios';

interface Props {
  step: number;
  handleChange: (step: number) => void;
}

const Index: FC<Props> = ({ step, handleChange }) => {
  const cookies = document.cookie.split(';'); // 将所有的 Cookie 字符串拆分为数组

  const usernameCookie = cookies.find((cookie) => cookie.trim().startsWith('username=')); // 查找以 'username=' 开头的 Cookie

  const username = usernameCookie ? usernameCookie.split('=')[1] : ''; // 获取 Cookie 的值

  const tokenCookie = cookies.find((cookie) => cookie.trim().startsWith('token='));
  const tokenValue = tokenCookie ? tokenCookie.split('=')[1] : ''; // 获取 Cookie 的值

  console.log(username); // 打印 username 的值

  const handleLoginFormSubmit = async (event: any) => {
    event.preventDefault();
    handleChange(step + 1);
    // 获取表单数据
    const { newPassword, confirmPassword } = event.target.elements;

    try {
      const newPasswordTemp = newPassword.value;
      const confirmPasswordTemp = confirmPassword.value;
      if (newPasswordTemp === confirmPasswordTemp) {
        const userdata = {
          username,
          password: newPassword.value,
        };
        console.log(tokenValue, userdata);
        const response = await axios.post('/api/user/edit', userdata, {
          headers: {
            Authorization: `Bearer ${tokenValue}`, // 在请求头中添加令牌
          },
        });
        console.log(response.data);

        handleChange(step + 1);
      } else {
        console.log('两次密码不一样');
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
          新密码
        </label>
        <div className="mt-2">
          <input
            name="newPassword"
            type="password"
            autoComplete="password"
            required
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
            再次输入新密码
          </label>
        </div>
        <div className="mt-2">
          <input
            name="confirmPassword"
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
          验证
        </button>
      </div>
    </form>
  );
};
export default Index;
