import { AnchorError, Program, translateError } from '@coral-xyz/anchor';
import { Solbay } from 'src/contract/src';
import { ConnectionUtil } from 'src/solana-connection/utils/connection.util';

type ProgramError = { code: number; name: string; msg: string };

export class ProgramErrorHelper {
  public errorCodeMap: Map<number, ProgramError>;
  public program: Program<Solbay>;

  private static self: ProgramErrorHelper;

  private constructor() {
    const program = ConnectionUtil.getProgram();
    this.program = program;

    this.errorCodeMap = new Map<number, ProgramError>(
      program.idl.errors.map((error) => [error.code, error]),
    );
  }

  public static isAnchorProgramError(error: unknown): boolean {
    return Boolean(this.parseError(error));
  }

  public static parseError(error: unknown): AnchorError['error'] | null {
    const { errorCodeMap } = this.getSelf();

    const errorMap = new Map<number, string>(
      Array.from(errorCodeMap.values()).map((err) => [err.code, err.name]),
    );

    const parsedError = translateError(error, errorMap) as
      | AnchorError
      | undefined;

    return parsedError?.error ?? null;
  }

  private static getSelf(): ProgramErrorHelper {
    if (!this.self) this.self = new ProgramErrorHelper();

    return this.self;
  }
}
