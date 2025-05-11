import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { ProductModel } from 'src/product/models/product.model';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(ProductModel, (faker) => {
  const product = new ProductModel();

  product.name = faker.commerce.productName();
  product.description = faker.commerce.productDescription();
  product.isPublish = true;
  product.priceInMicroUsdc =
    faker.number.int({
      min: 1,
      max: 10,
    }) * LAMPORTS_PER_SOL;

  return product;
});
