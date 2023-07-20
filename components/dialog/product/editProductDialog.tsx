import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState, FC, useCallback, useEffect } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import axios from 'axios';
// @ts-ignore
import throttle from 'lodash/throttle';
import * as yup from 'yup';
import UploadImage from './uploadImage';
import useStore from '../../../date/store';
import UploadDetailImage from './uploadDetaiImage';

interface EachDetail {
  image: string;
  imageDetail: string;
  size: string[];
  amount: [];
}

interface Product {
  eachDetail: EachDetail[];
  title: string;
  id: number;
  category: string;
  status: string;
  detail: string[];
}

interface NewProduct {
  eachDetail: EachDetail[];
  title: string;
  id: number;
  category: string;
  status: string;
  detail: string[];
  newImage: any[];
  newDetailImage: any[];
}

interface Pros {
  open: boolean;
  orderData: Product;
  handleClose: () => void;
}

interface ValidationErrors {
  [key: string]: string;
}

const FormDialog: FC<Pros> = ({ open, orderData, handleClose }) => {
  const newImage: any[] = [];
  for (let i = 0; i < orderData.eachDetail.length; i++) {
    newImage.push(null);
  }
  const newDetailImage = [];
  for (let i = 0; i < orderData.detail.length; i++) {
    newDetailImage.push(null);
  }
  const initialProductData: NewProduct = {
    ...orderData,
    newImage,
    newDetailImage,
  };

  const [updateProductData, setUpdateProductData] = useState<NewProduct>(initialProductData);

  const [categoryArrTemp, setCategoryArrTemp] = useState<string[]>([]);
  // @ts-ignore
  const setIsProductsChanged = useStore((state) => state.setIsProductsChanged);
  // @ts-ignore
  const getIsProductsChanged = useStore((state) => state.getIsProductsChanged);

  const fetchCategory = async () => {
    const categorysJson = sessionStorage.getItem('categoryData');
    if (categorysJson !== null) {
      const categorys = JSON.parse(categorysJson) as string[];
      setCategoryArrTemp(categorys);
    } else {
      const response = await axios.get('/api/product/category/get');
      const categorys = response.data;
      sessionStorage.setItem('categoryData', JSON.stringify(categorys));
      setCategoryArrTemp(categorys);
    }
  };
  useEffect(() => {
    fetchCategory().then();
  }, []);

  const [validationErrors, setValidationErrors] = useState({});

  const inputThrottle = (name: string, value: any) => {
    setUpdateProductData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log(value);
  };
  // 在事件处理程序中使用节流函数
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChange = useCallback(throttle(inputThrottle, 1000), [updateProductData]);

  const handleSave = () => {
    const schema = yup.object().shape({
      title: yup.string().required('商品名称是必填项'),
      category: yup.string().required('分类是必填项'),
      status: yup.string().required('状态是必填项'),
      // detail: yup.string().required('商品详情是必填项'),
      eachDetail: yup
        .array()
        .of(
          yup.object().shape({
            imageDetail: yup.string().required('颜色是必填项'),
            size: yup.array().min(1, '至少选择一个尺寸'),
          })
        )
        .required('至少需要一个商品详情'),
    });

    schema
      .validate(updateProductData, { abortEarly: false })
      .then((validData) => {
        // 输入数据有效，继续进行保存逻辑
        console.log('有效的数据:', validData);
        const formData = new FormData();
        formData.append('id', updateProductData.id.toString());
        formData.append('title', updateProductData.title);
        formData.append('category', updateProductData.category);
        formData.append('status', updateProductData.status);
        formData.append('detail', JSON.stringify(updateProductData.detail));
        const eachDetailJSON = JSON.stringify(updateProductData.eachDetail);
        formData.append('eachDetail', eachDetailJSON);

        let newProductImageCount = 0;
        updateProductData.newImage.forEach((file, index) => {
          if (file !== null) {
            newProductImageCount++;
            formData.append(`productImage${index + 1}`, file);
          }
        });
        formData.append('newProductImageCount', newProductImageCount.toString());

        updateProductData.newDetailImage.forEach((file, index) => {
          formData.append(`detailImage${index + 1}`, file);
        });
        console.log('form', formData);
        console.log(updateProductData);

        axios
          .post('/api/product/edit', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((response) => {
            setIsProductsChanged(true);
            console.log(response.data.message); // 输出删除成功的消息
            console.log('update', getIsProductsChanged());
            handleClose();
            setIsProductsChanged(true);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((validationErrorsTemp) => {
        // 输入数据无效，保存错误信息并进行渲染
        const errors: ValidationErrors = {};
        validationErrorsTemp.inner.forEach((error: any) => {
          errors[error.path] = error.message;
        });
        console.log(errors);
        setValidationErrors(errors);
      });
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>编辑商品</DialogTitle>
        <DialogContent>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <UploadImage
              value={updateProductData}
              onChange={handleChange}
              validationError={validationErrors}
            />
          </div>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="商品名称"
            type="text"
            name="title"
            value={updateProductData.title}
            onChange={(event) => handleChange(event.target.name, event.target.value)}
            fullWidth
          />
          <FormControl fullWidth margin="dense">
            <InputLabel htmlFor="status">分类</InputLabel>
            <Select
              label="状态"
              id="status"
              name="category"
              value={updateProductData.category}
              required
              onChange={(event) => handleChange(event.target.name, event.target.value)}
            >
              {categoryArrTemp.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel htmlFor="status">状态</InputLabel>
            <Select
              label="状态"
              id="status"
              name="status"
              value={updateProductData.status}
              onChange={(event) => handleChange(event.target.name, event.target.value)}
            >
              <MenuItem value="已上架">已上架</MenuItem>
              <MenuItem value="未上架">未上架</MenuItem>
            </Select>
          </FormControl>
          <UploadDetailImage
            value={updateProductData}
            onChange={handleChange}
            validationError={validationErrors}
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
