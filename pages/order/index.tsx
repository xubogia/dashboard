import { NextPage } from 'next';

import Layout from '../../layout';
import Right from '../../components/order';
import Main from '../../layout/main';
import getServerSideProps from '../api/verify';

const Order = () => <Main Right={Right} />;
const Home: NextPage = () => <Layout right={Order} currentPage="订单" />;
export { getServerSideProps };

export default Home;
