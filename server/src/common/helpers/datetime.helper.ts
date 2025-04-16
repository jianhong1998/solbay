import { formatInTimeZone } from 'date-fns-tz';

export class DateTimeHelper {
  public timezone: string;

  static instance: DateTimeHelper;

  private constructor() {
    this.timezone = 'Asia/Singapore';
  }

  public static format(date: Date, format: string) {
    const instance = this.getInstance();

    const timezonedDate = formatInTimeZone(date, instance.timezone, format);

    return timezonedDate;
  }

  private static getInstance() {
    if (!this.instance) this.instance = new DateTimeHelper();

    return this.instance;
  }
}
