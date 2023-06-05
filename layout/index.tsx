import {FC, ReactNode} from 'react';
import Main from './main'
import Nav from '../components/nav'
interface Props {
  flat?: boolean;
  left?: ReactNode;
  right?: ReactNode;
  reverse?: boolean;
  showNav?: boolean;
  isPrivate: boolean;
}

const Index: FC<Props> = ({showNav = false, right}) => {


  return (

    <div className={'flex flex-row h-screen'}>
      <Nav/>
      <Main right={right}/>
    </div>
  );
};

export default Index;
