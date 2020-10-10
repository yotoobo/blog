---
title: "如何配置 Mysql 主从复制"
date: 2015-05-17
categories: 
  - Mysql
tags:
markup: mmark
---

### 主从复制  

*  概述  
Mysql 的复制是指一台服务器与多台服务器的数据保持同步,即一主多从.它是Mysql水平扩容的最易实现,最成熟的方案!


* 它能解决什么问题?
  1. 数据分布(鸡蛋不要放在一个篮子里)
  2. 负载均衡(将读操作分布到多个从库上,优化读密集型的应用)
  3. 高可用性和故障切换

<!-- more -->

* 复制如何工作  
  ![复制如何工作](http://7xj980.com1.z0.glb.clouddn.com/mysql-replication.jpg)

---

### 配置复制

- 在 master 上创建复制账号  

```
mysql> grant replication slave,replication client on *.* to repUser@'192.168.1.%' identified by 'password';
mysql> flush privileges;
```


- 修改主库 my.cnf  

```
 server-id = 1  #唯一值                          
 log-bin = mysql-bin
 binlog_format = mixed
 datadir = /path/to/datadir

```

- 配置从库my.cnf

```
 server-id = 2  #唯一值
 log-bin = mysql-bin
 binlog_format = mixed
 datadir = /path/to/datadir
 relay-log = mysql-relay-bin
 skip-slave-start
 log-slave-updates = 1  #当从库读取到中继日志后，并将改动写入自己的binlog中
```



### 复制数据到从库

这里采用 `xtrabackup` 工具做热备，这样就不会干扰主库的读写操作，影响线上业务.

安装 `xtrabackup`工具

```
yum install http://www.percona.com/downloads/percona-release/redhat/0.1-3/percona-release-0.1-3.noarch.rpm
yum install percona-xtrabackup
```

备份数据库,在/home下会生成一个以日期时间为名的目录

```
innobackupex --user=root --password=123456 /home/
scp -r /home/2015-07-06_14-54-11 root@"从库ip":/home/
```

登录到从库，开始还原数据库

```
innobackupex --apply-log --redo-only /home/2015-07-06_14-54-11
# 停止mysql服务，切换到mysql的datadir下，并删除所有数据,然后执行还原
innobackupex --copy-back /home/2015-07-06_14-54-11
# 修改datadir目录属主
chown -R mysql.mysql /path/to/datadir
# 启动mysql服务
# 查看 datadir 下 xtrabackup_binlog_info 文件，并记下 binlog 和 pos,
```

---

### 通知备库连接到主库并开始复制

```
mysql> change master to master_host='主库ip',
     > master_user='复制账号',
     > master_password='复制账号的密码',
     > master_log_file='主库binlog',
     > master_log_pos=主库binlog的pos;
mysql> start slave;
mysql> show slave status\G
```

### THE END
