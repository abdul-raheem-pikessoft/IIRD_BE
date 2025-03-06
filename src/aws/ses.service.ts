import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SesService {
  private static ses: SESClient = new SESClient({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
  });

  static async sendEmail(to: string, subject: string, body: string) {
    const params = {
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: body,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      Source: process.env.ADMIN_EMAIL,
    };

    try {
      const result = await SesService.ses.send(new SendEmailCommand(params));
      Logger.debug(result);
      return result;
    } catch (error) {
      Logger.debug(error);
      throw error;
    }
  }
}
