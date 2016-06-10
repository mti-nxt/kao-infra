var config = require("config");
var fs = require("fs");
var Util = require("cloudformation-z").Util;

module.exports = {
  "AWSTemplateFormatVersion": "2010-09-09",

  "Description": "kao-api infra",

  "Parameters": {},
  "Mappings": require("./mappings.js"),

  "Resources": {
    /*
     * ECSクラスター
     */
    "KaoCluster": {
      "Type": "AWS::ECS::Cluster"
    },

    /**
     * ECSクラスターに属するインスタンス用のASG
     */
    //AutoScaling
    "ClusterConfig": {
      "Type": "AWS::AutoScaling::LaunchConfiguration",
      "Properties": {
        "ImageId": { "Fn::FindInMap": ["Region2EcsAMI", { "Ref": "AWS::Region" }, "AMIID"] },
        "InstanceType": config.EcsCluster.instance.type,
        "AssociatePublicIpAddress": true,
        "SecurityGroups": [{ "Ref": "InstanceSecurityGroup" }],
        "KeyName": config.EcsCluster.instance.keyPair,
        "IamInstanceProfile": { "Ref": "EcsInstanceProfile" },
        "UserData": Util.toFnBase64(fs.readFileSync(__dirname + "/userData/ecsInstance.sh", "utf-8")),
        "SpotPrice": 0.05
      }
    },
    "ClusterGroup": {
      "Type": "AWS::AutoScaling::AutoScalingGroup",
      "Properties": {
        "AvailabilityZones": { "Fn::GetAZs": "" },
        "LaunchConfigurationName": { "Ref": "ClusterConfig" },
        "MinSize": config.EcsCluster.min,
        "MaxSize": config.EcsCluster.max,
        "DesiredCapacity": config.EcsCluster.desired,
        "VPCZoneIdentifier": config.subnets,
        "Tags": [
          { "Key": "Name", "Value": `${config.tags.SystemName}-${config.tags.Stage}-ECS`, PropagateAtLaunch: true }
        ]
      }
    },
    "EcsInstanceProfile": {
      "Type": "AWS::IAM::InstanceProfile",
      "Properties": {
        "Path": "/",
        "Roles": [{ "Ref": "EcsInstanceRole" }]
      }
    },
    // ECSのホストに渡すロール
    "EcsInstanceRole": {
      "Type": "AWS::IAM::Role",
      "Properties": {
        "AssumeRolePolicyDocument": {
          "Statement": [{
            "Effect": "Allow",
            "Principal": { "Service": ["ec2.amazonaws.com"] },
            "Action": ["sts:AssumeRole"]
          }]
        },
        "ManagedPolicyArns": [
          "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"
        ],
        "Policies": [{
          "PolicyName": "EcsInstanceRole-policy",
          "PolicyDocument": {
            "Statement": [{
              "Effect": "Allow",
              "Action": [
                "s3:*"
              ],
              "Resource": `arn:aws:s3:::kao-class-${config.tags.Stage.toLowerCase()}`
            }]
          }
        }],
      }
    },
    //各インスタンスのセキュリティグループ
    "InstanceSecurityGroup": {
      "Type": "AWS::EC2::SecurityGroup",
      "Properties": {
        "GroupDescription": "Enable SSH access via port 22",
        "VpcId": config.vpcId,
        "SecurityGroupIngress": [
          {
            "IpProtocol": "tcp",
            "FromPort": "22",
            "ToPort": "22",
            "CidrIp": "0.0.0.0/0"
          },
          {
            "IpProtocol": "tcp",
            "FromPort": "8080",
            "ToPort": "8080",
            "SourceSecurityGroupId": { "Ref": "ElbSecurityGroup" }
          }
        ]
      }
    },

    "LB": {
      "Type": "AWS::ElasticLoadBalancing::LoadBalancer",
      "Properties": {
        "CrossZone": "true",
        "Subnets": config.subnets,
        "SecurityGroups": [{ "Ref": "ElbSecurityGroup" }],
        "Listeners": [{
          "LoadBalancerPort": "80",
          "InstancePort": "8080",
          "Protocol": "HTTP"
        }],
        "HealthCheck": {
          "Target": "HTTP:8080/healthcheck",
          "HealthyThreshold": "3",
          "UnhealthyThreshold": "5",
          "Interval": "30",
          "Timeout": "5"
        }
      }
    },
    //ELBのセキュリティグループ
    "ElbSecurityGroup": {
      "Type": "AWS::EC2::SecurityGroup",
      "Properties": {
        "GroupDescription": "for Cluster ELB",
        "VpcId": config.vpcId,
        "SecurityGroupIngress": [{
          "IpProtocol": "tcp",
          "FromPort": "80",
          "ToPort": "80",
          "CidrIp": "0.0.0.0/0"
        }]
      }
    },


    //ログ出力用
    "KaoApiLog": {
      "Type": "AWS::Logs::LogGroup",
      "Properties": {
        "RetentionInDays": 5
      }
    },

    //顔画像データ、学習状態のファイルなどを入れたりするS3
    "KaoDataBucket": {
      "Type": "AWS::S3::Bucket",
      "Properties": {
        "BucketName": `kao-class-${config.tags.Stage.toLowerCase()}`,
      },
    },

    "EcsServiceRole": {
      "Type": "AWS::IAM::Role",
      "Properties": {
        "AssumeRolePolicyDocument": {
          "Statement": [{
            "Effect": "Allow",
            "Principal": { "Service": ["ecs.amazonaws.com"] },
            "Action": ["sts:AssumeRole"]
          }]
        },
        "ManagedPolicyArns": [
          "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceRole"
        ],
      }
    },
  },

  "Outputs": {}
}
