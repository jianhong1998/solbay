import { existsSync, readFileSync } from 'fs';

export class FileUtil {
  private constructor() {}

  public static isFileExist(path: string): boolean {
    return existsSync(path);
  }

  public static readFile(path: string): string {
    if (!this.isFileExist(path)) throw new Error('File not exist');

    return readFileSync(path, { encoding: 'utf8' });
  }
}
