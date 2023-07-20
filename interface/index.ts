export interface EachDetail {
  image: string;
  imageDetail: string;
  size: string[];
  amount: [];
}
export interface Product {
  eachDetail: EachDetail[];
  title: string;
  id: number;
  category: string;
  status: string;
  detail: string[];
  recommend: string;
}
export interface NewProduct {
  eachDetail: EachDetail[];
  title: string;
  id: number;
  category: string;
  status: string;
  detail: string[];
  newImage: any[];
  newDetailImage: any[];
}
