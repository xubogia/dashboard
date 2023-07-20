import React, { FC, useState } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import SetSlider from './slider';
import Recommend from './recommend';

const Index: FC = () => {
  const [value, setValue] = useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <div className="grow flex ">
      <div className="w-full  m-10  rounded-lg flex flex-col border">
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="轮播图" value="1" />
              <Tab label="推荐" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1" className={value === '1' ? 'w-full grow flex' : 'hidden'}>
            <SetSlider />
          </TabPanel>
          <TabPanel value="2" className={value === '2' ? 'w-full grow flex' : 'hidden'}>
            <Recommend />
          </TabPanel>
        </TabContext>
      </div>
    </div>
  );
};

export default Index;
