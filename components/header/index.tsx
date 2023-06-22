import { FC } from 'react';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment } from '@mui/material';

interface Props {
  setSearchText: (text: string) => void;
}
const Index: FC<Props> =({setSearchText})=>(
    <div className='w-full items-center  px-10  py-2 shadow '>
      <div className=''>
        <TextField
          onChange={(event)=>setSearchText(event.target.value)}
          placeholder="搜索"
          variant="standard"
          size="small"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            disableUnderline: true,
          }}

        />
      </div>


    </div>
  )
export default Index;