import { UUID } from 'crypto';
import { SellerModel } from 'src/user/models/seller.model';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

@Entity('product')
export class ProductModel {
  @PrimaryGeneratedColumn('uuid')
  uuid: UUID;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 255,
  })
  name: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  description: string;

  @Column({
    name: 'price_in_micro_usdc',
    type: 'bigint',
    nullable: false,
    transformer: {
      to: (value: number) => value.toString(),
      from: (value: string) => Number.parseInt(value, 10),
    },
  })
  priceInMicroUsdc: number;

  @Column({
    name: 'available_quantity',
    type: 'int',
    nullable: false,
    default: 1,
  })
  availableQuantity: number;

  @Column({
    name: 'is_publish',
    type: 'boolean',
    nullable: false,
    default: false,
  })
  isPublish: boolean;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
  })
  deletedAt: Date | null;

  @ManyToOne(() => SellerModel, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({
    name: 'seller_id',
  })
  seller?: Relation<SellerModel>;
}
