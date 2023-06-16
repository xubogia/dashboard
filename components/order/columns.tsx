import { GridColDef, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid';
import { useState } from 'react';
import Image from 'next/image';
import ImageDialog from '@/components/Dialog/imageDialog';

const ImageCell = (params: GridRenderCellParams<any, any, any>) => {
  const [isHovered, setIsHovered] = useState(false);
  const [previewImage, setPreviewImage] = useState(false);


  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleOpen = () => {
    console.log(params.value);
    setPreviewImage(true);
  };

  const handleClose = () => {
    setPreviewImage(false);
  };

  return (
    <div className={'relative'} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleOpen}>
      <Image src={params.value[0] as string} alt='商品图片' width={40} height={40} />
      {isHovered && (
        <div className={'fixed top-20 left-80 '}>
          <Image src={params.value[0] as string} alt='放大的图片' width={400} height={400} />
        </div>
      )}
      {previewImage && <ImageDialog open={open} productData={params.value} handleClose={handleClose} />}
    </div>
  );
};

const columns: GridColDef[] = [
  {
    field: 'image',
    headerName: '图片',
    renderCell: ImageCell,
  },
  { field: 'id', headerName: 'id', width: 70 },
  {
    field: 'state',
    headerName: 'state',
    width: 90,
  },
  { field: 'amount', headerName: 'amount', width: 130 },
  {
    field: 'name',
    headerName: '收货人',
    width: 160,
  },
  {
    field: 'phone',
    headerName: '手机',
    width: 160,
  },
  {
    field: 'address',
    headerName: '地址',
    width: 160,
  },
  {
    field: 'time',
    headerName: '时间',
    width: 160,
  },

];

export default columns;