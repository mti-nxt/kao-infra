#!/bin/bash -xe
yum update -y
yum install -y aws-cli
echo ECS_CLUSTER={"Ref":"KaoCluster"}>> /etc/ecs/ecs.config
echo ECS_AVAILABLE_LOGGING_DRIVERS=[\"json-file\",\"syslog\",\"awslogs\"]>> /etc/ecs/ecs.config
aws s3 cp s3://{"Ref": "KaoDataBucket"}/kao-api /tmp/kao-data --recursive