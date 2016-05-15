module.exports =  {
  //リージョン毎のECSインスタンスのAMIID
  //See: http://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/launch_container_instance.html
  "Region2EcsAMI" : {
    "us-east-1"      : { "AMIID" : "ami-a1fa1acc" },
    "ap-northeast-1" : { "AMIID" : "ami-a98d97c7" },
  },
}
