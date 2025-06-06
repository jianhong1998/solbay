import { UUID } from 'crypto';
import { UserModel } from 'src/user/models/user.model';
import {
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

import { OrderModel } from './order.model';

@Entity('temp_order')
export class TempOrderModel {
  @PrimaryGeneratedColumn('uuid')
  uuid: UUID;

  @JoinColumn()
  @ManyToOne(() => UserModel, { nullable: false, eager: true })
  buyer: Relation<UserModel>;

  @JoinColumn()
  @Index({ unique: true })
  @OneToOne(() => OrderModel, { nullable: false, eager: true })
  order: Relation<OrderModel>;
}
