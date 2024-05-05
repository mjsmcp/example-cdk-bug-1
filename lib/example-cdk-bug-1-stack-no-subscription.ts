import * as cdk from 'aws-cdk-lib';
import * as kms from 'aws-cdk-lib/aws-kms'
import * as sns from 'aws-cdk-lib/aws-sns'
import * as sqs from 'aws-cdk-lib/aws-sqs'
import * as snsSubscriptions from 'aws-cdk-lib/aws-sns-subscriptions'

import { Construct } from 'constructs';

/**
 * Does not generate a circular dependency
 */
export class ExampleCdkBug1StackNoSubscription extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const key = new kms.Key(this, "ExampleCdkBug1KmsKey", {
    })

    const topic = new sns.Topic(this, "ExampleCdkBug1Topic", {
      masterKey: key
    })

    const queue = new sqs.Queue(this, "ExampleCdkBug1Queue", {
      encryptionMasterKey: key
    })

  }
}
