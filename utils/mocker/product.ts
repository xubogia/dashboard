import { faker } from '@faker-js/faker';
import { getImage } from './image';

interface Product {
  image:string[];
  title: string;
  id: number;
  category: string;
  amount: string;
  status: string;
}
const statusArr=['已上架','未上架'];
function getRandomElement(array: any[]) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

export function getProducts(number:number){
  let products=[]

  for (let i = 0; i < number; i++) {
    let images=[];
    for (let j = 0; j < 5; j++) {
      let imageTemp=getImage(100,100);
      images.push(imageTemp);
    }
    const product:Product={
      image: images,
      title: faker.lorem.words(),
      id: faker.number.int({min:1,max:999}),
      category: faker.lorem.words(1),
      amount: parseFloat(faker.finance.amount()).toFixed(2),
      status: getRandomElement(statusArr),
    }
    products.push(product);
  }
  return products;
}