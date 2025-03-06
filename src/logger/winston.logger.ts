// eslint-disable-next-line @typescript-eslint/no-var-requires
const WinstonCloudWatch = require('winston-cloudwatch');
import * as dotenv from 'dotenv';
import { createLogger, format, transports } from 'winston';
dotenv.config();

export const logger = createLogger({
  level: 'info',
  silent: process.env.DISABLE_WINSTON_LOGS === 'true',
  format: format.json(),
  transports: [
    new transports.File({
      filename: 'error.log',
      level: 'error',
    }),
    new transports.File({ filename: 'combined.log' }),
    new transports.File({ filename: 'rejections.log', level: 'warn' }),
  ],
  exceptionHandlers: [
    new transports.Console({
      format: format.simple(),
    }),
    new transports.File({ filename: 'exceptions.log' }),
  ],
  rejectionHandlers: [
    new transports.Console({
      format: format.simple(),
    }),
    new transports.File({ filename: 'rejections.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.prettyPrint({
        depth: null,
        colorize: true,
      }),
    }),
  );
}
if (process.env.NODE_ENV === 'production') {
  const cloudwatchConfig = {
    logGroupName: process.env.CLOUDWATCH_GROUP_NAME,
    logStreamName: process.env.CLOUDWATCH_STREAM_NAME,
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsRegion: process.env.AWS_REGION,
    messageFormatter: ({ level, message }) => `[${level}] : ${JSON.stringify(message)}}`,
  };
  logger.add(new WinstonCloudWatch(cloudwatchConfig));
}
