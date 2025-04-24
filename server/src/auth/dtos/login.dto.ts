import { IsString } from 'class-validator';

export class LoginReqDTO {
  @IsString()
  public transaction: string;

  @IsString()
  public publicKey: string;
}
