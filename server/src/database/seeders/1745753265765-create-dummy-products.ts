import { ProductModel } from 'src/product/models/product.model';
import { SellerModel } from 'src/user/models/seller.model';
import { DataSource, In } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class CreateDummyProducts1745753265765 implements Seeder {
  track = false;

  private readonly sellerPublicKeys = [
    '5ZqJV6Jv2cdn34jMUmyDe9kr81i98R1uUELjKP3fabF4',
    '8QWwxoteMcgNhEbwXZWGbmGeG2BzHkPEoiJw6scPFrAt',
  ];

  private readonly numberOfProductPerSeller = 6;

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const sellers = await dataSource.manager.find(SellerModel, {
      where: {
        user: {
          publicKey: In(this.sellerPublicKeys),
        },
      },
      relations: {
        user: true,
      },
    });

    const savedProducts = [] as ProductModel[];
    const factory = factoryManager.get(ProductModel);

    for (const seller of sellers) {
      const products = await factory.saveMany(this.numberOfProductPerSeller, {
        seller,
      });

      savedProducts.push(...products);
    }

    console.log('========== Created Products ==========');
    savedProducts.forEach((product) => {
      console.log(`[${product.uuid}] ${product.name}`);
    });
  }
}
