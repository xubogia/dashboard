import { NextPage } from 'next';
import Layout from '../layout';
import Right from '../components/home';

const Home: NextPage = () => <Layout right={<Right />} />;

export default Home;
