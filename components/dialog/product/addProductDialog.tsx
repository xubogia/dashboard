import React, { useState, FC, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import * as yup from 'yup';
import { throttle, debounce } from 'lodash';
import UploadImage from './uploadImage';

interface EachDetail {
  image: string;
  imageDetail: string;
  size: string[];
  amount: string[];
}

interface NewProduct {
  eachDetail: EachDetail[];
  title: string;
  category: string;
  status: string;
  detail: any[];
  newImage: any[];
}

interface ValidationErrors {
  [key: string]: string;
}

interface Props {
  open: boolean;
  handleClose: () => void;
  isProductAdd: () => void;
  categoryArr: string[];
}

const FormDialog: FC<Props> = ({ open, handleClose, isProductAdd, categoryArr }) => {
  const initialProductData: NewProduct = {
    eachDetail: [],
    title: '',
    category: '拳套',
    status: '已上架',
    detail: [],
    newImage: [],
  };

  const [productData, setProductData] = useState<NewProduct>(initialProductData);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [newCategory, setNewCategory] = useState('');
  const [categoryArrTemp, setCategoryArrTemp] = useState<string[]>(categoryArr);
  const [detailImages, setDetailImages] = useState<string[]>([]);
  useEffect(() => {
    console.log(productData);
  }, [productData]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChange = useCallback(
    throttle((name: string, value: any) => {
      // setValidationErrors([]); // 清空之前的错误信息
      setProductData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }, 200), // 设置节流的时间间隔，例如 200 毫秒
    []
  );

  const addNewCategory = () => {
    const newCategoryArrTemp = [...categoryArrTemp, newCategory];
    setCategoryArrTemp(newCategoryArrTemp);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSaveProduct = useCallback(
    debounce(async () => {
      const schema = yup.object().shape({
        title: yup.string().required('商品名称是必填项'),
        category: yup.string().required('分类是必填项'),
        status: yup.string().required('状态是必填项'),
        detail: yup
          .array()
          .test('fileRequired', '商品详情是必填项', (value) => value && value.length > 0),
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

      try {
        await schema.validate(productData, { abortEarly: false });
        console.log('有效的数据:', productData);

        const formData = new FormData();
        formData.append('title', productData.title);
        formData.append('category', productData.category);
        formData.append('status', productData.status);
        // @ts-ignore

        const eachDetailJSON = JSON.stringify(productData.eachDetail);
        formData.append('eachDetail', eachDetailJSON);
        productData.newImage.forEach((file, index) => {
          formData.append(`$file${index}`, file);
        });

        productData.detail.forEach((file, index) => {
          formData.append(`$detail${index}`, file);
        });

        const response = await axios.post('/api/product/add', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (!categoryArr.includes(productData.category)) {
          console.log('new category');
          const addCategoryResult = await axios.post('api/product/category/add', {
            newCategory: productData.category,
          });
          console.log(addCategoryResult);
        }
        console.log(response.data);
        isProductAdd();
        handleClose();
      } catch (error) {
        console.log(error);
        const errors: Record<string, string> = {};
        (error as yup.ValidationError).inner.forEach((err) => {
          errors[err.path as string] = err.message;
        });
        console.log(errors);
        setValidationErrors(errors);
      }
    }, 300),
    [productData]
  );

  const handleImageUpload = (event: any) => {
    const { files } = event.target;
    // const uploadedImageFiles = [...imageFiles, ...files];
    // setImageFiles(uploadedImageFiles);
    const detailImageFilesTemp = [...productData.detail, ...files];
    handleChange('detail', detailImageFilesTemp);
    const uploadImage = (file: File) => {
      const reader: FileReader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const detailImageTemps = [...detailImages];
          detailImageTemps.push(reader.result);
          setDetailImages(detailImageTemps);
        }
      };

      if (file) {
        reader.readAsDataURL(file);
      }
    };

    for (let i = 0; i < files.length; i++) {
      uploadImage(files[i]);
    }
  };

  const handleRemoveDetailImage = (index: number) => {
    const detailImageTemps = [...detailImages];
    detailImageTemps.splice(index, 1);
    setDetailImages(detailImageTemps);
    const productDataTemp = productData.detail;
    productDataTemp.splice(index, 1);
    handleChange('detail', productDataTemp);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>添加商品</DialogTitle>
        <DialogContent>
          <UploadImage
            value={productData}
            onChange={handleChange}
            validationError={validationErrors}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="商品名称"
            type="text"
            name="title"
            required
            value={productData.title}
            onChange={(event) => handleChange(event.target.name, event.target.value)}
            fullWidth
            error={Boolean(validationErrors.title)}
          />
          {/* <p className="w-96 h-5 text-sm text-red-400 font-semibold">{validationErrors}</p> */}
          <FormControl fullWidth margin="dense">
            <InputLabel htmlFor="status">分类</InputLabel>
            <Select
              label="状态"
              id="status"
              name="category"
              value={productData.category}
              required
              onChange={(event) => handleChange(event.target.name, event.target.value)}
            >
              {categoryArrTemp.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
              <div className="flex flex-row mx-2 space-x-2 py-2 ">
                <button type="button" className="" onClick={addNewCategory}>
                  +
                </button>
                <input
                  placeholder="其他"
                  className="border-black px-2"
                  onChange={(event) => setNewCategory(event.target.value)}
                />
              </div>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel htmlFor="status">状态</InputLabel>
            <Select
              label="状态"
              id="status"
              name="status"
              required
              value={productData.status}
              onChange={(event) => handleChange(event.target.name, event.target.value)}
            >
              <MenuItem value="已上架">已上架</MenuItem>
              <MenuItem value="未上架">未上架</MenuItem>
            </Select>
          </FormControl>
          <label htmlFor="detailImage-upload">
            <Button
              variant="contained"
              component="span"
              className="w-40 my-4 h-10  border bg-red-700 rounded-lg text-white  text-sm text-center"
            >
              选择商品详情图片
            </Button>
            <input
              accept="image/*"
              className="hidden"
              id="detailImage-upload"
              type="file"
              multiple
              onChange={handleImageUpload}
            />
          </label>
          {detailImages.map((detailImage, index) => (
            <div className="flex flex-row space-x-2">
              <Image src={detailImage} alt="Uploaded" width={500} height={500} />
              <button type="button" onClick={() => handleRemoveDetailImage(index)}>
                X
              </button>
            </div>
          ))}
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
