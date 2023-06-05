import { NextPage } from 'next';
import Layout from '../../layout';
import Right from '../../components/order'
const Home: NextPage = () => <Layout isPrivate={false}  right={<Right />} />;

export default Home;
