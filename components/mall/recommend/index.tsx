import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import axios from 'axios';
import columns from './column';
import RecommendShow from './recommendShow';
import Dialog from './chooseProductDialog';
import useStore from '../../../date/store';

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
  recommend: string;
}
const Index = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<Product[]>([]);
  const [dataRecommend, setDataRecommend] = useState<any[]>([]);
  const setIsProductsChanged = useStore((state: any) => state.setIsProductsChanged);
  const isProductsChanged = useStore((state: any) => state.getIsProductsChanged());
  const fetchData = async () => {
    let products;

    try {
      products = sessionStorage.getItem('productData');
      console.log(products);
      if (products) {
        products = JSON.parse(products);
      } else {
        const response = await axios.get('/api/product');
        products = response.data;
        sessionStorage.setItem('productData', JSON.stringify(products));
      }
      console.log('result', products);
      setData(products);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    console.log('index', isProductsChanged);
    if (isProductsChanged) {
      sessionStorage.removeItem('productData');
      fetchData().then();
      setIsProductsChanged(false);
    }
  }, [isProductsChanged, setIsProductsChanged]);

  useEffect(() => {
    fetchData().then();
  }, []);

  useEffect(() => {
    console.log(data);
    const dateTemp = data.filter((dateItem) => dateItem.recommend === '显示');
    setDataRecommend(dateTemp);
  }, [data]);
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="w-full grow flex flex-row  ">
      <div className="w-1/2  flex flex-col space-y-4  ">
        <button
          className="bg-red-800 text-white py-2 w-32 rounded-md"
          onClick={() => setOpen(true)}
          type="button"
        >
          选择商品
        </button>
        {open && <Dialog open={open} orderData={data} handleClose={handleClose} />}
        <div className="w-full grow h-96 overflow-auto bg-gray-50">
          <DataGrid
            rows={dataRecommend}
            columns={columns}
            getRowHeight={() => 100}
            pageSizeOptions={[5, 10]}
            // ...其他属性...
          />
        </div>
      </div>
      <div className="grow">
        <RecommendShow data={dataRecommend} />
      </div>
    </div>
  );
};
export default Index;
