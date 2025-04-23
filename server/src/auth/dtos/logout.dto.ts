import { IsString } from 'class-validator';

export class LogoutReqDTO {
  @IsString()
  public readonly publicKey: string;
}
