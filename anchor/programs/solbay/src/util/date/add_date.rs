use chrono::{DateTime, Duration, Utc};

pub fn add_days(date: u64, number_of_days: u64) -> u64 {
  // Convert date u64 to not include ms
  let date_time: DateTime<Utc> =
    DateTime::from_timestamp_millis(date as i64).expect("Invalid timestamp");

  let result_date = date_time + Duration::days(number_of_days as i64);

  result_date.timestamp_millis() as u64
}
