import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import axios from 'axios';
import useStore from '../../../date/store';
import { ImageCell } from '../../dataGrip/cell';

const OperatorCell = (params: GridRenderCellParams<any, any, any>) => {
  // @ts-ignore
  const setIsProductsChanged = useStore((state) => state.setIsProductsChanged);

  const handleDelete = () => {
    const productsChangeArr = [{ id: params.row.id, newRecommend: '不显示' }];
    const ids = [];
    ids.push(params.id);
    axios.post('/api/recommend/edit', productsChangeArr).then((res) => {
      console.log(res.data);
    });
    setIsProductsChanged(true);
  };

  return (
    <div className="flex flex-row ">
      <span className="sm:ml-3">
        <button
          type="button"
          onClick={handleDelete}
          className="inline-flex items-center rounded-md bg-red-800 px-2 py-1 text-sm font-semibold text-white shadow-sm "
        >
          删除
        </button>
      </span>
    </div>
  );
};

const columns: GridColDef[] = [
  {
    field: 'eachDetail',
    headerName: '图片',
    flex: 1,
    renderCell: ImageCell,
  },
  {
    field: 'title',
    headerName: '名称',
    flex: 1,
  },

  {
    field: 'operator',
    flex: 1,
    headerName: '操作',
    renderCell: OperatorCell,
  },
];

export default columns;
