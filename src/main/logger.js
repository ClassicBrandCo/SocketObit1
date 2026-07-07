export function createLogger(scope = "app") {
  const prefix = `[${scope}]`;
  return {
    info: (...args) => console.log(prefix, ...args),
    warn: (...args) => console.warn(prefix, ...args),
    error: (...args) => console.error(prefix, ...args),
  };
}

export const logger = createLogger("socketobit");
