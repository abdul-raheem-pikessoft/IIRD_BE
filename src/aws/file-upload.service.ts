import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { DeleteObjectCommand, DeleteObjectCommandOutput, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
dotenv.config();

const AWS_S3_BUCKET_NAME = process.env.AWS_PUBLIC_BUCKET_NAME;
const region = process.env.AWS_REGION;
const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region,
});

export class FileUploadService {
  static async uploadSeeder(image, urlKey) {
    try {
      const params = {
        Bucket: AWS_S3_BUCKET_NAME,
        Key: urlKey,
        Body: image,
        ACL: 'public-read',
      };
      await s3.send(new PutObjectCommand(params));
      const url = `https://${AWS_S3_BUCKET_NAME}.s3.${region}.amazonaws.com/${urlKey}`;

      return url;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  static async upload(image, urlKey) {
    try {
      const mimetype = image.mimetype.split('/')[1];
      urlKey = `${urlKey}.${mimetype}`;
      const params = {
        Bucket: AWS_S3_BUCKET_NAME,
        Key: urlKey,
        Body: image.buffer,
        ACL: 'public-read',
      };
      await s3.send(new PutObjectCommand(params));
      const url = `https://${AWS_S3_BUCKET_NAME}.s3.${region}.amazonaws.com/${urlKey}`;

      return url;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  static async delete(key: string): Promise<boolean> {
    try {
      const response: DeleteObjectCommandOutput = await s3.send(
        new DeleteObjectCommand({
          Bucket: AWS_S3_BUCKET_NAME,
          Key: key,
        }),
      );

      if (response.$metadata.httpStatusCode === 204) {
        Logger.log(`Object '${key}' deleted successfully`);
        return true;
      } else {
        Logger.log(`Object '${key}' deletion failed with status code ${response?.$metadata?.httpStatusCode}`);
        return false;
      }
    } catch (error) {
      Logger.log(`Error deleting object '${key}': ${error.message}`);
      throw error;
    }
  }
  static async getUploadURL(Key) {
    const s3Params = {
      Bucket: AWS_S3_BUCKET_NAME,
      Key,
      ContentType: 'video/mp4',
      ACL: 'public-read',
    };
    const uploadURL = await getSignedUrl(s3, new PutObjectCommand(s3Params), { expiresIn: 90000000 });
    return JSON.stringify({
      uploadURL,
      Key,
    });
  }
}
