import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import useStore from '../../date/store';
import Dialog from '../dialog/order/editorOrderDialog';
import ImageDialog from '../dialog/image/imageToLargerDialog';
import { ProductCell, AmountCell, UserDetailCell } from '../dataGrip/cell';

const ImageCell = (params: GridRenderCellParams<any, any, any>) => {
  const [previewImage, setPreviewImage] = useState(false);

  const handleOpen = () => {
    console.log(params.value);
    setPreviewImage(true);
  };

  const handleClose = () => {
    setPreviewImage(false);
  };

  return (
    <button className="relative" onClick={handleOpen} type="button">
      <Image src={params.value} alt="商品图片" width={60} height={60} />
      {previewImage && (
        <ImageDialog open={previewImage} image={params.value} handleClose={handleClose} />
      )}
    </button>
  );
};

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
  const handleDelete = () => {
    const ids = [];
    ids.push(params.id);
    axios
      .post('/api/order/delete', { ids })
      .then((response) => {
        setIsProductsChanged(true);
        console.log(response.data.message); // 输出删除成功的消息
        console.log('column', getIsProductsChanged());
      })
      .catch((error) => {
        console.error('Error deleting order:', error);
      });
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
          修改
        </button>
      </span>

      <span className="sm:ml-3">
        <button
          type="button"
          onClick={handleDelete}
          className="inline-flex items-center rounded-md bg-red-800 px-2 py-1 text-sm font-semibold text-white shadow-sm "
        >
          删除
        </button>
      </span>
      {open && <Dialog open={open} orderData={params.row} handleClose={handleClose} />}
    </div>
  );
};

const columns: GridColDef[] = [
  {
    field: 'image',
    headerName: '图片',
    renderCell: ImageCell,
    flex: 1,
  },
  {
    field: 'productDetail',
    headerName: '商品信息',
    renderCell: ProductCell,
    flex: 1,
  },
  {
    field: 'status',
    headerName: '状态',
    flex: 1,
  },
  {
    field: 'amount',
    headerName: '金额',
    flex: 1,
    renderCell: AmountCell,
  },
  {
    field: 'userDetail',
    headerName: '收货信息',
    renderCell: UserDetailCell,
    flex: 1,
  },
  {
    field: 'time',
    headerName: '时间',
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
