import { GetServerSideProps, NextPage } from 'next';
import LoginForm from '@/components/loginForm';
const Home: NextPage = () => {
  return <LoginForm/>
}



export default Home;