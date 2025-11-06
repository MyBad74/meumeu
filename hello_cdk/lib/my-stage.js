const { Stage } = require('aws-cdk-lib');
const { HelloCdkStack } = require('./hello_cdk-stack');

class MyStage extends Stage {
  constructor(scope, id, props) {
    super(scope, id, props);

    // Add your stacks to the stage
    new HelloCdkStack(this, 'HelloCdkStack', props);
  }
}

module.exports = { MyStage };
