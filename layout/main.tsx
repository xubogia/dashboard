import { FC, useEffect, useState } from 'react';
import Header from '../components/header';

interface Props {
  Right?: any;

}

const Index: FC<Props> = ({Right}) => {
  const [searchText,setSearchText]=useState('');

  useEffect(()=>{
    console.log(searchText)
  },[searchText]);
  return (
    <div className="flex-grow flex flex-col">
      <Header setSearchText={setSearchText}/>
      <Right searchText={searchText} />
    </div>
  );
};

export default Index;
