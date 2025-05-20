export type IProductWithoutSensitiveData = {
  uuid: string;
  name: string;
  description: string;
  priceInMicroUsdc: number;
  availableQuantity: number;
  seller?: {
    id: string;
    name: string;
  };
};
