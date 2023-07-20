import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState, FC, useCallback } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
// @ts-ignore
import throttle from 'lodash/throttle';
import axios from 'axios';
import * as yup from 'yup';
import { debounce } from 'lodash';
import useStore from '../../../date/store';

interface Order {
  image: string;
  id: number;
  title: string;
  color: string;
  size: string;
  status: string;
  amount: number;
  name: string;
  phone: string;
  address: string;
  time: string;
}

interface Pros {
  open: boolean;
  orderData: Order;
  handleClose: () => void;
}

interface ValidationErrors {
  phone: string;
  address: string;
  status: string;
  size: string;
  amount: number;
  name: string;
  color: string;
}

const status = ['所有类别', '已发货', '已完成', '需退货'];
const FormDialog: FC<Pros> = ({ open, orderData, handleClose }) => {
  const [updatedProductData, setUpdatedProductData] = useState<Order>(orderData);
  // @ts-ignore
  const setIsProductsChanged = useStore((state) => state.setIsProductsChanged);
  // @ts-ignore
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChange = useCallback(
    throttle((name: string, value: any) => {
      setUpdatedProductData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      console.log(updatedProductData);
    }, 100),
    [updatedProductData]
  );

  const handleSaveOrder = debounce(async () => {
    console.log(updatedProductData);
    try {
      const schema = yup.object().shape({
        status: yup.string().required('状态是必填项'),
        amount: yup.string().required('商品金额是必填项'),
        name: yup.string().required('收货人是必填项'),
        phone: yup.string().required('收货人号码是必填项'),
        address: yup.string().required('收货人是必填项'),
        color: yup.string().required('颜色是必填项'),
        size: yup.string().required('尺寸是必填项'),
      });

      await schema.validate(updatedProductData, { abortEarly: false });
      console.log(updatedProductData);
      const response = await axios.post('/api/order/edit', updatedProductData);
      console.log(response.data);
      setIsProductsChanged(true);
      handleClose();
      console.log(response.data);
    } catch (error) {
      const errors: Record<string, string> = {};
      if (error instanceof yup.ValidationError) {
        error.inner.forEach((err) => {
          errors[err.path as string] = err.message;
        });
        // @ts-ignore
        setValidationErrors(errors);
      }
      console.log(errors);
    }
  }, 1000);

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>编辑订单</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel htmlFor="status">状态</InputLabel>
            <Select
              label="状态"
              id="status"
              name="status"
              value={updatedProductData.status}
              required
              onChange={(event) => handleChange(event.target.name, event.target.value)}
              // error={Boolean(validationErrors.status)}
            >
              {status.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            margin="dense"
            id="color"
            label="颜色"
            type="text"
            name="color"
            required
            fullWidth
            value={updatedProductData.color}
            onChange={(event) => handleChange(event.target.name, event.target.value)}
            error={Boolean(validationErrors?.color)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel htmlFor="size">尺寸</InputLabel>
            <Select
              label="尺寸"
              id="size"
              name="size"
              error={Boolean(validationErrors?.size)}
              required
              value={updatedProductData.size}
              onChange={(event) => handleChange(event.target.name, event.target.value)}
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
          <TextField
            margin="dense"
            id="name"
            label="收货人"
            type="text"
            name="name"
            required
            fullWidth
            value={updatedProductData.name}
            onChange={(event) => handleChange(event.target.name, event.target.value)}
            error={Boolean(validationErrors?.name)}
          />
          <TextField
            margin="dense"
            id="phone"
            label="收货手机号"
            type="text"
            name="phone"
            required
            fullWidth
            value={updatedProductData.phone}
            onChange={(event) => handleChange(event.target.name, event.target.value)}
            error={Boolean(validationErrors?.phone)}
          />
          <TextField
            margin="dense"
            id="address"
            label="收货地址"
            type="text"
            name="address"
            required
            value={updatedProductData.address}
            onChange={(event) => handleChange(event.target.name, event.target.value)}
            fullWidth
            error={Boolean(validationErrors?.address)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          <Button onClick={handleSaveOrder}>保存</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default React.memo(FormDialog);
