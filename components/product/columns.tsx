import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import Dialog from '../Dialog/editProductDialog';
import ImageDialog from '../Dialog/imageDialog';
import useStore from '../../date/store';

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
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div className="relative" onClick={handleOpen}>
      <Image src={params.value[0].image} alt='商品图片' width={40} height={40} />
      {previewImage && <ImageDialog open={previewImage} images={params.value} handleClose={handleClose} />}
    </div>
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
  const handleProductDelete = () => {
    const ids = [];
    ids.push(params.id);
    axios.post('/api/product/delete', { ids })
      .then(response => {
        setIsProductsChanged(true);
        console.log(response.data.message); // 输出删除成功的消息
        console.log('column', getIsProductsChanged());
      })
      .catch(error => {
        console.error('Error deleting products:', error);
      });
    // console.log(isProductsChanged)
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div className="flex flex-row ">
        <span className='hidden sm:block'>
        <button type='button'
                onClick={handleEditClick}
                className='inline-flex items-center rounded-md bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'>
        编辑
        </button>
        </span>


      <span className='sm:ml-3'>
      <button type='button'
              onClick={handleProductDelete}
              className='inline-flex items-center rounded-md bg-red-800 px-2 py-1 text-sm font-semibold text-white shadow-sm '>

        删除
        </button>
        </span>
      {
        open && <Dialog open={open} productData={params.row} handleClose={handleClose} />
      }

    </div>
  );
};

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

  },
  {
    field: 'status',
    headerName: '状态',
    flex: 1,

  },
  {
    field: 'amount', headerName: '价格',
    flex: 1,

  },
  {
    field: 'category',
    headerName: '分类',
    flex: 1,

  },
  {
    field:'detail',
    headerName:'商品详情',
    flex:1,
  },
  {
    field: 'operator',
    flex: 1,
    headerName: '操作',
    renderCell: OperatorCell,
  },
];

export default columns;
