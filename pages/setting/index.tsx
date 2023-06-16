import { NextPage } from 'next';
import Layout from '../../layout';
import Right from '../../components/setting'

const Home: NextPage = () => <Layout  right={<Right />} currentPage='设置' />;

export default Home;
