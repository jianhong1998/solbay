import { UUID } from 'crypto';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('logistic_tracking_info')
export class LogisticTrackingInfoModel {
  @PrimaryGeneratedColumn('uuid')
  uuid: UUID;

  @Column({
    name: 'logistic_provider',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  logisticProvider: string;

  @Column({
    name: 'tracking_code',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  trackingCode: string;

  @Column({
    name: 'tracking_url',
    type: 'text',
    nullable: true,
  })
  trackingUrl: string | null;

  @Column({
    name: 'estimated_deliver_date',
    type: 'timestamp',
    nullable: false,
  })
  estimatedDeliverDate: Date;
}
