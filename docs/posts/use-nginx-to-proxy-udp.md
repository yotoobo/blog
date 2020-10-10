---
title: "使用 Nginx 转发 TCP/UDP 数据"
date: 2017-09-04T23:07:15+08:00
categories: 
 - Nginx
tags: []
markup: mmark
---

### 环境

- OS: Centos6-x86_64
- Nginx: 1.12.1

---

### 编译安装Nginx
从1.9.0开始，nginx就支持对TCP的转发，而到了1.9.13时，UDP转发也支持了。提供此功能的模块为[ngx_stream_core](http://nginx.org/en/docs/stream/ngx_stream_core_module.html)。不过Nginx默认没有开启此模块，所以需要手动安装。

```python
cd /usr/local/src
wget http://nginx.org/download/nginx-1.12.1.tar.gz
tar zxf nginx-1.12.1.tar.gz
cd nginx-1.12.1
./configure --prefix=/usr/local/nginx --with-stream --without-http
make && make install
```

>Note：由于是传输层转发，本着最小化原则，就关闭了http功能。


<!--more-->
---

### 配置Nginx

#### TCP转发

目标：通过3000端口访问本机Mysql(其中mysql使用yum安装，默认配置文件)


`/usr/local/nginx/conf/nginx.conf`配置如下：


```python
user  nobody;
worker_processes  auto;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;


events {
    use epoll;
    worker_connections  1024;
}


stream {
    server {
        listen 3000;
        proxy_pass 127.0.0.1:3306;

	# 也支持socket
	# proxy_pass unix:/var/lib/mysql/mysql.socket;
    }
}
```

首先，先通过3306端口访问mysql：


![image.png](http://upload-images.jianshu.io/upload_images/272496-a2caf0450560df9a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

然后，启动Nginx：

![image.png](http://upload-images.jianshu.io/upload_images/272496-65445fc4d22d2fe3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

最后使用3000端口访问mysql：


![image.png](http://upload-images.jianshu.io/upload_images/272496-2a9b8de4186bfaed.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


#### UDP转发

目标： 发送UDP数据到3000端口，3001端口可以接收

`/usr/local/nginx/conf/nginx.conf`配置如下：

```python
user  nobody;
worker_processes  auto;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;


events {
    use epoll;
    worker_connections  1024;
}


stream {
    server {
        listen 3000 udp;
        proxy_pass 127.0.0.1:3001;

    }
}
```

这里写一个`my_socket_server.py`侦听在3001端口，用于接收UDP数据：

```python
# coding=utf-8

import socket

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

sock.bind(('127.0.0.1', 3001))

print ('start server on [%s]:%s' % ('127.0.0.1', 3001))

while True:
    data, addr = sock.recvfrom(1024)
    print ('Received from %s:%s' % (addr,data))
    sock.sendto(b'Hello, %s!' % data, addr)

```

再写一个`my_socket_client.py`用于向Nginx侦听的3000端口发送数据：

```python
# coding=utf-8

import socket

s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

while True:
    data = raw_input('Input msg: ')
    if len(data) == 0:
        continue
    s.sendto(data.encode(), ('127.0.0.1', 3000))
    print (s.recv(1024).decode('utf-8'))
```

同时运行两个脚本，在client端发送数据：

![4.gif](http://upload-images.jianshu.io/upload_images/272496-fcaf19a9987621a3.gif?imageMogr2/auto-orient/strip)

---

### UDP转发遇到的一个坑

修改下client脚本,改为连续发送2000个数据包：

```python
# coding=utf-8

import socket


s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

for data in range(2000):
    s.sendto(str(data).encode(), ('127.0.0.1', 3000))
    print (s.recv(1024).decode('utf-8'))

```

然后运行client脚本，发现经常会遇到如下情况：


![image.png](http://upload-images.jianshu.io/upload_images/272496-731b9a7d4257fd44.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

由图可知只成功了511个。

查看文档得知`listen`指令有个`backlog`参数，此参数在Linux系统中默认为511:

![image.png](http://upload-images.jianshu.io/upload_images/272496-f60e4082922a1976.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

悲剧的是`backlog`参数和`udp`参数不能同时使用。如果哪位朋友有好的解决办法，请赐教！！！！
