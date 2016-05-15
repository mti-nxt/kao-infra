module.exports = {
  clusterName: "KAO-DEV-KaoCluster-KI6BGFXD5P8W",
  app: {
    api: {
      revision: 1,
      imageTag: "latest",
      logGroup: "KAO-DEV-KaoApiLog-1R1P4T0ESIQ4E",
      service: {
        loadBalancer: "KAO-DEV-ElasticLoa-MZWK2FO6PZDZ",
        maxPercent: 100,
        minPercent: 0,
        role: "KAO-DEV-EcsServiceRole-1QO8SZYKQY66V"
      }
    }
  },
  awsOpts: {
    region: "ap-northeast-1"
  }
}