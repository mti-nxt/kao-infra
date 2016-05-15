const config = require("config");
const taskDef = require("../taskdef/api");

module.exports = {
  serviceName: 'kao-api',
  cluster: config.clusterName,
  taskDefinition: `${taskDef.family}:${taskDef.revision}`,
  desiredCount: 1,
  loadBalancers: [
    {
      loadBalancerName: config.app.api.service.loadBalancer,
      containerName: "kao-api",
      containerPort: 8080
    }
  ],
  role: config.app.api.service.role,
  deploymentConfiguration: {
    maximumPercent: config.app.api.service.maxPercent,
    minimumHealthyPercent: config.app.api.service.minPercent
  },
}