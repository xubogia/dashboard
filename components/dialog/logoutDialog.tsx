import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { FC } from 'react';
import { useRouter } from 'next/router';

interface Pros {
  open: boolean;
  handleClose: () => void;
}
const Index: FC<Pros> = ({ open, handleClose }) => {
  const router = useRouter();
  const handleLogoutClick = () => {
    // 清除存储用户身份验证信息的令牌（如Cookie）
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    // 假设您的令牌的Cookie名称为'token'

    // 执行其他必要的操作，如重定向到登录页面或清除用户相关的本地存储数据
    // 重定向到登录页面
    router.push('/login').then();
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <div className="w-96 ">
          <DialogContent>
            <DialogContentText margin="dense">确定要退出当前用户吗？</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>取消</Button>
            <Button onClick={handleLogoutClick}>确定</Button>
          </DialogActions>
        </div>
      </Dialog>
    </div>
  );
};
export default Index;
