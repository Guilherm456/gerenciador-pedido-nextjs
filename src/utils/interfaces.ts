export interface ProductsProps {
  name: string;
  description?: string;
  price: number;
  quantity?: number;
}

export interface UserProps {
  name: string;
  telephone: string;
  genre: string;
  birthday: string;
  address: {
    street: string;
    number: string;
    district: string;
    reference?: string;
  }[];
}
