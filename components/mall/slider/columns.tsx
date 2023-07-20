import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import useStore from '../../../date/store';
import ImageDialog from '../../dialog/image/imageToLargerDialog';

const ImageCell = (params: GridRenderCellParams<any, any, any>) => (
  <Image src={params.value} alt="商品图片" width={60} height={60} />
);

const OperatorCell = (params: GridRenderCellParams<any, any, any>) => {
  // @ts-ignore
  const setIsProductsChanged = useStore((state) => state.setIsProductsChanged);
  // @ts-ignore
  const getIsProductsChanged = useStore((state) => state.getIsProductsChanged);
  const [previewImage, setPreviewImage] = useState(false);
  const handleOpen = () => {
    console.log(params.value);
    setPreviewImage(true);
  };

  const handleClose = () => {
    setPreviewImage(false);
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
    // console.log(isProductsChanged)
  };

  return (
    <div className="flex flex-row justify-end ">
      <span className="sm:ml-3">
        {previewImage && (
          <ImageDialog open={previewImage} image={params.value} handleClose={handleClose} />
        )}
        <button
          type="button"
          onClick={handleOpen}
          className="inline-flex items-center rounded-md bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          查看
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

  // {
  //   field: 'status',
  //   headerName: '状态',
  //   flex: 1,
  //   renderCell: StautsCell,
  // },

  {
    field: 'operator',
    flex: 1,
    headerName: '操作',
    renderCell: OperatorCell,
  },
];

export default columns;
