const config = require("config");

module.exports = {
  "family": `kao-api_${process.env.NODE_ENV}`,
  "revision": config.app.api.revision,
  "volumes": [],
  "containerDefinitions": [
    {
      "name": "kao-api",
      "image": `745130816530.dkr.ecr.us-east-1.amazonaws.com/kao-api:${config.app.api.imageTag}`,
      "cpu": 300,
      "memory": 1024,
      "portMappings": [
        {"hostPort":8080, "containerPort":8080}
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
    }
  ],
}
