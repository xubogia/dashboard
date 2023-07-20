import { GridRenderCellParams } from '@mui/x-data-grid';
import { useState } from 'react';
import Image from 'next/image';
import ImageDialog from '../../dialog/image/imageDialog';

export const ImageCell = (params: GridRenderCellParams<any, any, any>) => {
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
      <Image src={params.value[0].image} alt="商品图片" width={40} height={40} />
      {previewImage && (
        <ImageDialog open={previewImage} images={params.value} handleClose={handleClose} />
      )}
    </div>
  );
};

export const ProductCell = (params: GridRenderCellParams<any, any, any>) => (
  <div className="text-start space-y-1">
    <div className="font-semibold">{params.row.title}</div>
    <div className="flex flex-row space-x-1">
      <div>{params.row.color},</div>
      <div>{params.row.size}</div>
    </div>
  </div>
);

export const UserDetailCell = (params: GridRenderCellParams<any, any, any>) => (
  <div className="w-full text-left space-y-1">
    <div className="font-semibold ">{params.row.name}</div>
    <div className="">{params.row.phone}</div>
    <div className="break-words whitespace-normal">{params.row.address}</div>
  </div>
);

export const AmountCell = (params: GridRenderCellParams<any, any, any>) => (
  <div className="w-full text-left space-y-1">
    <div className="">x {params.row.count}</div>
    <div className="">{params.row.amount}</div>
  </div>
);
