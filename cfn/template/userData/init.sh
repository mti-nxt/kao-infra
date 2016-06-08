#!/bin/bash -xe

#install dependencies
yum -y install git gcc
pip install --upgrade flask supervisor https://storage.googleapis.com/tensorflow/linux/cpu/tensorflow-0.8.0-cp27-none-linux_x86_64.whl


#kao dir
mkdir -p /opt/kao
mkdir -p /opt/kao/logs
chown -R ec2-user:ec2-user /opt/kao
ln -sf /opt/kao /home/ec2-user/kao
sudo -u ec2-user git clone https://github.com/mti-nxt/kao-api.git /opt/kao/api
sudo -u ec2-user aws s3 cp s3://kao-class-dev/kao-api /opt/kao/data --recursive

cat << EOF > /etc/supervisord.conf
[unix_http_server]
file=/tmp/supervisor.sock

[supervisord]
logfile=/opt/kao/logs/supervisord.log
logfile_maxbytes=50MB
logfile_backups=10
loglevel=info
pidfile=/tmp/supervisord.pid
nodaemon=false
minfds=1024

minprocs=200
[rpcinterface:supervisor]
supervisor.rpcinterface_factory = supervisor.rpcinterface:make_main_rpcinterface

[supervisorctl]
serverurl=unix:///tmp/supervisor.sock

[program:kao-api]
command=python /opt/kao/api/src/app.py
;numprocs=1
directory=/opt/kao
user=ec2-user
stdout_logfile=/opt/kao/logs/kao-api.log
stderr_logfile=/opt/kao/logs/kao-api_err.log
EOF

cat << EOF > /etc/init.d/supervisord
#!/bin/bash
#chkconfig: 2345 85 15
#description: Supervisor Server
#processname: supervisord

# Source function library.
. /etc/rc.d/init.d/functions

supervisorctl="/usr/local/bin/supervisorctl"
supervisord="/usr/local/bin/supervisord"
name="supervisor-python"

[ -f \$supervisord ] || exit 1
[ -f \$supervisorctl ] || exit 1

RETVAL=0

start() {
    echo -n "Starting \$name: "
    \$supervisord -c /etc/supervisord.conf
    RETVAL=\$?
    if [ \$RETVAL -eq 0 ]
    then
      echo -e "SUCCESS"
    else
      echo -e "FAILED"
    fi
    return \$RETVAL
}

stop() {
    echo -n "Stopping \$name: "
    \$supervisorctl shutdown
    RETVAL=\$?
    if [ \$RETVAL -eq 0 ]
    then
      echo -e "SUCCESS"
    else
      echo -e "FAILED"
    fi
    return \$RETVAL
}

status() {
  \$supervisorctl status
}

case "\$1" in
    start)
        start
        ;;

    stop)
        stop
        ;;

    restart)
        stop
        count=0
        while [ \$count -ne 30 ]
        do
            ret=1
            if [ \$ret -eq 0 ]
            then
                echo -e ""
                break
            fi
            echo -n "."
            count=1
            sleep 1s
        done
        start
        ;;

    status)
        status
        ;;
esac

exit \$REVAL
EOF

chmod +x /etc/init.d/supervisord
chkconfig --add supervisord

#start kao-api
service supervisord start