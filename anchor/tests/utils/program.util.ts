import * as anchor from '@coral-xyz/anchor';
import { AddedAccount, AddedProgram, ProgramTestContext } from 'solana-bankrun';
import { APP_NAME } from '../constants';

export type IGenerateProgramUtilConstructorParams = {
  isTestingOnChain: boolean;
  anchorRootPath: string;
  addedPrograms: AddedProgram[];
  addedAccounts: AddedAccount[];
};

export class ProgramUtil<T extends anchor.Idl> {
  private context: ProgramTestContext | undefined;
  private anchorProvider: anchor.AnchorProvider | undefined;
  private program: anchor.Program<T> | undefined;

  constructor() {}

  private async init(): Promise<void> {
    this.anchorProvider = anchor.AnchorProvider.env();
    anchor.setProvider(this.anchorProvider);

    this.program = anchor.workspace[APP_NAME] as anchor.Program<T>;
    return;
  }

  public async getProvider(): Promise<anchor.Provider> {
    if (!this.anchorProvider) await this.init();

    if (this.anchorProvider) return this.anchorProvider;

    throw new Error('Failed to get provider');
  }

  public async getProgram(): Promise<anchor.Program<T>> {
    if (!this.program) await this.init();
    if (!this.program) throw new Error('Failed to init program');

    return this.program;
  }

  public async getContext(): Promise<ProgramTestContext | null> {
    if (!this.program) await this.init();
    return this.context ?? null;
  }
}
