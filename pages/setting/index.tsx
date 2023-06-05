import { NextPage } from 'next';
import Layout from '../../layout';
import Right from '../../components/setting'
const Home: NextPage = () => <Layout isPrivate={false}  right={<Right />} />;

export default Home;
