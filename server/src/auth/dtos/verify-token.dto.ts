import { IsString } from 'class-validator';

export class IVerifyTokenResDTO {
  public readonly isTokenValid: boolean;
  public readonly message: string | null;

  constructor(isTokenValid: boolean, message?: string) {
    this.isTokenValid = isTokenValid;
    this.message = message ?? null;
  }
}

export class IVerifyTokenReqDTO {
  @IsString()
  public publicKey: string;
}
