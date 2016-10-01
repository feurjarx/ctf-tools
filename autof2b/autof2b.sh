apt-get install fail2ban;

path="/etc/fail2ban/jail.conf"

cp $path "$path.old"

cat >$path <<EOL 

[DEFAULT] 
ignoreip = 127.0.0.1/8 
bantime = 600 
maxretry = 3 
banaction = iptables-multiport 

[ssh]
enabled = true 
port = 2222
#filter = sshd
logpath = /var/log/auth.log
EOL

service fail2ban restart 
exit 0
