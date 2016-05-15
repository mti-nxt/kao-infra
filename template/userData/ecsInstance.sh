#!/bin/bash -xe
yum update -y
echo ECS_CLUSTER={"Ref":"KaoCluster"}>> /etc/ecs/ecs.config
echo ECS_AVAILABLE_LOGGING_DRIVERS=[\"json-file\",\"syslog\",\"awslogs\"]>> /etc/ecs/ecs.config
