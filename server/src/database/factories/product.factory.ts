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
      max: 10000,
    }) * 1_000_0;

  return product;
});
