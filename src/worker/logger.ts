import { createLogger, transports, format } from 'winston';

const myFormat = format.printf(({ level, message, label, timestamp }) => {
  return `${level} [${timestamp}] (${label}): ${message}`;
});

const logger = (namespace: string) => {
  const winstonLogger = createLogger({
    level: 'info',
    format: format.combine(
      format.label({ label: `worker-${namespace}` }),
      format.timestamp(),
      format.simple(),
      format.errors({ stack: true }),
      myFormat
    ),
    transports: [
      new transports.File({
        filename: 'filescout-worker-error.log',
        level: 'error',
      }),
      new transports.File({ filename: 'filescout-worker.log' }),
    ],
  });
  //
  // If we're not in production then **ALSO** log to the `console`
  // with the colorized simple format.
  //
  if (process.env.NODE_ENV !== 'production') {
    winstonLogger.add(
      new transports.Console({
        format: format.combine(format.colorize(), format.simple(), myFormat),
      })
    );
  }
  return winstonLogger;
};

export default logger;
