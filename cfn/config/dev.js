module.exports = {
  //custom settings
  vpcId: "vpc-4e55442c",
  subnets: ["subnet-bb86bacf","subnet-da4a159c"],
  EcsCluster: {
    instance: {
      type: "m3.medium",
      keyPair: "docker-sample"
    },
    min: "1",
    max: "1",
    desired: "1",
  }
}
