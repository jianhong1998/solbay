import { UUID } from 'crypto';
import { ProductModel } from 'src/product/models/product.model';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

import { LogisticInfoModel } from './logistic-info.model';

@Entity('order')
export class OrderModel {
  @PrimaryGeneratedColumn('uuid')
  uuid: UUID;

  @Column({
    name: 'quantity',
    type: 'int',
    nullable: false,
    default: 1,
  })
  quantity: number;

  @Column({
    name: 'data_key',
    type: 'char',
    nullable: true,
    length: 44,
  })
  onChainDataPubkey: string | null;

  @Column({
    name: 'total_amount_in_lamport',
    type: 'bigint',
    nullable: false,
    transformer: {
      to: (value: number) => value.toString(),
      from: (value: string) => Number.parseInt(value, 10),
    },
  })
  totalAmountInLamport: number;

  @ManyToOne(() => ProductModel, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({
    name: 'product_uuid',
  })
  product: Relation<ProductModel>;

  @OneToOne(() => LogisticInfoModel, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({
    name: 'logistic_info_uuid',
  })
  logisticInfo: Relation<LogisticInfoModel>;
}
