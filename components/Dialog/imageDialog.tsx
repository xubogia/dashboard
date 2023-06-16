import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useState, FC } from 'react';
import Image from 'next/image';
import ClickAwayListener from '@mui/material/ClickAwayListener';

interface Prop{
  open:boolean;
  images:[];
  handleClose:()=>void;
}
const Index:FC<Prop> = ({ open, images, handleClose }) => {
  const [imageTemp, setImageTemp] = useState(0);


  const handleClickAway = () => {
    if (open) {
      handleClose();
    }
  };

  const handlePreOne = () => {
    if (imageTemp !== 0) {
      let pre = imageTemp - 1;
      setImageTemp(pre);
      console.log(imageTemp);

    }

  };
  const handleNextOne = () => {
    if (imageTemp < images.length - 1) {
      let next = imageTemp + 1;
      setImageTemp(next);
      console.log(imageTemp);
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <ClickAwayListener onClickAway={handleClickAway}>
          <div className={'flex flex-row '}>
            <Button onClick={handlePreOne}>上一张</Button>
            <DialogContent>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <Image src={images[imageTemp]} alt='商品图片' width={400} height={400} />

              </div>
              <div className={'text-center'}>{(imageTemp + 1) + '/' + images.length}</div>
            </DialogContent>
            <Button onClick={handleNextOne}>下一张</Button>
          </div>
        </ClickAwayListener>
      </Dialog>
    </div>
  );
};

export default React.memo(Index);
