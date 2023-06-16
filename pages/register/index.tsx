import { NextPage } from 'next';
import axios from 'axios';
import { useState } from 'react';

const Home: NextPage = () => {
  // 获取路由实例
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handleLoginFormSubmit = async (event: any) => {
    event.preventDefault();

    const { username, password, confirmPassword } = event.target.elements;

    // 检查两次密码是否匹配
    if (password.value !== confirmPassword.value) {
      setPasswordMatch(false);
      return;
    }
    setPasswordMatch(true);
    try {
      const response = await axios.post('/api/user/register', {
        username: username.value,
        password: password.value,
      });

      console.log(response.data);
      // if (response.status === 200) {
      //   const { token } = response.data;
      //   document.cookie = `token=${token}; path=/`;
      //   router.push('/');
      // } else {
      //   console.error('Login failed');
      // }
    } catch (error) {
      console.error('An error occurred', error);
    }
  };

  return (
    <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
        <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
          注册
        </h2>
      </div>

      <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
        <form className='space-y-6' action='#' onSubmit={handleLoginFormSubmit}>
          <div>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor='username' className='block text-sm font-medium leading-6 text-gray-900'>
              用户名
            </label>
            <div className='mt-2'>
              <input
                id='username'
                name='username'
                type='text'
                autoComplete='text'
                required
                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              />
            </div>
          </div>

          <div>
            <div className='flex items-center justify-between'>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor='password' className='block text-sm font-medium leading-6 text-gray-900'>
                密码
              </label>

            </div>
            <div className='mt-2'>
              <input
                id='password'
                name='password'
                type='password'
                autoComplete='current-password'
                required
                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              />
            </div>
          </div>

          <div>
            <div className='flex items-center justify-between'>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor='password' className='block text-sm font-medium leading-6 text-gray-900'>
                再次输入密码
              </label>

            </div>
            <div className='mt-2'>
              <input
                id='confirmPassword'
                name='confirmPassword'
                type='password'
                autoComplete='current-password'
                required
                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${passwordMatch ? 'ring-gray-300' : 'ring-red-500'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
              />
            </div>
            {!passwordMatch && (
              <p className='mt-1 text-red-500 text-sm'>两次输入的密码不一致</p>
            )}
          </div>

          <div>
            <button
              type='submit'
              className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            >
              注册
            </button>
          </div>
        </form>


      </div>
    </div>
  );
};


export default Home;