import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState, useEffect, FC } from 'react';
import UploadImage from '@/components/Dialog/uploadImage';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import axios from 'axios';
import useStore from '@/date/store';

interface Product {
  image:string[];
  imageDetail:string[];
  title: string;
  id: number;
  category: string;
  amount: string;
  status: string;
  detail:string;
}

interface newProduct {
  newImage:any[];
  imageDetail:string[];
  image:string[];
  title: string;
  id: number;
  category: string;
  amount: string;
  status: string;
  detail:string
}


interface Pros{
  open:boolean;
  productData:Product;
  handleClose:()=>void;
}

const FormDialog :FC<Pros>= ({ open, productData, handleClose }) => {
  const initialProductData: newProduct = {...productData,newImage:[]}
  const [updatedProductData, setUpdatedProductData] = useState<newProduct>(initialProductData);
  // @ts-ignore
  const setIsProductsChanged = useStore((state) => state.setIsProductsChanged);
  // @ts-ignore
  const getIsProductsChanged = useStore((state) => state.getIsProductsChanged);
  // useEffect(() => {
  //   setUpdatedProductData(productData);
  // }, [productData]);

  useEffect(()=>{
    console.log(updatedProductData);
  },[updatedProductData])
  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setUpdatedProductData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };





  const handleSave = () => {
    console.log(updatedProductData);
    const formData = new FormData();
    formData.append('id',updatedProductData.id.toString());
    formData.append('title', updatedProductData.title);
    formData.append('category', updatedProductData.category);
    formData.append('amount', updatedProductData.amount);
    formData.append('status', updatedProductData.status);
   formData.append('image',updatedProductData.image.join(','));
   formData.append('imageDetail',updatedProductData.imageDetail.join(','));

    updatedProductData.newImage.forEach((file, index) => {
      formData.append(`file${index + 1}`, file);
    });
    console.log('form',formData)


   axios.post('/api/product/edit',formData,{
     headers: {
       'Content-Type': 'multipart/form-data'
     }
   }).then(response=>{
     setIsProductsChanged(true);
     console.log(response.data.message); // 输出删除成功的消息
     console.log('updata',getIsProductsChanged());
     handleClose();
   }).catch(error=>{
     console.error(error);
   })
    console.log(updatedProductData);

  };

  const handleImageChange = (prop:string,imageFiles: any[]) => {
    console.log('imageFiles',imageFiles);
   setUpdatedProductData((prevState) => ({
      ...prevState,
    [prop]: imageFiles
    }));
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>编辑商品</DialogTitle>
        <DialogContent>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <UploadImage name="image" value={updatedProductData} onChange={handleImageChange} />
          </div>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="商品名称"
            type="text"
            name="title"
            value={updatedProductData.title}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            id="category"
            label="商品分类"
            type="text"
            name="category"
            value={updatedProductData.category}
            onChange={handleChange}
            fullWidth
          />
          <FormControl fullWidth margin="dense" >
            <InputLabel htmlFor="status">状态</InputLabel>
            <Select

              label='状态'
              id="status"
              name="status"
              value={updatedProductData.status}
              onChange={handleChange}
            >
              <MenuItem value="已上架">已上架</MenuItem>
              <MenuItem value="未上架">未上架</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            id="amount"
            label="商品金额"
            type="text"
            name="amount"
            value={updatedProductData.amount}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            id="detail"
            label="商品详情"
            type="text"
            name="detail"
            value={updatedProductData.detail}
            onChange={handleChange}
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

export default  React.memo(FormDialog);
