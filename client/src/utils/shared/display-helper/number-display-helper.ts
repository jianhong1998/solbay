export class NumberDisplayHelper {
  private constructor() {}

  public static convertMicroUsdcToUsdc(microUsdc: number): number {
    return microUsdc / 1_000_000;
  }

  public static convertUsdcToMicroUsdc(usdc: number): number {
    return usdc * 1_000_000;
  }
}
