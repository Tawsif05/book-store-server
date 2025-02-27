export type TBook = {
  title: string;
  author: string;
  price: number;
  category: string;
  description: string;
  imgUrl?: string | unknown;
  quantity: number;
  inStock: boolean;
};
