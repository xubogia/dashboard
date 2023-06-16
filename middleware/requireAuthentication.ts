import { useRouter } from 'next/router';
import { useEffect } from 'react';

export function requireAuthentication<T>(WrappedComponent: React.ComponentType<T>): React.FC<T> {
  const Wrapper: React.FC<T> = (props) => {
    const router = useRouter();

    useEffect(() => {
      // 在这里进行登录验证的逻辑判断
      /* 判断用户是否已登录的逻辑 */;
      const isLoggedIn = false;

      if (!isLoggedIn) {
        // 如果用户未登录，则跳转到登录页
        router.push('/login');
      }
    }, []);

    // 渲染包装组件
    return <WrappedComponent {...props} />;
  };

  // 保留包装组件的静态属性（如 getInitialProps）
  if (typeof WrappedComponent.getInitialProps === 'function') {
    Wrapper.getInitialProps = async (ctx) => {
      // 在这里编写包装组件的 getInitialProps 逻辑
      // 这里的示例是将包装组件的 getInitialProps 传递给下层组件
      return WrappedComponent.getInitialProps(ctx);
    };
  }

  return Wrapper;
}
