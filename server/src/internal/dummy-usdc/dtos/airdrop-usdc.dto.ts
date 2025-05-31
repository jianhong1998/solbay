import { PublicKey } from '@solana/web3.js';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

export class AirdropUsdcReqDTO {
  @IsString()
  @IsNotEmpty()
  @Length(44, 44)
  recipient: string;

  @IsNumber()
  @IsPositive()
  amount: number;
}

export class AirdropUsdcResDTO {
  @IsString()
  @IsNotEmpty()
  @Length(44, 44)
  publicKey: string;

  @IsNumber()
  @IsPositive()
  balance: number;

  constructor(publicKey: PublicKey, balance: number) {
    this.publicKey = publicKey.toBase58();
    this.balance = balance;
  }
}
