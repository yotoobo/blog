---
title: "一步步配置让人爽的 Docker CE 学习环境"
date: 2017-09-06
categories: 
 - Docker
---

## 先决条件
Docker原生支持Linux，为了更好的学习，所有操作均在Linux下操作。

由于本人习惯用Centos，所以选择：

- Centos 7
- 系统必须64位
- 开启`centos-extras` 源(除非你手动关闭过，不然可以忽略这个)
- 记得先执行`yum update`更新系统

>如果使用Windows系统，那么需要安装虚拟机软件，再安装Centos7虚机。推荐使用xshell+Virtualbox。

<!--more-->
---

## 安装Docker CE
如果系统已经有Docker，则需要先删除它们：

```python
yum remove docker docker-common docker-selinux docker-engine
```


### 使用Docker repository

1. 安装yum工具

```python
yum install -y yum-utils device-mapper-persistent-data lvm2
```

2. 添加Docker repo

```python
yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
```

3. 更新yum缓存

`yum makecache fast`

4. 安装Docker-ce

`yum install docker-ce`


### 使用rpm包进行安装

1. 下载Docker的rpm包: [RMP下载地址](https://download.docker.com/linux/centos/7/x86_64/stable/Packages/)


2. 安装

`yum install /path/to/package.rpm`

#### 借助Daocloud来安装
Docker的资源都是在国外的，由于某些原因导致我们在安装过程中下载速度奇慢无比。所以为了跳出无限等待下载的坑，就有了国内加速。

这里推荐使用[Daocloud极速下载](https://get.daocloud.io/#install-docker)，妈妈再也不用担心我安装不了Docker了。


### 配置Docker服务

```python
systemctl restart docker
systemctl enable docker
```
---

## 个性配置

### 创建普通用户
>养成不使用root账户的好习惯，如果需要root则使用sudo。

创建aaron用户，并设置密码：

```python
useradd aaron
passwd aaron
```

执行visudo命令后，找到 以下行:

 `#  %wheel ALL=(ALL)   NOPASSWD: ALL`

把行首的注释去掉并保存退出。


修改aaron用户：

```python
usermod -aG wheel,docker aaron
```

>Note: 到这里我们就要和root说拜拜了。之后的操作都基于aaron用户进行，基于aaron用户进行，基于aaron用户进行，请知悉。


### 配置oh-my-zsh
极大提升命令行操作效率，你值得拥有。

安装`oh-my-zsh`：

```python
cd ~
sudo yum -y install zsh git curl vim
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

开启**docker**和**z**插件：

```python
sed -i 's/^plugins.*/plugins=(git docker z)/' ~/.zshrc
```

配置vim别名：

`echo 'alias vi="vim"' >> ~/.zshrc`

重新载入配置使之生效：

`source ~/.zshrc`


### 配置Docker Hub镜像
同样是某些原因，导致下载镜像速度奇慢无比(如果你的网络好的一腿，请忽略此步骤)。所以我们可以借助国内镜像来加速下载。

这里同样是使用[Daocloud加速器](https://www.daocloud.io/mirror#accelerator-doc)。此步需要注册账号，然后根据提示操作即可享受非一般的下载体验。

---

### 结束语
到底，我们的Docker学习环境就完成了。接下来就可以一步步体验容器之美！

1. oh-my-zsh插件z：


![1.gif](http://upload-images.jianshu.io/upload_images/272496-de540e5b73d5f15d.gif?imageMogr2/auto-orient/strip)


2. oh-my-zsh插件docker：

![2.gif](http://upload-images.jianshu.io/upload_images/272496-8d82f96550d67ace.gif?imageMogr2/auto-orient/strip)

3. 使用加速器下载镜像：


![3.gif](http://upload-images.jianshu.io/upload_images/272496-848633e1c308db1e.gif?imageMogr2/auto-orient/strip)
