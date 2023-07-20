import { FC, useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid';
import columns from './columns';
import AddProductDialog from '../dialog/product/addProductDialog';
import useStore from '../../date/store';
import Menu from '../menu';

interface EachDetail {
  image: string;
  imageDetail: string;
  size: string[];
}
interface Product {
  eachDetail: EachDetail[];
  title: string;
  id: number;
  category: string;
  amount: string;
  status: string;
  detail: string[];
}

interface Pros {
  searchText: string;
}

const Index: FC<Pros> = ({ searchText }) => {
  const [state, setState] = useState<'全部商品' | '已上架' | '未上架'>('全部商品');
  const [category, setCategory] = useState('所有类别');
  const [data, setData] = useState<Product[]>([]);
  const [row, setRow] = useState<Product[]>([]);
  const [addProductDialog, setAddProductDialog] = useState(false);
  const [categoryArr, setCategoryArr] = useState<string[]>([]);
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const setIsProductsChanged = useStore((state) => state.setIsProductsChanged);
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const isProductsChanged = useStore((state) => state.getIsProductsChanged());
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

  const fetchData = async () => {
    let products;
    let categorys;
    try {
      products = sessionStorage.getItem('productData');
      categorys = sessionStorage.getItem('categoryData');
      if (products && categorys) {
        products = JSON.parse(products);
        categorys = JSON.parse(categorys);
      } else {
        let response = await axios.get('/api/product');
        products = response.data;
        sessionStorage.setItem('productData', JSON.stringify(products));
        response = await axios.get('/api/product/category/get');
        categorys = response.data;
        sessionStorage.setItem('categoryData', JSON.stringify(categorys));
        setCategoryArr(categorys);
      }
      setCategoryArr(categorys);
      setData(products);
      setRow(products);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData().then();
  }, []);

  const handleStateChange = (newState: '全部商品' | '已上架' | '未上架') => {
    setState(newState);
  };

  const handleOpenAddProductDialog = () => {
    if (!addProductDialog) {
      setAddProductDialog(true);
    }
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
    if (selectedIds.length === 0) return;
    axios
      .post('/api/product/onSell', { ids: selectedIds })
      .then((response) => {
        console.log(response.data.message); // 输出成功的消息
        setIsProductsChanged(true);

        // 执行其他操作...
      })
      .catch((error) => {
        console.error('Error performing batch on selling:', error);
        // 处理错误...
      });
  };

  const handleOffSellClick = () => {
    console.log(rowSelectionModel);
    const selectedIds = rowSelectionModel.map((rowId) => rowId); // 获取选中行的 id 数组
    if (selectedIds.length === 0) return;
    axios
      .post('/api/product/offSell', { ids: selectedIds })
      .then((response) => {
        console.log(response.data.message); // 输出成功的消息
        setIsProductsChanged(true);

        // 执行其他操作...
      })
      .catch((error) => {
        console.error('Error performing batch on selling:', error);
        // 处理错误...
      });
  };

  const handleProductsDelete = () => {
    const selectedIds = rowSelectionModel.map((rowId) => rowId);
    if (selectedIds.length === 0) return;
    axios
      .post('/api/product/delete', { ids: selectedIds })
      .then((response) => {
        console.log(response.data.message); // 输出删除成功的消息
        setIsProductsChanged(true);
      })
      .catch((error) => {
        console.error('Error deleting products:', error);
      });
  };

  useEffect(() => {
    if (data.length !== 0) {
      let rowTemp = data;

      if (category !== '所有类别') {
        rowTemp = rowTemp.filter((product) => product.category === category);
      }
      if ((rowTemp !== null && searchText) !== '') {
        console.log(rowTemp);
        rowTemp = rowTemp.filter((product) =>
          Object.values(product).some((value) => value?.toString().includes(searchText))
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
    console.log('index', isProductsChanged);
    if (isProductsChanged) {
      sessionStorage.removeItem('productData');
      sessionStorage.removeItem('categoryData');
      fetchData().then();
      setIsProductsChanged(false);
    }
  }, [isProductsChanged, setIsProductsChanged]);

  const deleteCategory = async (categoryItem: string) => {
    console.log('delete', categoryItem);
    axios.post('/api/product/category/delete', { category: categoryItem }).then((response) => {
      console.log(response.data);
      setIsProductsChanged(true);
    });
  };

  return (
    <div className="w-full  flex-grow flex flex-col  px-8 py-4 ">
      <div className="flex  items-center  ">
        <div className="flex-grow text-center">
          <button
            className="bg-red-800 text-white py-2 px-20 rounded-md"
            type="button"
            onClick={handleOpenAddProductDialog}
          >
            添加商品
          </button>
          {addProductDialog && (
            <AddProductDialog
              open={addProductDialog}
              handleClose={handleCloseAddProductDialog}
              isProductAdd={handleIsProductAdd}
              categoryArr={categoryArr}
            />
          )}
        </div>
      </div>
      <div className="mt-5 bg-white w-full flex flex-col flex-grow py-4  space-y-4">
        <div className="flex flex-row justify-between ">
          <div className="relative group   ">
            <Menu
              choose={(categoryItem: string) => setCategory(categoryItem)}
              items={categoryArr}
              delete={deleteCategory}
            />
          </div>
          <div className="flex flex-row rounded-md">
            <button
              className={
                state === '全部商品' ? 'bg-red-800 w-40 text-white rounded-md' : 'bg-gray-200 w-40'
              }
              type="button"
              onClick={() => handleStateChange('全部商品')}
            >
              全部商品
            </button>
            <button
              className={
                state === '未上架' ? 'bg-red-800 w-40 text-white rounded-md' : 'bg-gray-200 w-40'
              }
              type="button"
              onClick={() => handleStateChange('未上架')}
            >
              未上架
            </button>
            <button
              className={
                state === '已上架' ? 'bg-red-800 w-40 text-white rounded-md' : 'bg-gray-200 w-40'
              }
              type="button"
              onClick={() => handleStateChange('已上架')}
            >
              已上架
            </button>
          </div>
        </div>
        <div className=" h-96 flex-grow text-center  overflow-auto  ">
          <DataGrid
            rows={row}
            columns={columns}
            // key={(product: Product) => product.id.toString()}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            getRowHeight={() => 80} // 设置行高度的函数
            pageSizeOptions={[5, 10]}
            checkboxSelection
            onRowSelectionModelChange={(newRowSelectionModel) => {
              setRowSelectionModel(newRowSelectionModel);
            }}
            rowSelectionModel={rowSelectionModel}
            disableRowSelectionOnClick
          />
        </div>

        <div className="h-10 flex flex-row justify-between items-center">
          <div className="h-full flex flex-row">
            <div className="h-full flex items-center justify-center space-x-2">
              <button
                className={
                  rowSelectionModel.length === 0
                    ? `w-20 h-6 rounded-lg bg-red-300 text-white text-xs tracking-widest`
                    : `w-20 h-6 rounded-lg bg-red-500 text-white text-xs tracking-widest`
                }
                type="button"
                disabled={rowSelectionModel.length === 0}
                onClick={handleProductsDelete}
              >
                删除
              </button>
              <button
                className={
                  rowSelectionModel.length === 0
                    ? `w-20 h-6 rounded-lg bg-green-300 text-white text-xs tracking-widest`
                    : `w-20 h-6 rounded-lg bg-green-500 text-white text-xs tracking-widest`
                }
                type="button"
                disabled={rowSelectionModel.length === 0}
                onClick={handleOnSelLClick}
              >
                上架
              </button>
              <button
                className={
                  rowSelectionModel.length === 0
                    ? `w-20 h-6 rounded-lg bg-blue-300 text-white text-xs tracking-widest`
                    : `w-20 h-6 rounded-lg bg-blue-500 text-white text-xs tracking-widest`
                }
                type="button"
                disabled={rowSelectionModel.length === 0}
                onClick={handleOffSellClick}
              >
                下架
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
