import { FC } from 'react';
// import { useForm } from 'react-hook-form';
// eslint-disable-next-line import/no-extraneous-dependencies
// import { yupResolver } from '@hookform/resolvers/yup';
// eslint-disable-next-line import/no-extraneous-dependencies
// import * as yup from 'yup';

interface LoginFormInputs {
  email: String;
  password: String;
}
// interface Respon {
//   code: Number;
// }

// const inputWrong = yup.object({
//   email: yup
//     .string()
//     .trim()
//     .email('Please enter a valid email address.')
//     .required('Email is required'),
//   password: yup
//     .string()
//     .required('Password is required.')
//     .min(6, '6 charts min')
//     .max(20, '20 chars limit')
//     .matches(/^[a-zA-Z0-9]{6, 20}$/, 'Password format error'),
// });

// const loginResult = yup
//   .object({
//     password: yup.string().test('psw', 'Password is wrong', (object) => {
//       if (object && object.length >= 8) {
//         return true;
//       }
//       return false;
//     }),
//   })
//   .required();

const Index: FC = () => {
  // const {
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<LoginFormInputs>({
  //   resolver: yupResolver(inputWrong),
  //   defaultValues: { email: '', password: '' },
  // });
  // const onSubmit = (data: LoginFormInputs) => {
  //   console.log(`${data.email}+${data.password}`);
  // };

  // const { state, setState } = useState(false);

  // function handleLoginResult(data: Respon) {
  //   if (data.code !== 1) {
  //     yupResolver(loginResult);
  //   }
  // }

  return (
    <div className="h-full  flex items-center justify-center flex-col text-center">
      <div className="text-green-900 w-96  ">
        <p className="text-2xl font-semibold">Unititled UI</p>
      </div>

      <div className="mt-20 mb-10">
        <p className=" text-4xl text-green-900 font-medium">Welcome back</p>
        <p className="  text-blue-900 font-semibold">Please enter your details</p>
      </div>

      {/*<form className="text-justify w-96" onSubmit={handleSubmit(onSubmit)}>*/}
      {/*  <div className="">*/}
      {/*    <p className="text-blue-900 font-semibold">Email</p>*/}
      {/*    <input*/}
      {/*      type="text"*/}
      {/*      className="w-96 h-10 rounded-lg pl-2 border-2 border-green-900 border-opacity-25"*/}
      {/*      placeholder="Enter your mail"*/}
      {/*    />*/}
      {/*    <p className="w-96 h-5   text-sm text-red-400 font-semibold">{errors.email?.message}</p>*/}

      {/*    <p className=" text-blue-900 font-semibold">Password</p>*/}
      {/*    <input*/}
      {/*      type="password"*/}
      {/*      className="w-96 h-10 rounded-lg pl-2 border-2 border-green-900 border-opacity-25"*/}
      {/*      placeholder="Enter your password"*/}
      {/*    />*/}
      {/*    <p className="w-96 h-5 text-sm text-red-400 font-semibold">{errors.password?.message}</p>*/}
      {/*  </div>*/}

      {/*  <div className="w-full mt-5  ">*/}
      {/*    <div className=" float-left ">*/}
      {/*      <input type="radio" className="float-left w-4 h-4 rounded-xl" />*/}
      {/*      <p className="text-xs float-left text-blue-900 font-semibold">*/}
      {/*        Remember me for 30 days*/}
      {/*      </p>*/}
      {/*    </div>*/}

      {/*    <div className="float-right  text-xs  text-green-700 font-semibold">*/}
      {/*      <a>Forgot password</a>*/}
      {/*    </div>*/}
      {/*  </div>*/}

      {/*  <br />*/}
      {/*  <div className=" text-center my-5 w-96 h-10 bg-green-800 rounded-lg">*/}
      {/*    <button type="submit">*/}
      {/*      <p className="text-white text-1xl my-2">Sign in</p>*/}
      {/*    </button>*/}
      {/*  </div>*/}

      {/*  <div className="w-full flex flex-row justify-center">*/}
      {/*    <div className="text-sm text-blue-900"> Don&#39;t have an account?</div>*/}
      {/*    <div className=" ml-1 text-sm text-green-700">*/}
      {/*      <a>Sign up</a>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</form>*/}
    </div>
  );
};

export default Index;
