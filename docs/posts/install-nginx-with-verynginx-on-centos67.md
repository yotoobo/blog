---
title: "Install Nginx with VeryNginx on CentOS 6/7"
date: 2017-07-15
categories: 
 - Nginx
---

### 目标
最近购买了新的VPS，所以要迁移旧的网站。借此良机，就考虑安装最新Nginx，并且开启更多新的功能！

整理下想要的功能，清单如下：

1. 开启 HTTPS
2. 开启 HTTP2
3. 安装 verynginx扩展

<!--more-->
### 准备

1. 操作基于 CentOS 7.3 x86_64 (CentOS 6.8已测试通过)
2. 选择[nginx-1.12.1](http://nginx.org/en/download.html)
  - 编译nginx启用http ssl
  - 编译nginx启用http2
3. 申请SSL证书
  - [Let's Encrypt](https://letsencrypt.org/)
  - 阿里云申请免费SSL证书，本站所使用的证书就是阿里云申请的
4. 选择[openssl-1.0.2l](https://www.openssl.org/source/)
5. [VeryNginx](https://github.com/alexazhou/VeryNginx)
  - 依赖如下：
  - [LuaJIT](http://luajit.org/download.html)
  - [lua-nginx-module](https://github.com/openresty/lua-nginx-module)
  - 编译nginx启用http\_stub\_status\_module
  - 编译nginx启用http\_ssl\_module

>在安装过程中，我先是选择的**openssl-1.1.0f**，不过编译过程中出现报错，经Google后说是[openssl版本问题](https://github.com/openresty/lua-nginx-module/issues/1087)，选择1.0.2编译成功。

### 安装 LuaJIT
要编译**lua-nginx-module**模块，需要先安装Lua，这里选择的是LuaJIT。

安装步骤：

```
cd /usr/local/src
wget http://luajit.org/download/LuaJIT-2.0.5.tar.gz
tar zxf LuaJIT-2.0.5.tar.gz
cd LuaJIT-2.0.5
./configure
make -j2 && make install
```

配置lib，include：

```
export LUAJIT_LIB=/usr/local/lib
export LUAJIT_INC=/usr/local/include/luajit-2.0
```

### 安装Nginx
下载好nginx，openssl，lua-nginx-module源码包到/usr/local/src

安装步骤：

```
## 安装依赖包
yum -y install pcre-devel zlib-devel

## 解压源码包
cd /usr/local/src
tar zxf nginx-1.12.1.tar.gz
tar zxf openssl-1.0.2l.tar.gz
git clone https://github.com/openresty/lua-nginx-module

## 编译安装nginx
cd nginx-1.12.1
./configure --prefix=/usr/local/nginx --with-openssl=../openssl-1.0.2l --with-http_ssl_module --with-http_v2_module --with-http_stub_status_module  --add-module=../lua-nginx-module
make -j2 && make install
```

### 安装VeryNginx
这里我们使用的自己的Nginx，所以只安装verynginx。

安装步骤：

```
cd /usr/local/src
git clone https://github.com/alexazhou/VeryNginx
cd VeryNginx
python install.py install verynginx
```

安装脚本会将verynginx安装到/opt/verynginx/下。

### 配置Nginx

将申请的ssl证书上传到指定路径，然后编辑nginx.conf。

主要配置如下：

```
user nginx;
work_processes aotu;

events {
    use epoll;
    worker_connections  2048;
}

include /opt/verynginx/verynginx/nginx_conf/in_external.conf;

http {

    include       mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  logs/access.log  main;

    sendfile        on;
    tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;
    client_body_buffer_size 128k;
    include /opt/verynginx/verynginx/nginx_conf/in_http_block.conf;

    include conf.d/*.conf;
```

配置站点文件：

```
server {
  listen 80;
  server_name pycoder.org;

  return 301 https://$host;

}

server {
    listen 443 http2;
    server_name pycoder.org;

    ssl on;
    ssl_certificate   cert/214193084580193.pem;
    ssl_certificate_key  cert/214193084580193.key;
    ssl_session_timeout 5m;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    include /opt/verynginx/verynginx/nginx_conf/in_server_block.conf;
    
    location / {
        proxy_pass http://127.0.0.1:2369;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   Host      $http_host;
    }
}

```

>这里对http访问做了301重定向，并且设置了Strict-Transport-Security请求头，这样客户端再次请求都会请求https了。

### 启动服务

检查配置文件：

`/usr/local/nginx/sbin/nginx -t`

没有错误则启动nginx：

`/usr/local/nginx/sbin/nginx`


### 自定义VeryNginx

默认访问地址：

`https://pycoder.org/verynginx/index.html`

默认账号密码均为：

`verynginx`


成功登陆后，先修改下默认url和账号密码，保存配置后重新登陆下就好。当然verynginx还有很多其他功能等待挖掘，找时间研究下发个文分享一下。


至此，新VPS的web环境就已经配置完毕了，本小站也终于跟上潮流，用上**https**和**http2**了。


### 参考资料

- [VeryNginx Wiki](https://github.com/alexazhou/VeryNginx/blob/master/readme_zh.md)
- [http2-module](http://nginx.org/en/docs/http/ngx_http_v2_module.html)
- [http-ssl-module](http://nginx.org/en/docs/http/ngx_http_ssl_module.html)


