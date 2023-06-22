import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SettingsIcon from '@mui/icons-material/Settings';
import { useRouter } from 'next/router';
import { Logout } from '@mui/icons-material';
import { FC, useState } from 'react';
import Image from 'next/image';
import LogoutDialog from '../Dialog/logoutDialog';
import HuiHe from '@/asset/image/huihe.jpg';

// import
const Index: FC<{ currentPage: string }> = ({ currentPage }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };


  const handleListItemClick = (
    toPage: string,
  ) => {
    router.push(toPage).then();
  };

  return (
    <div className=' flex border-l rounded-l-lg  bg-red-900 text-white  flex-col  ' style={{ width: 250 }}>

        <List component='nav' aria-label='main mailbox folders' className='p-4 mt-4 '>

          <ListItemButton
            // selected={currentPage === '商品'}
            onClick={() => handleListItemClick('/')}
            className={`${currentPage === '商品' ? ' text-yellow-100 font-bold' : 'text-white'}`}
          >
            <ListItemIcon>
              <InboxIcon className='text-white' />
            </ListItemIcon>
            <ListItemText primary='商品' />
          </ListItemButton>
          <ListItemButton
            selected={currentPage === '订单'}
            onClick={() => handleListItemClick('/order')}
          >
            <ListItemIcon>
              <DraftsIcon className='text-white' />
            </ListItemIcon>
            <ListItemText primary='订单' />
          </ListItemButton>

          <ListItemButton
            selected={currentPage === '设置'}
            onClick={() => handleListItemClick('/setting')}
          >
            <ListItemIcon>
              <SettingsIcon className='text-white' />
            </ListItemIcon>
            <ListItemText primary='设置' />
          </ListItemButton>
          <ListItemButton
            onClick={() => setOpen(true)}
          >
            <ListItemIcon>
              <Logout className='text-white' />
            </ListItemIcon>
            <ListItemText primary='退出' />
          </ListItemButton>

        </List>

      {open && <LogoutDialog open={open} handleClose={handleClose} />}

    </div>
  );
};
export default Index;