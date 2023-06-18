import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useState, FC } from 'react';
import Image from 'next/image';
import ClickAwayListener from '@mui/material/ClickAwayListener';

interface Prop{
  open:boolean;
  image:string;
  handleClose:()=>void;
}
const Index:FC<Prop> = ({ open, image, handleClose }) => {

  const handleClickAway = () => {
    if (open) {
      handleClose();
    }
  };




  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <ClickAwayListener onClickAway={handleClickAway}>
          <div className="flex flex-row ">
            <DialogContent>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <Image src={image} alt='商品图片' width={400} height={400} />

              </div>
            </DialogContent>
          </div>
        </ClickAwayListener>
      </Dialog>
    </div>
  );
};

export default React.memo(Index);
