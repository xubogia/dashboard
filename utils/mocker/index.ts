import * as image from './image';
import * as product from './product'
import * as order from './order'
const mocker = {
  image: () => image,
  product:()=>product,
  order:()=>order,
};

export default mocker;
