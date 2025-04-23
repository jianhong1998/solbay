export const useLogger = () => {
  const log = (message: unknown, ...optionalParams: unknown[]) => {
    if (optionalParams.length > 0) {
      console.log(message, optionalParams);
    } else {
      console.log(message);
    }
  };

  const warn = (message: unknown, ...optionalParams: unknown[]) => {
    if (optionalParams.length > 0) {
      console.warn(message, optionalParams);
    } else {
      console.warn(message);
    }
  };

  const error = (message: unknown, ...optionalParams: unknown[]) => {
    if (optionalParams.length > 0) {
      console.error(message, optionalParams);
    } else {
      console.error(message);
    }
  };

  return {
    log,
    error,
    warn,
  };
};
