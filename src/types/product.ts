export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  images?: string[];
  artisanId: string;
  artisanName: string;
  status: string;
  category?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
};
