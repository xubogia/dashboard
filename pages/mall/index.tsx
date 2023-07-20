import { NextPage } from 'next';
import Layout from '../../layout';
import Right from '../../components/mall';

const Home: NextPage = () => <Layout right={Right} currentPage="商城" />;

export default Home;
