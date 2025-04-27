import { UUID } from 'crypto';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

import { UserModel } from './user.model';

@Entity('seller')
export class SellerModel {
  @PrimaryGeneratedColumn('uuid')
  uuid: UUID;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 50,
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 100,
  })
  email: string;

  @OneToOne(() => UserModel, {
    onDelete: 'CASCADE',
    nullable: false,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_uuid' })
  user?: Relation<UserModel>;
}
