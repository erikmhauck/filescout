import pino from 'pino';

const logger = (namespace: string) =>
  pino({
    name: namespace,
    transport: {
      target: 'pino-pretty',
      options: {
        levelFirst: true,
        colorize: true,
        translateTime: true,
        ignore: 'pid,hostname',
      },
    },
  });

export default logger;
