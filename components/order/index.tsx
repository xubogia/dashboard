import { FC, useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid';
import Menu from '../menu';
import columns from './columns';
import AddOrderDialog from '../dialog/order/addOrderDialog';
import useStore from '../../date/store';

interface Order {
  image: string;
  id: number;
  status: string;
  amount: number;
  name: string;
  phone: string;
  address: string;
  time: string;
}

const categoryArr = ['所有类别', '已发货', '已完成', '需退货'];
const Index: FC<{ searchText: string }> = ({ searchText }) => {
  const [data, setData] = useState<Order[]>([]);
  const [row, setRow] = useState<Order[]>([]);
  const [category, setCategory] = useState('所有类别');

  const [isAddOrderDialogOpen, setIsAddOrderDialogOpen] = useState(false);
  const setIsProductsChanged = useStore((state: any) => state.setIsProductsChanged);
  const isProductsChanged = useStore((state: any) => state.getIsProductsChanged());
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

  const handleOpenAddOrderDialog = () => {
    if (!isAddOrderDialogOpen) {
      setIsAddOrderDialogOpen(true);
    }
  };
  const handleCloseAddOrderDialog = () => {
    setIsAddOrderDialogOpen(false);
  };

  const handleIsOrdersChange = () => {
    setIsProductsChanged(true);
  };

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
    fetchData().then();
  }, []);

  useEffect(() => {
    if (isProductsChanged) {
      sessionStorage.removeItem('orderData');
      fetchData().then();
      setIsProductsChanged(false);
    }
  }, [isProductsChanged, setIsProductsChanged]);

  useEffect(() => {
    if (data.length !== 0) {
      let rowTemp = data;
      if (category !== '所有类别') {
        rowTemp = rowTemp.filter((product) => product.status === category);
      }
      if (searchText !== '') {
        rowTemp = rowTemp.filter((product) =>
          Object.values(product).some((value) => value.toString().includes(searchText))
        );
      }
      setRow(rowTemp);
    }
  }, [data, searchText, category]);

  const handleProductsDelete = () => {
    const selectedIds = rowSelectionModel.map((rowId) => rowId);
    if (selectedIds.length === 0) return;
    axios
      .post('/api/order/delete', { ids: selectedIds })
      .then((response) => {
        console.log(response.data.message); // 输出删除成功的消息
        setIsProductsChanged(true);
      })
      .catch((error) => {
        console.error('Error deleting orders:', error);
      });
  };

  return (
    <div className="w-full  flex-grow flex flex-col  px-8 py-4">
      <div className="bg-white w-full flex flex-col flex-grow py-4 space-y-10">
        <div className="flex items-center justify-between">
          <Menu
            choose={(categoryItem: string) => setCategory(categoryItem)}
            items={categoryArr}
            delete={() => {}}
          />
          <div className={' '}>
            <button
              className="w-60 bg-red-800 justify-center items-center py-2 rounded-lg text-white"
              type="button"
              onClick={handleOpenAddOrderDialog}
            >
              添加订单
            </button>
            {isAddOrderDialogOpen && (
              <AddOrderDialog
                open={isAddOrderDialogOpen}
                handleClose={handleCloseAddOrderDialog}
                isOrderAdd={handleIsOrdersChange}
                categoryArr={categoryArr}
              />
            )}
          </div>
        </div>
        <div className=" w-full flex flex-col  flex-grow text-center h-96 overflow-auto">
          <DataGrid
            rows={row}
            columns={columns}
            // key={(product: Product) => product.id.toString()}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            getRowHeight={() => 120} // 设置行高度的函数
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
                onClick={handleProductsDelete}
                disabled={rowSelectionModel.length === 0}
              >
                删除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
