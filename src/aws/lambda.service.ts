import {
    InvokeCommand,
    InvokeCommandInput,
    InvokeCommandOutput,
    LambdaClient,
} from "@aws-sdk/client-lambda";

const lambda: LambdaClient = new LambdaClient({
    region: process.env.AWS_LAMBDA_REGION,
    credentials: {
        accessKeyId: process.env.AWS_LAMBDA_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_LAMBDA_SECRET_ACCESS_KEY,
    },
});

export class LambdaClientService {
    static async invokeLambda(lambdaARN: string): Promise<any> {
        const params: InvokeCommandInput = {
            FunctionName: lambdaARN,
            InvocationType: 'RequestResponse'
        };

        try {
            const command: InvokeCommand = new InvokeCommand(params);
            const response: InvokeCommandOutput = await lambda.send(command);

            if (response.FunctionError) {
                throw new Error(`Lambda error: ${response.FunctionError}`);
            }

            return JSON.parse(Buffer.from(response.Payload).toString());
        } catch (error) {
            console.error('Lambda invocation error:', error);
            throw error;
        }
    }
}