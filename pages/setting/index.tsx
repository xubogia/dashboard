import { NextPage } from 'next';

import Layout from '../../layout';
import Right from '../../components/setting';
import getServerSideProps from '../api/verify';

const Home: NextPage = () => <Layout right={Right} currentPage="设置" />;
export { getServerSideProps };
export default Home;
