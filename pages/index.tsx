import { NextPage } from 'next';
import Layout from '../layout';
import Right from '../components/home/temp';

const Home: NextPage = () => <Layout  right={Right} currentPage={'商品'} />;

export default Home;
