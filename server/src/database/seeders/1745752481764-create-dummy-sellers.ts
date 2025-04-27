import { SellerModel } from 'src/user/models/seller.model';
import { UserModel } from 'src/user/models/user.model';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class CreateDummySellers1745752481764 implements Seeder {
  track = false;

  private creationList = [
    {
      publicKey: '5ZqJV6Jv2cdn34jMUmyDe9kr81i98R1uUELjKP3fabF4',
      sellerName: 'Fake Trading Pte Ltd',
      sellerEmail: 'sales@facker-trading.com',
    },
  ];

  public async run(
    dataSource: DataSource,
    _factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const sellerDataMap = new Map(
      this.creationList.map(({ publicKey, sellerEmail, sellerName }) => [
        publicKey,
        { sellerEmail, sellerName },
      ]),
    );

    const { sellers } = await dataSource.transaction(async (manager) => {
      const pendingUserList = this.creationList.map(({ publicKey }) =>
        manager.create(UserModel, {
          publicKey,
        }),
      );
      const savedUsers = await manager.save(pendingUserList);

      const pendingSellerList = savedUsers.map((user) => {
        const sellerData = sellerDataMap.get(user.publicKey);
        return manager.create(SellerModel, {
          user,
          email: sellerData.sellerEmail,
          name: sellerData.sellerName,
        });
      });
      const savedSeller = await manager.save(pendingSellerList);

      return {
        sellers: savedSeller,
      };
    });

    console.log(`========== Created Sellers ==========`);
    sellers.forEach((seller) => {
      console.log(`${seller.name} [${seller.user?.publicKey}]`);
    });
  }
}
