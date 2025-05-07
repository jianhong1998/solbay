import { UUID } from 'crypto';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

import { LogisticTrackingInfoModel } from './logistic-tracking-info.model';

@Entity('logistic_info')
export class LogisticInfoModel {
  @PrimaryGeneratedColumn('uuid')
  uuid: UUID;

  @Column({
    name: 'street_line_1',
    type: 'text',
    nullable: false,
  })
  streetLine1: string;

  @Column({
    name: 'street_line_2',
    type: 'text',
    nullable: true,
  })
  streetLine2: string | null;

  @Column({
    name: 'street_line_3',
    type: 'text',
    nullable: true,
  })
  streetLine3: string | null;

  @Column({
    name: 'postal_code',
    type: 'int',
    nullable: false,
  })
  postalCode: number;

  @Column({
    name: 'city',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  city: string;

  @Column({
    type: 'varchar',
    length: '60',
    nullable: false,
  })
  country: string;

  @Column({
    name: 'recipient',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  recipientName: string;

  @Column({
    name: 'country_code',
    type: 'int',
    nullable: false,
  })
  countryCode: number;

  @Column({
    name: 'contact_number',
    type: 'int',
    nullable: false,
  })
  contactNumber: number;

  @OneToOne(() => LogisticTrackingInfoModel, {
    nullable: true,
  })
  @JoinColumn({
    name: 'logistic_tracking_info',
  })
  logisticTrackingInfo: Relation<LogisticTrackingInfoModel>;
}
