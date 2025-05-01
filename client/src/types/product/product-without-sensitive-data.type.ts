export type IProductWithoutSensitiveData = {
  uuid: string;
  name: string;
  description: string;
  priceInLamport: number;
  seller?: {
    id: string;
    name: string;
  };
};
