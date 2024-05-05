# An example demonstrating a circular dependency bug in CDK

This bug appears when a single KMS key is used by both a topic and a queue where the queue is subscribed to the topic.

# CloudFormation w/ Subscription
Something about the Subscription between SQS and SNS adds a key policy statement that produces a circular dependency.

## The KMS key
The circular dependency is between the generated Key and Topic resources via the key policy allowing the SNS topic
```yaml
ExampleCdkBug1KmsKey23F15FE4: 
  Type: "AWS::KMS::Key"
  Properties: 
    KeyPolicy: 
      Statement: 
        # This statement is fine
        - 
          Action: "kms:*"
          Effect: "Allow"
          Principal: 
            AWS: 
              Fn::Join: 
                - ""
                - 
                  - "arn:"
                  - 
                    Ref: "AWS::Partition"
                  - ":iam::"
                  - 
                    Ref: "AWS::AccountId"
                  - ":root"
          Resource: "*"
        # This statement adds an `aws:sourceArn` that Refs the topic
        - 
          Action: 
            - "kms:Decrypt"
            - "kms:GenerateDataKey"
          Condition: 
            ArnEquals: 
              aws:SourceArn: 
                Ref: "ExampleCdkBug1TopicB09999CC"
          Effect: "Allow"
          Principal: 
            Service: "sns.amazonaws.com"
          Resource: "*"
      Version: "2012-10-17"
  UpdateReplacePolicy: "Retain"
  DeletionPolicy: "Retain"
  Metadata: 
    aws:cdk:path: "ExampleCdkBug1Stack/ExampleCdkBug1KmsKey/Resource"
```

## The SNS topic
The topic depends directly on the KMS key to configure encryption
```yaml
    ExampleCdkBug1TopicB09999CC: 
      Type: "AWS::SNS::Topic"
      Properties: 
        # Uses GetAtt: on the KMS key
        KmsMasterKeyId: 
          Fn::GetAtt: 
            - "ExampleCdkBug1KmsKey23F15FE4"
            - "Arn"
      Metadata: 
        aws:cdk:path: "ExampleCdkBug1Stack/ExampleCdkBug1Topic/Resource"
```

# CloudFormation w/o Subscription

## The KMS Key
The KMS key lacks the SNS-specific allow statement, instead using just the default root allow.

```yaml
ExampleCdkBug1KmsKey23F15FE4: 
  Type: "AWS::KMS::Key"
  Properties: 
    KeyPolicy: 
      Statement: 
        - 
          Action: "kms:*"
          Effect: "Allow"
          Principal: 
            AWS: 
              Fn::Join: 
                - ""
                - 
                  - "arn:"
                  - 
                    Ref: "AWS::Partition"
                  - ":iam::"
                  - 
                    Ref: "AWS::AccountId"
                  - ":root"
          Resource: "*"
      Version: "2012-10-17"
  UpdateReplacePolicy: "Retain"
  DeletionPolicy: "Retain"
  Metadata: 
    aws:cdk:path: "ExampleCdkBug1Stack/ExampleCdkBug1KmsKey/Resource"
```

## The SNS topic
The topic doesn't change at all, since it still needs that reference to the KMS key.
```yaml
    ExampleCdkBug1TopicB09999CC:
      Type: "AWS::SNS::Topic"
      Properties:
        KmsMasterKeyId:
          Fn::GetAtt:
            - "ExampleCdkBug1KmsKey23F15FE4"
            - "Arn"
      Metadata:
        aws:cdk:path: "ExampleCdkBug1Stack/ExampleCdkBug1Topic/Resource"
```

# Reproduction
Checkout this repository, run `cdk synth` and look at the generated `cdk.out/ExampleCdkBug1Stack.template.json`