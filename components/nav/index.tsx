import {FC} from "react";
import { useRouter } from 'next/router';

const Index: FC = () => {
  const router = useRouter();
  const { asPath, pathname } = useRouter();
  const handelClick = (routeString: string) => {
    router.push(routeString);
  };
  return (
    <div className={'w-72 bg-gray-400'}>
      <div className={'h-20'}></div>
      <nav className="flex flex-row justify-between  sm:flex-col sm:space-y-10 ">
        <button
          className={pathname === '/' ? 'text-white' : ''}
          onClick={() => handelClick('/')}
          type="button"
        >
          商品管理
        </button>
        <button
          className={asPath.startsWith('/order') ? 'text-white' : ''}
          onClick={() => handelClick('./order')}
          type="button"
        >
          订单管理
        </button>
        <button
          className={asPath.startsWith('setting') ? 'text-white' : ''}
          onClick={() => handelClick('./setting')}
          type="button"
        >
          设置
        </button>

        <button
          className={asPath.startsWith('chatGPT') ? 'text-white' : ''}
          onClick={() => handelClick('./chatGPT')}
          type="button"
        >
          退出
        </button>
      </nav>
    </div>
  );
};

export default Index;