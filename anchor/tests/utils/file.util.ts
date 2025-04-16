import { existsSync, readFileSync } from 'fs';

export class FileUtil {
  private constructor() {}

  public static isFileExist(path: string): boolean {
    return existsSync(path);
  }

  public static async readFile(path: string): Promise<string> {
    if (!this.isFileExist(path)) throw new Error('File not exist');

    return readFileSync(path, { encoding: 'utf8' });
  }
}
