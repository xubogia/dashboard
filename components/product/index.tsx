import { FC, useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid';
import columns from './columns';
import AddProductDialog from '../Dialog/addProductDialog';
import useStore from '../../date/store';
import Menu from '../menu';

interface Product {
  image: string[];
  title: string;
  id: number;
  category: string;
  amount: string;
  status: string;
  detail: string;
}

interface Pros {
  searchText: string;
}

const categoryArr = ['所有类别', '拳套', '拳击绑带', '速度靶'];

const Index: FC<Pros> = ({ searchText }) => {
  const [state, setState] = useState<'全部商品' | '已上架' | '未上架'>('全部商品');
  const [category, setCategory] = useState('所有类别');
  const [data, setData] = useState<Product[]>([]);
  const [row, setRow] = useState<Product[]>([]);
  const [addProductDialog, setAddProductDialog] = useState(false);
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const setIsProductsChanged = useStore((state) => state.setIsProductsChanged);
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const isProductsChanged = useStore((state) => state.getIsProductsChanged());
  // 获取 isProductsChanged 状态
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);


  const handleStateChange = (newState: '全部商品' | '已上架' | '未上架') => {
    setState(newState);
  };

  const handleOpenAddProductDialog = () => {
    // console.log(params.row);
    if (!addProductDialog) {
      setAddProductDialog(true);
    }
    // setProductData(params.row);
  };
  const handleCloseAddProductDialog = () => {
    setAddProductDialog(false);
  };
  const handleIsProductAdd = () => {
    setIsProductsChanged(true);
  };

  const handleOnSelLClick = () => {
    console.log(rowSelectionModel);
    const selectedIds = rowSelectionModel.map((rowId) => rowId); // 获取选中行的 id 数组
    axios.post('/api/product/onSell', { ids: selectedIds })
      .then(response => {
        console.log(response.data.message); // 输出成功的消息
        setIsProductsChanged(true);

        // 执行其他操作...
      })
      .catch(error => {
        console.error('Error performing batch on selling:', error);
        // 处理错误...
      });
  };

  const handleOffSellClick = () => {
    console.log(rowSelectionModel);
    const selectedIds = rowSelectionModel.map((rowId) => rowId); // 获取选中行的 id 数组
    axios.post('/api/product/offSell', { ids: selectedIds })
      .then(response => {
        console.log(response.data.message); // 输出成功的消息
        setIsProductsChanged(true);

        // 执行其他操作...
      })
      .catch(error => {
        console.error('Error performing batch on selling:', error);
        // 处理错误...
      });
  };

  const handleProductsDelete = () => {
    console.log(rowSelectionModel);
    const selectedIds = rowSelectionModel.map((rowId) => rowId);
    axios.post('/api/product/delete', { ids: selectedIds })
      .then(response => {
        console.log(response.data.message); // 输出删除成功的消息
        setIsProductsChanged(true);
      })
      .catch(error => {
        console.error('Error deleting products:', error);
      });
  };
  const fetchData = async () => {
    let result;
    try {
      result = sessionStorage.getItem('productData');
      console.log(result);
      if (result) {
        result = JSON.parse(result);
      } else {
        const response = await axios.get('/api/product');
        result = response.data;
        sessionStorage.setItem('productData', JSON.stringify(result));
      }
      console.log('result', result);
      setData(result);
      setRow(result);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const filterRow = useCallback(() => {
    if (data.length !== 0) {
      let rowTemp = data;

      if (category !== '所有类别') {
        rowTemp = rowTemp.filter((product) => product.category === category);
      }
      if (searchText !== '') {
        rowTemp = rowTemp.filter(
          (product) =>
            product.title.includes(searchText) ||
            product.id.toString().includes(searchText),
        );
      }
      if (state !== '全部商品') {
        console.log(state);
        rowTemp = rowTemp.filter((product) => product.status === state);
      }

      setRow(rowTemp);
    }
  }, [data, searchText, state, category]);


  useEffect(() => {
    fetchData().then();
  }, []);
  useEffect(() => {
    console.log('index', isProductsChanged);
    if (isProductsChanged) {
      sessionStorage.removeItem('productData');
      fetchData().then();
      setIsProductsChanged(false);
      console.log();
    }
  }, [isProductsChanged, setIsProductsChanged]);
  useEffect(() => {
    filterRow();
  }, [filterRow]);

  const getRowHeight = (): number =>
    80 // 设置行的高度为 120
  ;

  // @ts-ignore
  // @ts-ignore
  return (
    <div className='w-full  flex-grow flex flex-col  px-8 py-4 border'>
      <div className='flex  items-center  '>

        <div className='flex-grow text-center'>
          <button className='bg-blue-500 text-white py-2 px-20 rounded-md' type='button'
                  onClick={handleOpenAddProductDialog}>添加商品
          </button>
          {addProductDialog && <AddProductDialog open={addProductDialog} handleClose={handleCloseAddProductDialog}
                                                 isProductAdd={handleIsProductAdd} />}
        </div>
      </div>
      <div className='mt-5 bg-white w-full flex flex-col flex-grow py-4  space-y-4'>
        <div className='flex flex-row justify-between '>
          <div className='relative group   '>
            <Menu items={categoryArr.map((item) => ({ text: item, fc: () => setCategory(item) }))} />
          </div>
          <div className='flex flex-row rounded-md'>
            <button className={state === '全部商品' ? 'bg-blue-500 w-40 text-white rounded-md' : 'bg-gray-200 w-40'}
                    type='button'
                    onClick={() => handleStateChange('全部商品')}>全部商品
            </button>
            <button className={state === '未上架' ? 'bg-blue-500 w-40 text-white rounded-md' : 'bg-gray-200 w-40'}
                    type='button'
                    onClick={() => handleStateChange('未上架')}>未上架
            </button>
            <button className={state === '已上架' ? 'bg-blue-500 w-40 text-white rounded-md' : 'bg-gray-200 w-40'}
                    type='button'
                    onClick={() => handleStateChange('已上架')}>已上架
            </button>

          </div>
        </div>
        <div className='  flex-grow text-center h-96 overflow-auto  '>
          <DataGrid
            rows={row}
            columns={columns}
            // key={(product: Product) => product.id.toString()}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            getRowHeight={getRowHeight} // 设置行高度的函数
            pageSizeOptions={[5, 10]}
            checkboxSelection
            onRowSelectionModelChange={(newRowSelectionModel) => {
              setRowSelectionModel(newRowSelectionModel);
            }}
            rowSelectionModel={rowSelectionModel}
            {...data}
            disableRowSelectionOnClick
          />
        </div>

        <div className='h-10 flex flex-row justify-between items-center'>
          <div className='h-full flex flex-row'>
            <div className='h-full flex items-center justify-center space-x-2'>
              <button className='w-20 h-6 rounded-lg bg-red-500 text-white text-xs tracking-widest'
                      type='button'
                      onClick={handleProductsDelete}>删除
              </button>
              <button className='w-20 h-6 rounded-lg bg-green-500 text-white text-xs tracking-widest'
                      type='button'
                      onClick={handleOnSelLClick}>上架
              </button>
              <button className='w-20 h-6 rounded-lg bg-blue-500 text-white text-xs tracking-widest'
                      type='button'
                      onClick={handleOffSellClick}>下架
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Index;
