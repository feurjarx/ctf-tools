apt-get install fail2ban;

path="/etc/fail2ban/jail.conf"

cp $path "$path.old"

cat >$path <<EOL 

[DEFAULT]
# "ignoreip" can be an IP address, a CIDR mask or a DNS host
ignoreip = 127.0.0.1/8
bantime = 600 
maxretry = 3
# "backend" specifies the backend used to get files modification. Available options are "gamin", "polling" and "auto". 
# yoh: For some reason Debian shipped python-gamin didn't work as expected
#      This issue left ToDo, so polling is default backend for now
backend = auto
#
# Destination email address used solely for the interpolations in jail.{conf,local} configuration files.
destemail = feurjarx@gmail.com
EOL
service fail2ban start
exit 0
