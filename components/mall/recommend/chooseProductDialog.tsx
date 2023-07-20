import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState, FC, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import columns from './chooseProductDialogColumn';
import useStore from '../../../date/store';

interface EachDetail {
  image: string;
  imageDetail: string;
  size: string[];
}
interface Product {
  eachDetail: EachDetail[];
  title: string;
  id: number;
  category: string;
  status: string;
  detail: string[];
  recommend: string;
}

interface Pros {
  open: boolean;
  orderData: Product[];
  handleClose: () => void;
}

const FormDialog: FC<Pros> = ({ open, orderData, handleClose }) => {
  const [updatedProductData, setUpdatedProductData] = useState<Product[]>(orderData);
  const [productsChange, setProductsChange] = useState<Map<number, string>>(new Map());
  const setIsProductsChanged = useStore((state: any) => state.setIsProductsChanged);

  useEffect(() => {
    console.log(updatedProductData);
  }, [updatedProductData]);

  const handleCellClick = (item: any) => {
    if (item.field === 'recommend') {
      const itemStatus = item.row.recommend;

      const newStatus = itemStatus === '显示' ? '不显示' : '显示';
      console.log(newStatus);
      const itemId = item.row.id;
      const productsChangeTemp = productsChange;
      productsChangeTemp.set(itemId, newStatus);
      setProductsChange(productsChangeTemp);
      const updatedData = updatedProductData.map((row) =>
        row.id === item.id ? { ...row, recommend: newStatus } : row
      );
      setUpdatedProductData(updatedData);
    }
  };
  const handleSave = () => {
    console.log(productsChange);
    const productsChangeArr: any[] = [];
    // @ts-ignore
    productsChange.forEach(([key, value]) => {
      console.log(key, value);
      const item = { id: key, newRecommend: value };
      productsChangeArr.push(item);
    });
    axios.post('/api/recommend/edit', productsChangeArr).then((res) => {
      console.log(res.data);
    });
    setIsProductsChanged(true);
    handleClose();
  };

  return (
    <div>
      <Dialog fullWidth open={open} onClose={handleClose}>
        <DialogTitle>选择商品</DialogTitle>

        <DialogContent>
          <DataGrid
            // sx={{ width: '600px' }}
            className="grow"
            rows={updatedProductData}
            columns={columns}
            getRowHeight={() => 80}
            pageSizeOptions={[5, 10]}
            disableRowSelectionOnClick
            onCellClick={handleCellClick}
            // rowSelectionModel={rowSelectionModel}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            // ...其他属性...
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
