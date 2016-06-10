module.exports = {
  clusterName: "KAO-DEV-KaoCluster-6A4YN2PW7ZL4",
  app: {
    api: {
      revision: 13,
      imageTag: "latest",
      logGroup: "KAO-DEV-KaoApiLog-1R1P4T0ESIQ4E",
      service: {
        loadBalancer: "KAO-DEV-LB-1MK9PJH8RVDBC",
        maxPercent: 100,
        minPercent: 0,
        role: "KAO-DEV-EcsServiceRole-QZF65VK0UB2T"
      }
    }
  },
  awsOpts: {
    region: "ap-northeast-1"
  }
}