import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState, FC, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import UploadImage from './uploadImage';

interface NewProduct {
  newImage: File[];
  image: File[];
  imageDetail: string[];
  title: string;
  category: string;
  amount: string;
  status: string;
  detail: string;
}

interface Props {
  open: boolean;
  handleClose: () => void;
  isProductAdd: () => void;
}

const categoryArr = ['拳套', '拳击绑带', '速度靶', '其他'];

const FormDialog: FC<Props> = ({ open, handleClose, isProductAdd }) => {
  const initialProductData: NewProduct = {
    image: [],
    imageDetail: [],
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
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setProductData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

  };

  const handleAddImage = (prop: string, imageFiles: any[]) => {
    console.log('imageFiles', imageFiles);
    setProductData((prevState) => ({
      ...prevState,
      [prop]: imageFiles,
    }));
  };

  const handleSaveProduct = () => {
    console.log(productData);
    const formData = new FormData();
    formData.append('title', productData.title);
    formData.append('category', productData.category);
    formData.append('amount', productData.amount);
    formData.append('status', productData.status);
    formData.append('imageDetail', productData.imageDetail.join(','));
    formData.append('detail', productData.detail);

    productData.image.forEach((file, index) => {
      formData.append(`${productData.imageDetail[index]}`, file);
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
          <UploadImage value={{ image: [], imageDetail: productData.imageDetail }}
                       onChange={handleAddImage} />
          <TextField
            autoFocus
            margin='dense'
            id='name'
            label='商品名称'
            type='text'
            name='title'
            value={productData.title}
            onChange={handleChange}
            fullWidth
          />
          <FormControl fullWidth margin='dense'>
            <InputLabel htmlFor='status'>分类</InputLabel>
            <Select

              label='状态'
              id='status'
              name='category'
              value={productData.category}
              onChange={handleChange}
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
              onChange={handleChange}
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
            onChange={handleChange}
            fullWidth
          />

          <TextField
            margin='dense'
            id='detail'
            label='商品详情'
            type='text'
            name='detail'
            value={productData.detail}
            onChange={handleChange}
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
