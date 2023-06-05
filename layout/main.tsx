import {FC, ReactNode} from 'react';

interface Props {
  flat?: boolean;
  right?: ReactNode;
  reverse?: boolean;
  showNav?: boolean;
  isPrivate: boolean;
}

const Index: FC<Props> = ({  right}) => {


  return (

    <div className={'flex-grow flex flex-col'}>
      <div className={'h-8'}>{'欢迎'}</div>
      {right}
    </div>
  );
};

export default Index;
