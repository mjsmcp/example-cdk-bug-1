import * as cdk from 'aws-cdk-lib';
import * as kms from 'aws-cdk-lib/aws-kms'
import * as sns from 'aws-cdk-lib/aws-sns'
import * as sqs from 'aws-cdk-lib/aws-sqs'
import * as snsSubscriptions from 'aws-cdk-lib/aws-sns-subscriptions'

import { Construct } from 'constructs';

/**
 * Does not generate a circular dependency
 */
export class ExampleCdkBug1StackDifferentKeys extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const topicKey = new kms.Key(this, "ExampleCdkBug1KmsKey", {
    })

    const queueKey = new kms.Key(this, "ExampleCdkBug1KmsKeyForQueue", {
    })

    const topic = new sns.Topic(this, "ExampleCdkBug1Topic", {
      masterKey: topicKey
    })

    const queue = new sqs.Queue(this, "ExampleCdkBug1Queue", {
      encryptionMasterKey: queueKey
    })

    // Comment this line out to see the statement not be added
    topic.addSubscription(new snsSubscriptions.SqsSubscription(queue));
  }
}
