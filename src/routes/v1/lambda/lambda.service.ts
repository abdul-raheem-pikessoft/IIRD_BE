import { Injectable } from '@nestjs/common';
import { LambdaClientService } from "../../../aws/lambda.service";

@Injectable()
export class LambdaService {
  async resumeParse() {
    return await LambdaClientService.invokeLambda('arn:aws:lambda:us-west-2:905418334996:function:ResumeParser');
  }
}
