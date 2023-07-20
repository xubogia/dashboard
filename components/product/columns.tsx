import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useState } from 'react';
import axios from 'axios';
import Dialog from '../dialog/product/editProductDialog';
import useStore from '../../date/store';
import { ImageCell } from '../dataGrip/cell';

const OperatorCell = (params: GridRenderCellParams<any, any, any>) => {
  const [open, setOpen] = useState(false);
  // @ts-ignore
  const setIsProductsChanged = useStore((state) => state.setIsProductsChanged);
  // @ts-ignore
  const getIsProductsChanged = useStore((state) => state.getIsProductsChanged);

  const handleEditClick = () => {
    if (!open) {
      setOpen(true);
    }
    // setProductData(params.row);
  };
  const handleProductDelete = () => {
    const ids = [];
    ids.push(params.id);
    axios
      .post('/api/product/delete', { ids })
      .then((response) => {
        setIsProductsChanged(true);
        console.log(response.data.message); // 输出删除成功的消息
        console.log('column', getIsProductsChanged());
      })
      .catch((error) => {
        console.error('Error deleting products:', error);
      });
    // console.log(isProductsChanged)
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div className="flex flex-row ">
      <span className="hidden sm:block">
        <button
          type="button"
          onClick={handleEditClick}
          className="inline-flex items-center rounded-md bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          编辑
        </button>
      </span>

      <span className="sm:ml-3">
        <button
          type="button"
          onClick={handleProductDelete}
          className="inline-flex items-center rounded-md bg-red-800 px-2 py-1 text-sm font-semibold text-white shadow-sm "
        >
          删除
        </button>
      </span>
      {open && <Dialog open={open} orderData={params.row} handleClose={handleClose} />}
    </div>
  );
};

const StatusCell = (params: GridRenderCellParams<any, any, any>) => (
  <div className={(params.row.status as string) === '已上架' ? 'text-red-700  ' : ' '}>
    {params.row.status}
  </div>
);

const TitleCell = (params: GridRenderCellParams<any, any, any>) => (
  <div className="w-full pr-4 text-start   whitespace-normal overflow-wrap-break-word">
    {params.row.title}
  </div>
);

const columns: GridColDef[] = [
  {
    field: 'eachDetail',
    headerName: '图片',
    flex: 1,
    renderCell: ImageCell,
  },
  {
    field: 'title',
    headerName: '名称',
    flex: 1,
    renderCell: TitleCell,
  },

  {
    field: 'status',
    headerName: '状态',
    flex: 1,
    renderCell: StatusCell,
  },

  {
    field: 'category',
    headerName: '分类',
    flex: 1,
  },
  // {
  //   field: 'detail',
  //   headerName: '商品详情',
  //   flex: 1,
  // },
  {
    field: 'id',
    headerName: '商品编号',
    flex: 1,
  },
  {
    field: 'operator',
    flex: 1,
    headerName: '操作',
    renderCell: OperatorCell,
  },
];

export default columns;
