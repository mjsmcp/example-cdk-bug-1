#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ExampleCdkBug1StackWithSubscription } from '../lib/example-cdk-bug1-stack-with-subscription';
import {ExampleCdkBug1StackNoSubscription} from "../lib/example-cdk-bug-1-stack-no-subscription";
import {ExampleCdkBug1StackDifferentKeys} from "../lib/example-cdk-bug1-stack-different-keys";

const app = new cdk.App();
new ExampleCdkBug1StackWithSubscription(app, 'ExampleCdkBug1StackWithSubscription', {});
new ExampleCdkBug1StackNoSubscription(app, 'ExampleCdkBug1StackNoSubscription', {});
new ExampleCdkBug1StackDifferentKeys(app, 'ExampleCdkBug1StackDifferentKeys', {});