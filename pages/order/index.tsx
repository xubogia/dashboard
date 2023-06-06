import { NextPage } from 'next';
import Layout from '../../layout';
import Right from '../../components/order/temp'
const Home: NextPage = () => <Layout  right={Right} currentPage={'订单'} />;

export default Home;
