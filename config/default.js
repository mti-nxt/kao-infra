const SYSTEM_NAME = "KAO";
const STAGE = process.env.NODE_ENV.toUpperCase();

module.exports = {
  stackName: `${SYSTEM_NAME}-${STAGE}`,
  timeoutInMinutes: 10,
  tags: {
    SystemName: SYSTEM_NAME,
    Stage: STAGE
  }
}
