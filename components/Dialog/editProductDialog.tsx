import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState,  FC, useCallback } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import axios from 'axios';
// @ts-ignore
import throttle from 'lodash/throttle';
import UploadImage from './uploadImage';
import useStore from '../../date/store';

interface EachDetail {
  image:string;
  imageDetail:string;
  size:string[]
}
interface Product {
  eachDetail:EachDetail[];
  title: string;
  id: number;
  category: string;
  amount: string;
  status: string;
  detail: string;
}
interface NewProduct {
  eachDetail:EachDetail[];
  title: string;
  id: number;
  category: string;
  amount: string;
  status: string;
  detail: string;
  newImage: any[];
}

interface Pros {
  open: boolean;
  productData: Product;
  handleClose: () => void;
}


const FormDialog: FC<Pros> = ({ open, productData, handleClose }) => {
  const initialProductData: NewProduct = { ...productData, newImage: [] };
  const [updatedProductData, setUpdatedProductData] = useState<NewProduct>(initialProductData);
  // @ts-ignore
  const setIsProductsChanged = useStore((state) => state.setIsProductsChanged);
  // @ts-ignore
  const getIsProductsChanged = useStore((state) => state.getIsProductsChanged);


  const inputThrottle = (name:string,value:any) => {
    setUpdatedProductData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
// 在事件处理程序中使用节流函数
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChange = useCallback(throttle(inputThrottle, 1000), [updatedProductData]);


  const handleSave = () => {
    const formData = new FormData();
    formData.append('id', updatedProductData.id.toString());
    formData.append('title', updatedProductData.title);
    formData.append('category', updatedProductData.category);
    formData.append('amount', updatedProductData.amount);
    formData.append('status', updatedProductData.status);
    formData.append('detail', updatedProductData.detail);
    const eachDetailJSON=JSON.stringify(updatedProductData.eachDetail);
    formData.append('eachDetail',eachDetailJSON);



    // formData.append('image', updatedProductData.image.join(','));
    // formData.append('imageDetail', updatedProductData.imageDetail.join(','));

    // const sizeTemp=JSON.stringify(updatedProductData.size);
    // formData.append('size',sizeTemp);
    // console.log(sizeTemp);

    updatedProductData.newImage.forEach((file, index) => {
      formData.append(`file${index + 1}`, file);
    });
    console.log('form', formData);
    console.log(updatedProductData);

    axios.post('/api/product/edit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(response => {
      setIsProductsChanged(true);
      console.log(response.data.message); // 输出删除成功的消息
      console.log('updata', getIsProductsChanged());
      handleClose();
    }).catch(error => {
      console.error(error);
    });


  };

  // const handleImageChange = (prop: string, imageFiles: any[]) => {
  //   setUpdatedProductData((prevState) => ({
  //     ...prevState,
  //     [prop]: imageFiles,
  //   }));
  // };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>编辑商品</DialogTitle>
        <DialogContent>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <UploadImage value={updatedProductData} onChange={handleChange} />
          </div>
          <TextField
            autoFocus
            margin='dense'
            id='name'
            label='商品名称'
            type='text'
            name='title'
            value={updatedProductData.title}
            onChange={event => handleChange(event.target.name,event.target.value)}
            fullWidth
          />
          <TextField
            margin='dense'
            id='category'
            label='商品分类'
            type='text'
            name='category'
            value={updatedProductData.category}
            onChange={event => handleChange(event.target.name,event.target.value)}
            fullWidth
          />
          <FormControl fullWidth margin='dense'>
            <InputLabel htmlFor='status'>状态</InputLabel>
            <Select

              label='状态'
              id='status'
              name='status'
              value={updatedProductData.status}
              onChange={event => handleChange(event.target.name,event.target.value)}
            >
              <MenuItem value='已上架'>已上架</MenuItem>
              <MenuItem value='未上架'>未上架</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin='dense'
            id='amount'
            label='商品金额'
            type='text'
            name='amount'
            value={updatedProductData.amount}
            onChange={event => handleChange(event.target.name,event.target.value)}
            fullWidth
          />
          <TextField
            margin='dense'
            id='detail'
            label='商品详情'
            type='text'
            name='detail'
            value={updatedProductData.detail}
            onChange={event => handleChange(event.target.name,event.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          <Button onClick={handleSave}>保存</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default React.memo(FormDialog);
