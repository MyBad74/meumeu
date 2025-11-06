#!/usr/bin/env node

const cdk = require('aws-cdk-lib/core');


const { GitHubWorkflow, AwsCredentials } = require('cdk-pipelines-github');
const { ShellStep } = require('aws-cdk-lib/pipelines');
const { MyStage } = require('../lib/my-stage');

const app = new cdk.App();

const accountId = process.env.CDK_DEFAULT_ACCOUNT || "644271348208";

const pipeline = new GitHubWorkflow(app, 'Pipeline', {
  synth: new ShellStep('Build', {
    commands: [
      'yarn install',
      'yarn build',
    ],
  }),
  awsCreds: AwsCredentials.fromOpenIdConnect({
    gitHubActionRoleArn: `arn:aws:iam::${accountId}:role/GitHubActionRole`,
  }),
});

// Define your environments (replace with your actual account and region)
const BETA_ENV = {
  account: accountId,
  region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
};

const PROD_ENV = {
  account: accountId,
  region: process.env.CDK_DEFAULT_REGION || 'us-west-2',
};

// Build the stages
const betaStage = new MyStage(app, 'Beta', { env: BETA_ENV });
const prodStage = new MyStage(app, 'Prod', { env: PROD_ENV });

// Add the stages for sequential build - earlier stages failing will stop later ones:
pipeline.addStage(betaStage);
pipeline.addStage(prodStage);

app.synth();