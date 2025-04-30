export type IProductWithoutSensitiveData = {
  seller?: {
    id: string;
    name: string;
  };
  uuid: string;
  name: string;
  priceInLamport: number;
};
