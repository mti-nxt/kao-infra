module.exports = {
  //custom settings
  prefix: "ECS-SAMPLE-DEV",
  vpcId: "vpc-4e55442c",
  subnets: ["subnet-bb86bacf","subnet-da4a159c"],
  EcsCluster: {
    instance: {
      type: "m3.medium",
      keyPair: "next-tensor"
    },
    min: "1",
    max: "1",
    desired: "1",
  }
}
