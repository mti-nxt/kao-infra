#!/bin/bash -xe

#install dependencies
yum -y install docker git

#ec2-user can exec docker
gpasswd -a ec2-user docker
service docker start

#install docker-compose
curl -L https://github.com/docker/compose/releases/download/1.7.1/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

#kao dir
mkdir -p /opt/kao
chown -R ec2-user:ec2-user /opt/kao
ln -sf /opt/kao /home/ec2-user/kao
sudo -u ec2-user git clone https://github.com/mti-nxt/kao-api.git /opt/kao/api
sudo -u ec2-user aws s3 cp s3://kao-class-dev/kao-api /opt/kao/data --recursive

#start kao-api
docker run -d --restart=always -p 8080:8080 --log-driver=awslogs --log-opt awslogs-region=ap-northeast-1 --log-opt awslogs-group={"Ref": "KaoApiLog"} mtinx/kao-api
