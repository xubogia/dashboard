import React, { FC, useState } from 'react';
import TabContext from '@mui/lab/TabContext';
import Box from '@mui/material/Box';
import TabList from '@mui/lab/TabList';
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import AboutUs from './aboutUs';
import EditPassword from './editPassword';

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
              <Tab label="关于我们" value="1" />
              <Tab label="修改密码" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1" className={value === '1' ? 'w-full grow flex' : 'hidden'}>
            <AboutUs />
          </TabPanel>
          <TabPanel value="2" className={value === '2' ? 'w-full grow flex' : 'hidden'}>
            <EditPassword />
          </TabPanel>
        </TabContext>
      </div>
    </div>
  );
};

export default Index;
