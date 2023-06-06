import { faker } from '@faker-js/faker';
import { getImage } from '@/utils/mocker/image';

interface Order {
  image:string
  id: number;
  state: string;
  amount: number;
  name: string;
  phone: string;
  address: string;
  time: string;
}

const stateArr:string[] = ['待支付', '已支付', '已发货', '已完成'];
const addressArr = ['123 Main St', '456 Elm St', '789 Oak St'];

function getRandomElement(array: any[]):string {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

export function getOrders(number = faker.number.int({ min: 10, max: 30 })): Order[] {
  const orders: Order[] = [];

  for (let i = 0; i < number; i++) {
    const order: Order = {
      image: getImage(100,100),
      id: faker.number.int({max:999}),
      state: getRandomElement(stateArr),
      amount: faker.number.int({max:9999}),
      name: faker.lorem.words(2),
      phone: faker.phone.number(),
      address: getRandomElement(addressArr),
      time: faker.date.recent().toISOString(),
    };

    orders.push(order);
  }

  return orders;
}
