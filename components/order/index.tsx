import { FC, useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Button from '@mui/material/Button';
import Menu from '../menu';
import { Checkbox } from '@mui/material';

interface Order {
  image: string;
  ID: number;
  state: string;
  amount: number;
  name: string;
  phone: string;
  address: string;
  time: string;
}

const options = [
  '苹果',
  '香蕉',
  '橙子',
  '草莓',
  '葡萄',
];


const Index: FC = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [data, setData] = useState<Order[]>([]);
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndtIndex] = useState(startIndex + itemsPerPage);
  const [selectAll, setSelectAll] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');


  const fetchData = async () => {
    try {
      const cachedData = sessionStorage.getItem('orderData');
      console.log(cachedData);
      if (cachedData) {
        setData(JSON.parse(cachedData));
      } else {
        const response = await axios.get('/api/order');
        const result = response.data;
        sessionStorage.setItem('orderData', JSON.stringify(result));
        setData(result);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (data.length === 0) {
      fetchData();
    }
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    if (event.target.value === '')
      setSearchKeyword('');
  };
  const handleSearch = () => {
    const searchTextTemp = searchText;
    setSearchKeyword(searchTextTemp);
    setCurrentPage(1);
  };


  const renderOrders = (start: number, end: number) => (

    <tbody>
    {data.filter((order) =>
      order.name.includes(searchKeyword) || order.state.includes(searchKeyword),
    ).slice(start, end).map((order) => (
      <tr key={order.ID} className=' '>
        <td className='border border-gray-200 p-2'>
          <Checkbox checked={selectedItems.includes(order.ID.toString())}
                    onChange={() => handleCheckboxChange(order.ID.toString())} />

        </td>
        <td className='border border-gray-200 p-2'>
          <Image src={order.image} alt={'商品图片'} width={100} height={100} />
        </td>
        <td className='border border-gray-200 p-2'>{order.ID}</td>
        <td className='border border-gray-200 p-2'>{order.state}</td>
        <td className='border border-gray-200 p-2'>￥{order.amount.toFixed(2)}</td>
        <td className='border border-gray-200 p-2'>{order.time}</td>
        <td className='border border-gray-200 p-2'>
          <div>{order.name}</div>
          <div>{order.phone}</div>
          <div>{order.address}</div>
        </td>
        <td className='border border-gray-200 p-2 space-x-2'>
          <Button variant='contained' className='bg-blue-500'>
            编辑
          </Button>
          <Button variant='contained' className='bg-red-500'>
            删除
          </Button>
        </td>
      </tr>
    ))}
    </tbody>
  );


  const handleCheckboxChange = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      const allItemIds = data.map((order) => order.ID.toString());
      setSelectedItems(allItemIds);
    }
    setSelectAll(!selectAll);
  };


  const totalPages = Math.ceil(data.length / itemsPerPage);

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      const currentPageTemp = currentPage - 1;
      setCurrentPage(currentPageTemp);
      let startIndexTemp = (currentPageTemp - 1) * 8;
      setStartIndex(startIndexTemp);
      setEndtIndex(startIndexTemp + itemsPerPage);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setStartIndex(currentPage * itemsPerPage);
      setEndtIndex(currentPage * itemsPerPage + itemsPerPage);
    }
  };


  return (
    <div className={'w-full flex flex-col'}>
    <header className="bg-white flex flex-row justify-between py-4 ">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
      <div className='flex flex-row space-x-8'>
        <input
          className={'px-2 border w-60 border-black focus:outline-none focus:border-blue-500'}
          type='search'
          onChange={handleSearchChange}
        />
        <button
          className={'py-2 px-4 rounded-lg bg-blue-500 text-white'}
          onClick={handleSearch}
        >
          查询
        </button>

      </div>
    </header>
    <div className=' flex-grow flex  px-8 py-4'>
      <div className='w-full flex flex-col   justify-between space-y-8'>
        <div className='bg-white w-full flex flex-row  justify-between items-center   '>
            <Menu items={[{
              text: '1', fc: () => {
              },
            }, {
              text: '2', fc: () => {
              },
            }]} />
          <button className={'w-60 bg-blue-500  items-center py-2 rounded-lg'}>添加订单</button>
      </div>

        <div className=' w-full flex flex-col  flex-grow text-center h-96 overflow-auto'>
          <table className='  w-full'>
            <thead className='sticky -top-1 bg-gray-100 border z-10'>
            <tr className='border-2 bg-gray-100 '>
              <th className='border  p-2 w-4 '>
                <Checkbox onChange={() => handleSelectAll()} />

              </th>
              <th className='border p-2 w-32'>商品图片</th>
              <th className='border p-2'>订单编号</th>
              <th className='border p-2'>订单状态</th>
              <th className='border p-2'>订单金额</th>
              <th className='border p-2'>下单时间</th>
              <th className='border p-2'>收获信息</th>
              <th className='border p-2'>操作</th>
            </tr>
            </thead>
            {renderOrders(startIndex, endIndex)}
          </table>
        </div>
        <div className='w-full h-10 flex flex-row justify-between items-center'>
          <div className='h-full flex flex-row'>
            <div className='flex items-center w-32'>
              <input className='ml-2 mr-1 h-4 w-4' type='checkbox' />
              <span>全选</span>
            </div>
            <div className='h-full flex items-center justify-center space-x-2'>
              <button className='w-20 h-6 rounded-lg bg-red-500 text-white text-xs tracking-widest'>删除</button>
              <button className='w-20 h-6 rounded-lg bg-green-500 text-white text-xs tracking-widest'>发货</button>
              <button className='w-20 h-6 rounded-lg bg-blue-500 text-white text-xs tracking-widest'>导出</button>
            </div>
          </div>
          <div className='flex flex-row space-x-4'>


            <Button variant='outlined' onClick={() => goToPreviousPage()}>上一页</Button>

            <Button variant='text'>{currentPage}</Button>
            <Button variant='outlined' onClick={() => goToNextPage()}>下一页</Button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Index;
