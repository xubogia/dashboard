import {FC, ReactNode} from 'react';
import Main from './maintemp'
import Nav from '../components/nav/temp'
interface Props {
  right?: any;
  currentPage:string;
}

const Index: FC<Props> = ({right,currentPage}) => {


  return (

    <div className={'flex flex-row h-screen'}>
      <Nav currentPage={currentPage}/>
      <Main Right={right}/>
    </div>
  );
};

export default Index;
