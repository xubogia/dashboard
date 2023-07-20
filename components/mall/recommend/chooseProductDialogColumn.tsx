import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { ImageCell } from '../../dataGrip/cell';

const RecommendCell = (params: GridRenderCellParams<any, any, any>) => (
  <div>
    <FormGroup>
      <FormControlLabel
        control={<Switch checked={params.value === '显示'} />}
        label={params.value === '显示' ? '显示' : '不显示'}
      />
    </FormGroup>
  </div>
);

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
    field: 'recommend',
    headerName: '展示',
    flex: 1,
    renderCell: RecommendCell,
  },
];

export default columns;
