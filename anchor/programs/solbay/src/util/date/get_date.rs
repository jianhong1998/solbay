use chrono::{DateTime, Timelike};

#[allow(dead_code)]
enum GeneralErrorMessageType {
  Hour,
  Minute,
  Second,
  MilliSecond,
  NanoSecond,
}

impl GeneralErrorMessageType {
  pub fn to_string(self) -> String {
    match self {
      GeneralErrorMessageType::Hour => return String::from("Hour"),
      GeneralErrorMessageType::Minute => return String::from("Minute"),
      GeneralErrorMessageType::Second => return String::from("Second"),
      GeneralErrorMessageType::MilliSecond => return String::from("Millisecond"),
      GeneralErrorMessageType::NanoSecond => return String::from("Nanosecond"),
    }
  }

  pub fn generate_error_message(self) -> String {
    let mut message = String::from("Invalid calculation time: ");
    message = message + &self.to_string();
    return message;
  }
}

pub fn get_start_of_date(date: u64) -> u64 {
  let input_date = DateTime::from_timestamp_millis(date as i64).expect("Invalid Date");

  let result = input_date
    .with_hour(0)
    .expect(&GeneralErrorMessageType::Hour.generate_error_message())
    .with_minute(0)
    .expect(&GeneralErrorMessageType::Minute.generate_error_message())
    .with_second(0)
    .expect(&GeneralErrorMessageType::Second.generate_error_message())
    .with_nanosecond(0)
    .expect(&GeneralErrorMessageType::NanoSecond.generate_error_message());

  return result.timestamp_millis() as u64;
}
