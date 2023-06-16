import { FC, useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import Menu from '../menu';
import columns from './columns';

interface Order {
  image: string;
  id: number;
  state: string;
  amount: number;
  name: string;
  phone: string;
  address: string;
  time: string;
}


const Index: FC<{ searchText: string }> = ({ searchText }) => {
  const [data, setData] = useState<Order[]>([]);
  const [row, setRow] = useState<Order[]>([]);


  const fetchData = async () => {
    let result;
    try {
      result = sessionStorage.getItem('orderData');
      console.log(result);
      if (result) {
        result = JSON.parse(result);
      } else {
        const response = await axios.get('/api/order');
        result = response.data;
        sessionStorage.setItem('orderData', JSON.stringify(result));
      }
      setData(result);
      setRow(result);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  useEffect(() => {
    if (data.length === 0) {
      fetchData().then();
    }
  }, [data.length]);

  useEffect(() => {
    if (searchText !== '') {
      console.log('search', searchText);
      const rowTemp = data.filter((order) =>
        order.name.includes(searchText) || order.id.toString().includes(searchText),
      );
      setRow(rowTemp);
    } else {
      console.log(data);
      if (data.length !== 0)
        setRow(data);
    }
  }, [data, searchText]);


  const getRowHeight = (): number =>
     80 // 设置行的高度为 120
  ;


  return (
    <div className='w-full  flex-grow flex flex-col  px-8 py-4'>
      <div className='bg-white w-full flex flex-col flex-grow py-4 space-y-10'>
        <div className='flex items-center justify-between'>
          <Menu items={[{
            text: '1', fc: () => {
            },
          }, {
            text: '2', fc: () => {
            },
          }]} />
          <div className={' '}>
            <button className="w-60 bg-blue-500 justify-center items-center py-2 rounded-lg text-white" type='button'>添加订单
            </button>
          </div>


        </div>
        <div className=' w-full flex flex-col  flex-grow text-center h-96 overflow-auto'>
          <DataGrid
            rows={row}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            getRowHeight={getRowHeight} // 设置行高度的函数
            pageSizeOptions={[5, 10]}
            checkboxSelection
          />
        </div>
        <div className='h-10 flex flex-row justify-between items-center'>
          <div className='h-full flex flex-row'>
            <div className='flex items-center w-32'>
              <input className='ml-2 mr-1 h-4 w-4' type='checkbox' />
              <span>全选</span>
            </div>
            <div className='h-full flex items-center justify-center space-x-2'>
              <button className='w-20 h-6 rounded-lg bg-red-500 text-white text-xs tracking-widest' type='button'>删除</button>
              <button className='w-20 h-6 rounded-lg bg-green-500 text-white text-xs tracking-widest' type='button'>发货</button>
              <button className='w-20 h-6 rounded-lg bg-blue-500 text-white text-xs tracking-widest' type='button'>导出</button>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Index;
