import { UUID } from 'crypto';
import { parse } from 'uuid';

export class UuidHelper {
  private constructor() {}

  public static convertUuidToBytes(uuid: UUID) {
    return parse(uuid);
  }
}
