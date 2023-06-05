import { faker } from '@faker-js/faker';

export function getImage(width:number,height:number):string{
  return faker.image.url({width:100,height:100});
}

