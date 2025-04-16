import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user')
export class UserModel {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({
    name: 'public_key',
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  publicKey: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date | null;

  @DeleteDateColumn({
    name: 'deleted_at',
  })
  deletedAt: Date | null;
}
