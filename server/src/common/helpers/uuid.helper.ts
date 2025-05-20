import { UUID } from 'crypto';
import { parse, stringify } from 'uuid';

export class UuidHelper {
  private constructor() {}

  public static convertUuidToBytes(uuid: UUID) {
    return parse(uuid);
  }

  public static convertBytesToUuid(bytes: number[]): UUID {
    return stringify(Uint8Array.from(bytes)) as UUID;
  }
}
