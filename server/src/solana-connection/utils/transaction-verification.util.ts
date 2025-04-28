import { Program } from '@coral-xyz/anchor';
import { VersionedTransaction } from '@solana/web3.js';
import { Solbay } from 'src/contract/src';

import { ConnectionUtil } from './connection.util';

type InstructionName = keyof Program<Solbay>['methods'];

type IVerifyContainRequiredInstructionResult =
  | {
      hasRequiredInstruction: true;
      instructionIndex: number;
    }
  | {
      hasRequiredInstruction: false;
    };

export class TransactionVerificationUtil {
  public readonly program: Program<Solbay>;

  private static self: TransactionVerificationUtil;

  private constructor(program: Program<Solbay>) {
    this.program = program;
  }

  public static verifyContainRequiredInstruction(
    transaction: VersionedTransaction,
    instructionHex: string,
  ): IVerifyContainRequiredInstructionResult {
    const { message } = transaction;
    const programId = this.getSelf().program.programId;

    for (let i = 0; i < message.compiledInstructions.length; i++) {
      const instruction = message.compiledInstructions[i];

      /* Step - Verify Program ID */

      const instructionProgramId = message
        .getAccountKeys()
        .get(instruction.programIdIndex);

      if (instructionProgramId && !instructionProgramId.equals(programId))
        continue;

      /* Step - Verify Instruction */

      const { data } = instruction;

      const currentInstructionDiscriminatorHex =
        Buffer.from(data).toString('hex');

      if (currentInstructionDiscriminatorHex !== instructionHex) continue;

      return {
        hasRequiredInstruction: true,
        instructionIndex: i,
      };
    }

    return { hasRequiredInstruction: false };
  }

  public static getInstructionDiscriminatorHex(
    instructionName: InstructionName,
  ): string {
    const discriminator = ConnectionUtil.getProgram().idl.instructions.find(
      (ix) => ix.name === instructionName,
    )?.discriminator;

    if (!discriminator)
      throw new Error(
        `Instruction name (${instructionName}) not found in program IDL`,
      );

    return Buffer.from(discriminator).toString('hex');
  }

  private static getSelf(): TransactionVerificationUtil {
    if (!this.self) {
      const program = ConnectionUtil.getProgram();

      this.self = new TransactionVerificationUtil(program);
    }

    return this.self;
  }
}
