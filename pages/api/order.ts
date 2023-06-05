// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import mocker from '../../utils/mocker';

interface Order{
  ID:number;
  state:string;
  amount:number;
  name:number;
  phone:string;
  address:string;
  time:string;
}


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('getting orders')
  const oreders=mocker.order().getOrders(30);
  return res.status(200).json(oreders);

}
