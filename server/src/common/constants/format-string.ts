export const DateTimeFormat = Object.freeze({
  DATE_ONLY: 'dd/MM/yyyy',
  DATE_TIME_WITH_SECONDS: 'dd/MM/yyyy HH:mm:ss',
  DATE_TIME_WIHTOUT_SECONDS: 'dd/MM/yyyy HH:mm',
  DATE_ONLY_WITH_TIMEZONE: 'dd/MM/yyyy x',
  DATE_TIME_WITH_SECONDS_WITH_TIMEZONE: 'dd/MM/yyyy HH:mm:ss x',
  DATE_TIME_WIHTOUT_SECONDS_WITH_TIMEZONE: 'dd/MM/yyyy HH:mm x',
});
// eslint-disable-next-line no-redeclare
export type DateTimeFormat =
  (typeof DateTimeFormat)[keyof typeof DateTimeFormat];
