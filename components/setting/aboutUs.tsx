import { useEffect, useState } from 'react';
import axios from 'axios';

interface Introduction {
  wechat: string;
  phone: string;
  detail: string;
}
const Index = () => {
  const initIntroductionData = { wechat: '', phone: '', detail: '' };
  const [introductionData, setIntroductionData] = useState<Introduction>(initIntroductionData);
  const [isEditing, setIsEditing] = useState(false);
  const handleChangeData = (name: string, value: string) => {
    const introductionDataTemp = { ...introductionData };
    // @ts-ignore
    introductionDataTemp[name] = value;
    setIntroductionData(introductionDataTemp);
  };
  const fetchData = async () => {
    try {
      const response = await axios.get('/api/introduction');
      setIntroductionData(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchData().then();
  }, []);

  const handleFormSubmit = async (event: any) => {
    event.preventDefault();
    const isObjectEmpty = Object.values(introductionData).every(
      (value) => value === null || value === undefined || value === ''
    );
    if (isObjectEmpty) {
      console.log('不能有空值');
      return;
    }

    try {
      const response = await axios.post('api/introduction/edit', introductionData);
      console.log('修改成功', response.data);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-gray-50 flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 ">
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" action="#" onSubmit={handleFormSubmit}>
          <div>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
              客服电话
            </label>
            <div className="mt-2">
              <input
                name="wechat"
                type="text"
                readOnly={!isEditing}
                value={introductionData.wechat === undefined ? '' : introductionData.wechat}
                onChange={(event) => handleChangeData(event.target.name, event.target.value)}
                required
                className="block w-full rounded-md border-0 px-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                客服微信
              </label>
            </div>
            <div className="mt-2">
              <input
                name="phone"
                type="text"
                readOnly={!isEditing}
                value={introductionData.phone === undefined ? '' : introductionData.phone}
                onChange={(event) => handleChangeData(event.target.name, event.target.value)}
                autoComplete="current-password"
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
                说明
              </label>
            </div>
            <div className="mt-2">
              <textarea
                name="detail"
                autoComplete="current-password"
                readOnly={!isEditing}
                value={introductionData.detail === undefined ? '' : introductionData.detail}
                onChange={(event) => handleChangeData(event.target.name, event.target.value)}
                required
                className="h-40 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            {isEditing ? (
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-amber-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                保存
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                编辑
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
export default Index;
