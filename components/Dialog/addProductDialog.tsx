import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState, FC, useEffect, useCallback } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
// @ts-ignore
import throttle from 'lodash/throttle';
import UploadImage from './uploadImage';

interface EachDetail {
  image:string;
  imageDetail:string;
  size:string[]
}
interface NewProduct {
  eachDetail:EachDetail[];
  title: string;
  category: string;
  amount: string;
  status: string;
  detail: string;
  newImage: any[];
}

interface Props {
  open: boolean;
  handleClose: () => void;
  isProductAdd: () => void;
}

const categoryArr = ['拳套', '拳击绑带', '速度靶', '其他'];

const FormDialog: FC<Props> = ({ open, handleClose, isProductAdd }) => {
  const initialProductData: NewProduct = {
    eachDetail:[],
    title: '',
    category: '',
    amount: '',
    status: '',
    detail: '',
    newImage: [],
  };

  const [productData, setProductData] = useState<NewProduct>(initialProductData);

  useEffect(() => {
    console.log(productData);
  }, [productData]);
  const inputThrottle = (name:string,value:any) => {
    setProductData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
// 在事件处理程序中使用节流函数
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChange = useCallback(throttle(inputThrottle, 1000), [productData]);


  const handleSaveProduct = () => {
    console.log(productData);
    const formData = new FormData();
    formData.append('title', productData.title);
    formData.append('category', productData.category);
    formData.append('amount', productData.amount);
    formData.append('status', productData.status);
    formData.append('detail', productData.detail);
    const eachDetailJSON=JSON.stringify(productData.eachDetail);
    formData.append('eachDetail',eachDetailJSON);
    productData.newImage.forEach((file, index) => {
      formData.append(`$file${index}`, file);
    });

    axios.post('/api/product/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => {
        // 处理响应
        console.log(response.data);
        isProductAdd();
        handleClose();
      })
      .catch(error => {
        // 处理错误
        console.error(error);
      });
  };


  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>添加商品</DialogTitle>

        <DialogContent>
          <UploadImage value={productData}
                       onChange={handleChange} />
          <TextField
            autoFocus
            margin='dense'
            id='name'
            label='商品名称'
            type='text'
            name='title'
            value={productData.title}
            onChange={event => handleChange(event.target.name,event.target.value)}
            fullWidth
          />
          <FormControl fullWidth margin='dense'>
            <InputLabel htmlFor='status'>分类</InputLabel>
            <Select

              label='状态'
              id='status'
              name='category'
              value={productData.category}
              onChange={event => handleChange(event.target.name,event.target.value)}
            >
              {categoryArr.map((category) => <MenuItem value={category}>{category}</MenuItem>)}

            </Select>
          </FormControl>
          <FormControl fullWidth margin='dense'>
            <InputLabel htmlFor='status'>状态</InputLabel>
            <Select

              label='状态'
              id='status'
              name='status'
              value={productData.status}
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
            value={productData.amount}
            onChange={event => handleChange(event.target.name,event.target.value)}
            fullWidth
          />

          <TextField
            margin='dense'
            id='detail'
            label='商品详情'
            type='text'
            name='detail'
            value={productData.detail}
            onChange={event => handleChange(event.target.name,event.target.value)}
            fullWidth
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          <Button onClick={handleSaveProduct}>确认</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default React.memo(FormDialog);
