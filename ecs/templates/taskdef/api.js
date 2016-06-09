const config = require("config");

module.exports = {
  "family": `kao-api_${process.env.NODE_ENV}`,
  "revision": config.app.api.revision,
  "volumes": [],
  "containerDefinitions": [
    {
      "name": "kao-api",
      "image": `mtinx/kao-api:${config.app.api.imageTag}`,
      "cpu": 500,
      "memory": 1024,
      "portMappings": [
      ],
      "volumesFrom": [],
      "environment": [
        { "name": "NODE_ENV", "value": process.env.NODE_ENV }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-region": config.awsOpts.region,
          "awslogs-group": config.app.api.logGroup
        }
      },
    },
    {
      name: "kao-nginx",
      image: "mtinx/kao-api-nginx",
      cpu: 300,
      memory: 512,
      "portMappings": [
        {"hostPort":8080, "containerPort":8080}
      ],
      volumesFrom: [
        {sourceContainer: "kao-api"}
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-region": config.awsOpts.region,
          "awslogs-group": config.app.api.logGroup
        }
      },
    }
  ],
}
