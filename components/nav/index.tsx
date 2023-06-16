import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SettingsIcon from '@mui/icons-material/Settings';
import { useRouter } from 'next/router';
import { Logout } from '@mui/icons-material';
import LogoutDialog from '../Dialog/logoutDialog'
import { useState } from 'react';

// import
export default function SelectedListItem({currentPage}) {
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const router = useRouter();
  const [open,setOpen]=useState(false);

  const handleClose = () => {
    setOpen(false);
  };



  const handleListItemClick = (
    toPage:string
  ) => {
    router.push(toPage);
  };

  return (
    <div className={'h-screen flex  flex-col justify-between py-6'} style={{width:250}}>
      <div>
        <List component="nav" aria-label="main mailbox folders">

          <ListItemButton
            selected={currentPage === '商品'}
            onClick={(event) => handleListItemClick('/')}
          >
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="商品" />
          </ListItemButton>
          <ListItemButton
            selected={currentPage === '订单'}
            onClick={(event) => handleListItemClick('/order')}
          >
            <ListItemIcon>
              <DraftsIcon />
            </ListItemIcon>
            <ListItemText primary="订单" />
          </ListItemButton>
        </List>
      </div>

      {open&&<LogoutDialog open={open} handleClose={handleClose} />}
      <div className={''}>
        <List component="nav" aria-label="secondary mailbox folder">
          <ListItemButton
            selected={selectedIndex === 2}
            onClick={(event) => handleListItemClick('/setting')}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="设置" />
          </ListItemButton>
          <ListItemButton
            onClick={(event) => setOpen(true)}
          >
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="退出" />
          </ListItemButton>
        </List>

      </div>

    </div>
  );
}