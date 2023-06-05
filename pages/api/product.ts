// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import mocker from '../../utils/mocker'
interface Product {
  image:string;
  title: string;
  code: number;
  category: string;
  price:number;
  status: string;
}




export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('getting prdoucts')
  const products=mocker.product().getProducts(20);
  return res.status(200).json(products);

}
