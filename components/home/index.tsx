import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Image from 'next/image';

interface Product {
  image: string;
  title: string;
  ID: number;
  category: string;
  amount: string;
  status: string;
}

const Index: FC = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [state, setState] = useState('全部商品');
  const [data, setData] = useState<Product[]>([]);
  const itemsPerPage = 7;
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndtIndex] = useState(startIndex + itemsPerPage);
  const [selectAll, setSelectAll] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  const handleStateChange = (newState: string) => {
    setState(newState);
  };

  const fetchData = async () => {
    try {
      const cachedData = sessionStorage.getItem('productData');
      console.log(cachedData)
      if (cachedData) {
        setData(JSON.parse(cachedData));
      } else {
        const response = await axios.get('/api/product');
        const result = response.data;
        sessionStorage.setItem('productData', JSON.stringify(result));
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
    setSearchText(event.target.value.trim());
    if (event.target.value === '')
      setSearchKeyword('');
  };
  const handleSearch = () => {
    const searchTextTemp = searchText;
    setSearchKeyword(searchTextTemp);
    setCurrentPage(1);
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

  const renderData = (start: number, end: number) => (
      <tbody  className={'h-96 overflow-auto '}>
      {data.filter((product) =>
        product.title.includes(searchKeyword) && (product.status === state || state==='全部商品'),
      ).slice(start, end).map((product) => (
        <tr key={product.ID} className=' '>
          <td className='border border-gray-200 p-2'>
            <input
              className='ml-2 mr-1 h-4 w-4'
              type='checkbox'
              checked={selectAll || selectedItems.includes(product.ID.toString())}
              onChange={() => handleCheckboxChange(product.ID.toString())}
            />

          </td>
          <td className='border  border-gray-200 p-2'>
            <Image src={product.image} alt={'商品图片'} width={100} height={100} />
          </td>
          <td className='border  border-gray-200 p-2'>{product.title}</td>
          <td className='border  border-gray-200 p-2'>{product.ID}</td>
          <td className='border  border-gray-200 p-2'>￥{product.category}</td>
          <td
            className={product.status === '已上架' ? 'border  border-gray-200 p-2 text-red-500' : 'border border-gray-200 p-2 text-green-500'}>{product.status}</td>
          <td className='border  border-gray-200 p-2'>
            {product.amount}
          </td>
          <td className='border border-gray-200  p-2'>
            <button className='text-blue-500'>查看</button>
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

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setStartIndex((currentPage - 2) * itemsPerPage);
      setEndtIndex((currentPage - 2) * itemsPerPage + itemsPerPage);
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
    <div className={'flex-grow   flex flex-col border-32 px-8 py-4'}>
      <div className="flex  items-center  ">
        <h1 className="text-2xl font-bold">商品管理</h1>
        <div className={'flex-grow text-center'}>
          <button className="bg-blue-500 text-white py-2 px-20 rounded-md">添加商品</button>
        </div>
      </div>
      <div className={'mt-5 bg-white w-full flex flex-col flex-grow py-4  space-y-4'}>
        <div className={'flex flex-row justify-between '}>
          <div className='relative group   '>
            <button className='py-1 px-4 bg-blue-500 text-white rounded-md' type='button'>
              所有类别
            </button>
            <ul className='absolute hidden bg-white border rounded-md shadow-lg z-10 group-hover:block'>
              <li className='p-2 hover:bg-gray-100'>选项1</li>
              <li className='p-2 hover:bg-gray-100'>选项2</li>
              <li className='p-2 hover:bg-gray-100'>选项3</li>
            </ul>
          </div>
          <div className={'flex flex-row rounded-md'}>
            <button className={state === '全部商品' ? 'bg-blue-500 w-40 text-white rounded-md' : 'bg-gray-200 w-40'}
                    onClick={() => handleStateChange('全部商品')}>全部商品
            </button>
            <button className={state === '已上架' ? 'bg-blue-500 w-40 text-white rounded-md' : 'bg-gray-200 w-40'}
                    onClick={() => handleStateChange('已上架')}>已上架
            </button>
            <button className={state === '未上架' ? 'bg-blue-500 w-40 text-white rounded-md' : 'bg-gray-200 w-40'}
                    onClick={() => handleStateChange('未上架')}>未上架
            </button>
          </div>
          <div className={'flex flex-row space-x-8'}>
            <input className={'w-60 border-1 px-2'} type={'search'} onChange={handleSearchChange} />
            <button className={'bg-blue-500 w-20 text-white rounded-lg'} onClick={handleSearch} n>查询</button>
          </div>
        </div>
        <div className=" w-full flex flex-col  flex-grow text-center h-96 overflow-auto border ">
          <table className=''>
            <thead className="sticky -top-1 bg-gray-100 border z-10">
            <tr className={' '}>
              <th className='border  p-2 w-4 '>
                <input
                  className='ml-2 mr-1 h-4 w-4'
                  type='checkbox'
                  checked={selectAll}
                  onChange={() => handleSelectAll()}
                />

              </th>
              <th className='border   p-2 w-32'>商品图片</th>
              <th className='border  p-2'>商品标题</th>
              <th className='border  p-2'>货号</th>
              <th className='border  p-2'>类别</th>
              <th className='border  p-2'>状态</th>
              <th className='border  p-2'>价格</th>
              <th className='border  p-2'>操作</th>
            </tr>
            </thead>
            {renderData(startIndex, endIndex)}
          </table>
        </div>



        <div className={'h-10 flex flex-row justify-between items-center'}>
          <div className={'h-full flex flex-row'}>
            <div className='flex items-center w-32'>
              <input className='ml-2 mr-1  h-4 w-4' type='checkbox' />
              <span>全选</span>
            </div>
            <div className={'h-full flex items-center justify-center space-x-2'}>
              <button className={'w-20 h-6 rounded-lg bg-red-500 text-white text-xs tracking-widest'}>删除</button>
              <button className={'w-20 h-6 rounded-lg bg-green-500 text-white text-xs tracking-widest'}>上架</button>
              <button className={'w-20 h-6 rounded-lg bg-blue-500 text-white text-xs tracking-widest'}>下架</button>
            </div>
          </div>

          <div className={'flex flex-row space-x-4'}>
            <button className={'border-1 h-6'} onClick={() => goToPreviousPage()}>上一页</button>
            <div className={'w-2 h-3 border-1'}>{currentPage}</div>

            <button className={'border-1 h-6'} onClick={() => goToNextPage()}>下一页</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
