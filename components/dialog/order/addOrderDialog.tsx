import React, { useState, FC, useCallback } from 'react';
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
import Image from 'next/image';

interface ValidationErrors {
  [key: string]: string;
}

interface NewOrder {
  title: string;
  color: string;
  size: string;
  amount: string;
  status: string;
  name: string;
  phone: string;
  address: string;
  newImage: any;
}

interface Props {
  open: boolean;
  handleClose: () => void;
  isOrderAdd: () => void;
  categoryArr: string[];
}

const FormDialog: FC<Props> = ({ open, handleClose, isOrderAdd, categoryArr }) => {
  const initialOrderData: NewOrder = {
    title: '',
    color: '',
    size: '',
    amount: '',
    status: '',
    name: '',
    phone: '',
    address: '',
    newImage: null,
  };

  const [orderData, setOrderData] = useState<NewOrder>(initialOrderData);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [newCategory, setNewCategory] = useState('');
  const [status, setStatus] = useState<string[]>(categoryArr);
  const [imageItem, setImageItem] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChange = useCallback(
    throttle((name: string, value: any) => {
      // setValidationErrors([]); // 清空之前的错误信息
      setOrderData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }, 200), // 设置节流的时间间隔，例如 200 毫秒
    []
  );

  const addNewCategory = () => {
    const newCategoryArrTemp = [...status, newCategory];
    setStatus(newCategoryArrTemp);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSaveOrder = useCallback(
    debounce(async () => {
      try {
        const schema = yup.object().shape({
          title: yup.string().required('商品名称是必填项'),
          status: yup.string().required('状态是必填项'),
          amount: yup.string().required('商品金额是必填项'),
          name: yup.string().required('收货人是必填项'),
          phone: yup.string().required('收货人号码是必填项'),
          address: yup.string().required('收货人是必填项'),
          color: yup.string().required('颜色是必填项'),
          size: yup.string().required('尺寸是必填项'),
        });
        if (!orderData.newImage) {
          console.log('no file');
          return;
        }

        await schema.validate(orderData, { abortEarly: false });

        const formData = new FormData();
        formData.append('title', orderData.title);
        formData.append('amount', orderData.amount);
        formData.append('status', orderData.status);
        formData.append('size', orderData.size);
        formData.append('color', orderData.color);
        formData.append('name', orderData.name);
        formData.append('phone', orderData.phone);
        formData.append('address', orderData.address);
        formData.append('file', orderData.newImage[0]);

        const response = await axios.post('/api/order/add', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(response.data);
        isOrderAdd();
        handleClose();
      } catch (error) {
        console.log(error);
        const errors: Record<string, string> = {};
        if (error instanceof yup.ValidationError) {
          error.inner.forEach((err) => {
            errors[err.path as string] = err.message;
          });
          setValidationErrors(errors);
        }
        console.log(errors);
      }
    }, 300),
    [orderData, isOrderAdd, handleClose, setValidationErrors]
  );

  const handleImageUpload = (event: any) => {
    const { files } = event.target;
    handleChange('newImage', files);
    const uploadImage = (file: File) => {
      const reader: FileReader = new FileReader();
      reader.onloadend = () => {
        setImageItem(reader.result as string);
      };

      if (file) {
        reader.readAsDataURL(file);
      }
    };

    for (let i = 0; i < files.length; i++) {
      uploadImage(files[i]);
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>添加商品</DialogTitle>
        <DialogContent>
          <div className="flex flex-row  justify-between py-2">
            <div className=" w-48  flex flex-col space-y-5 items-center">
              {imageItem === '' && !orderData.newImage ? (
                <div className="w-full h-48 flex flex-col justify-between border border-red-500">
                  <div />
                  <div className="w-full text-right text-red-400 text-sm ">选择一张图片</div>
                </div>
              ) : (
                <Image src={imageItem} alt="订单图片" width={200} height={200} />
              )}
              <label htmlFor="image-upload">
                <Button variant="contained" component="span">
                  选择图片
                </Button>
                <input
                  accept="image/*"
                  className="hidden"
                  id="image-upload"
                  type="file"
                  multiple
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            <div className="flex flex-col space-y-4 relative text-xs">
              <TextField
                margin="dense"
                id="color"
                label="颜色"
                type="text"
                name="color"
                error={Boolean(validationErrors.color)}
                required
                onChange={(event) => {
                  handleChange(event.target.name, event.target.value);
                }}
                fullWidth
              />

              <TextField
                margin="dense"
                id="amount"
                label="商品金额"
                type="text"
                name="amount"
                required
                onChange={(event) => handleChange(event.target.name, event.target.value)}
                fullWidth
                error={Boolean(validationErrors.amount)}
              />

              <FormControl fullWidth margin="dense">
                <InputLabel htmlFor="size">尺寸</InputLabel>
                <Select
                  label="尺寸"
                  id="size"
                  name="size"
                  error={Boolean(validationErrors.size)}
                  required
                  value={orderData.size}
                  onChange={(event) => {
                    handleChange(event.target.name, event.target.value);
                  }}
                  renderValue={(selected) => (
                    <div className="">
                      <span>{selected}</span>
                    </div>
                  )}
                >
                  <MenuItem value="S">S</MenuItem>
                  <MenuItem value="M">M</MenuItem>
                  <MenuItem value="XL">XL</MenuItem>
                  <MenuItem value="2XL">2XL</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TextField
              margin="dense"
              id="name"
              label="商品名称"
              type="text"
              name="title"
              required
              onChange={(event) => handleChange(event.target.name, event.target.value)}
              error={Boolean(validationErrors.title)}
            />

            <FormControl fullWidth margin="dense">
              <InputLabel htmlFor="status">状态</InputLabel>
              <Select
                label="状态"
                id="status"
                name="status"
                value={orderData.status}
                required
                onChange={(event) => handleChange(event.target.name, event.target.value)}
                error={Boolean(validationErrors.status)}
              >
                {status.map((category) => (
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

            <TextField
              margin="dense"
              id="name"
              label="收货人"
              type="text"
              name="name"
              required
              onChange={(event) => handleChange(event.target.name, event.target.value)}
              error={Boolean(validationErrors.name)}
            />
            <TextField
              margin="dense"
              id="phone"
              label="收货手机号"
              type="text"
              name="phone"
              required
              onChange={(event) => handleChange(event.target.name, event.target.value)}
              error={Boolean(validationErrors.phone)}
            />
          </div>
          <TextField
            margin="dense"
            id="address"
            label="收货地址"
            type="text"
            name="address"
            required
            onChange={(event) => handleChange(event.target.name, event.target.value)}
            fullWidth
            error={Boolean(validationErrors.address)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          <Button onClick={handleSaveOrder}>确认</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default React.memo(FormDialog);
