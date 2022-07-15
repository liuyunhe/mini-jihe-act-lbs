import { LOG_LEVEL } from "./../project.config";

const { log: Log, info: Info, error: Errors, warn: Warn } = console;
const getDate = () => {
  const date = new Date();
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`
}
function __print(type: string, ...args: any) {
  if (LOG_LEVEL <= 0 || LOG_LEVEL > 4) {
    return;
  }
  const prefix = `[${type}]${getDate()}:`;
  switch (type) {
    case "LOG":
      if (LOG_LEVEL > 1) {
        return;
      }
      Log(prefix, ...args);
      break;
    case "INFO":
      if (LOG_LEVEL > 2) {
        return;
      }
      Info(prefix, ...args);
      break;
    case "WARN":
      if (LOG_LEVEL > 3) {
        return;
      }
      Warn(prefix, ...args);
      break;
    case "ERROR":
      if (LOG_LEVEL > 4) {
        return;
      }
      Errors(prefix, ...args);
      break;
    default:
      Log(prefix, ...args);
      break;
  }
}
export function log(...args: any) {
  __print("LOG", ...args);
}
export function info(...args: any) {
  __print("INFO", ...args);
}
export function warn(...args: any) {
  __print("WARN", ...args);
}
export function error(...args: any) {
  __print("ERROR", ...args);
}
