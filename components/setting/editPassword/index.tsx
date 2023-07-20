import { useState } from 'react';
import Check from './check';
import EnterNewPassword from './EnterNewPassword';
import Success from './Success';

const Index = () => {
  const [step, setSept] = useState(1);

  return (
    <div className="bg-gray-50 flex min-h-full flex-1 flex-col pt-40   ">
      <div className="mt-10 flex flex-col space-y-20 ">
        <div className="flex flex-row space-x-4 justify-center items-center">
          <div
            className={`w-40 h-10 items-center flex flex-row  space-x-2 rounded-lg  justify-center bg-gray-200
             ${step === 1 ? ' bg-red-600 shadow-2xl text-white' : ''}`}
          >
            <div>验证身份</div>
          </div>
          <div>{'----->'}</div>
          <div
            className={`w-40 h-10 items-center flex flex-row  space-x-2 rounded-lg  justify-center bg-gray-200
             ${step === 2 ? 'bg-red-600 text-white shadow-2xl' : ''}`}
          >
            <div>设置密码</div>
          </div>
          <div>{'----->'}</div>
          <div
            className={`w-40 h-10 items-center flex flex-row  space-x-2 rounded-lg  justify-center bg-gray-200
             ${step === 3 ? 'bg-red-600 text-white shadow-2xl' : ''}`}
          >
            <div>修改成功</div>
          </div>
        </div>
        <div className=" sm:mx-auto sm:w-full sm:max-w-sm">
          {step === 1 ? (
            <Check step={step} handleChange={setSept} />
          ) : step === 2 ? (
            <EnterNewPassword step={step} handleChange={setSept} />
          ) : (
            <Success />
          )}
        </div>
      </div>
    </div>
  );
};
export default Index;
