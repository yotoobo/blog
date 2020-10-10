---
title: "一步步打造专属于自己的 Kubernetes 1.8.4 集群环境"
date: 2017-12-06
categories: 
 - Kubernetes
---

### 一 kubernetes

![](https://i0.wp.com/softwareengineeringdaily.com/wp-content/uploads/2019/01/Kubernetes_New.png?resize=730%2C389&ssl=1)

[维基百科](https://www.wikiwand.com/zh/Kubernetes) 
Kubernetes (通常称为K8s) 是用于自动部署、扩展和管理容器化（containerized）应用程序的开源系统。Google设计并捐赠给Cloud Native Computing Foundation（今属Linux基金会）来使用的。它旨在提供“跨主机集群的自动部署、扩展以及运行应用程序容器的平台”。它支持一系列容器工具, 包括Docker等。

本文主要介绍如何使用kubeadm快速搭建K8s集群环境，让你迅速体验学习Kubernetes。

- [K8s-concepts](https://kubernetes.io/docs/concepts/)
- [Install-Kubeadm](https://kubernetes.io/docs/setup/independent/install-kubeadm/)
- [Kubeadm-create-cluster](https://kubernetes.io/docs/setup/independent/install-kubeadm/)
- [troubleshooting-kubeadm](https://kubernetes.io/docs/setup/independent/troubleshooting-kubeadm/)

更多内容查阅官网[K8s.io](https://kubernetes.io/docs/home/)

<!-- more -->

---

### 二 实验环境

#### 硬件

宿主机：Win10 + Virtualbox
虚拟机：2核4g + 桥接网卡

|主机名|系统|IP|
|-----|-----|------|
|master.k8s|CentOS 7.4 x86_64|192.168.1.100|
|node1.k8s|CentOS 7.4 x86_64|192.168.1.101|
|node2.k8s|CentOS 7.4 x86_64|192.168.1.102|

#### 软件

|软件包|版本|
|-----|------|
|kubeadm|v1.8.4|
|kubelet|v1.8.4|
|kubectl|v1.8.4|
|kubernetes-cni|0.5.1|
|docker|1.12.6|

上述安装包已经上传百度云，下载链接: <https://pan.baidu.com/s/1c2NJADy> 密码: dfgq

#### 镜像

Kubeadm初始化中会从gcr.io中下载很多镜像。如果是在国内(无奈的F~U~C~K)，只得另辟蹊径，自找出路。我是将镜像同步到了Docker Hub，然后从docker hub 下载，再tag回来。

|镜像名称|仓库|备注|
|---|---|---|
|kube-proxy-amd64:v1.8.4|gcr.io/google_containers/|FQ|
|kube-scheduler-amd64:v1.8.4 |gcr.io/google_containers/|FQ|
|kube-controller-manager-amd64:v1.8.4 |gcr.io/google_containers/|FQ|
|kube-apiserver-amd64:v1.8.4|gcr.io/google_containers/|FQ|
|etcd-amd64:3.0.17|gcr.io/google_containers/|FQ|
|k8s-dns-sidecar-amd64:1.14.5|gcr.io/google_containers/|FQ|
|pause-amd64:3.0|gcr.io/google_containers/|FQ|
|k8s-dns-kube-dns-amd64:1.14.5|gcr.io/google_containers/|FQ|
|k8s-dns-dnsmasq-nanny-amd64:1.14.5|gcr.io/google_containers/|FQ|
|flannel:v0.9.1-amd64|quay.io/coreos|正常访问|

---

### 三 All 节点

__下列操作在所有节点以root用户执行。__

#### 更新系统

```python
yum makecache fast
yum -y update
```

#### 停用 SWAP 分区

临时停止，重启无效：
`# swapoff -a`

永久关闭：

```python
删除SWAP分区
修改/etc/default/grub,找到GRUB_CMDLINE_LINUX并删除swap
备份/etc/grub2.cfg
重新生成/etc/grub2.cfg
```

#### 关闭 SELinux

临时停止，重启无效：
`# setenforce 0`

永久关闭：
修改/etc/selinux/config，然后重启系统。

#### 设置内核参数

```python
cat <<EOF > /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF
sysctl --system
```

#### 安装 kubeadm 等包

将下载好的包上传至系统目录，这里是/opt/soft/

执行安装命令：`yum localinstall -y /opt/soft/*.rpm`

#### 开启 Firewalld

```python
systemctl restart firewalld
systemctl enable firewalld
```

#### 加速 Docker pull

由于大部分源都在国外，国内下载体验很不好，所以需要设置docker加速器。

常用的有：

1. [Daocloud 加速](http://guide.daocloud.io/dcs/docker-9153151.html)
2. [aliyun 加速](https://yq.aliyun.com/articles/29941)

这里使用 Daocloud

#### 调整 kubelet 启动参数

这一步很关键，在没有调整kubelet启动参数之前，我初始化K8s cluster后，在 **/var/log/message** 中频繁出现以下错误信息：

```python
Nov 28 09:29:03 k8s kubelet: E1128 09:29:03.679613    6485 summary.go:92] Failed to get system container stats for "/system.slice/kubelet.service": failed to get cgroup stats for "/system.slice/kubelet.service": failed to get container info for "/system.slice/kubelet.service": unknown container "/system.slice/kubelet.service"
Nov 28 09:29:03 k8s kubelet: E1128 09:29:03.679651    6485 summary.go:92] Failed to get system container stats for "/system.slice/docker.service": failed to get cgroup stats for "/system.slice/docker.service": failed to get container info for "/system.slice/docker.service": unknown container "/system.slice/docker.service"
Nov 28 09:29:03 k8s kubelet: W1128 09:29:03.679695    6485 helpers.go:847] eviction manager: no observation found for eviction signal allocatableNodeFs.available

```

后来在 **stackoverflow** 上找到了同问题的解决办法，就是调整启动参数：

编辑配置文件 /etc/systemd/system/kubelet.service.d/10-kubeadm.conf

```python
新增: Environment="KUBELET_MY_ARGS=--runtime-cgroups=/systemd/system.slice --kubelet-cgroups=/systemd/system.slice"

修改ExecStart: 在末尾新增 $KUBELET_MY_ARGS
```

问题地址： <https://stackoverflow.com/questions/46726216/kubelet-fails-to-get-cgroup-stats-for-docker-and-kubelet-services>

#### 下载镜像

从docker hub中下载所需镜像，并重新tag

```python
images=(kube-proxy-amd64:v1.8.4 kube-scheduler-amd64:v1.8.4 kube-controller-manager-amd64:v1.8.4 kube-apiserver-amd64:v1.8.4 etcd-amd64:3.0.17 k8s-dns-sidecar-amd64:1.14.5 pause-amd64:3.0 k8s-dns-kube-dns-amd64:1.14.5 k8s-dns-dnsmasq-nanny-amd64:1.14.5) 

for imageName in ${images[@]} ; do
  docker pull yotoobo/$imageName
  docker tag  yotoobo/$imageName gcr.io/google_containers/$imageName
  docker rmi  yotoobo/$imageName
done
```

#### 修改/etc/hosts

由于没有内网dns服务，所以这里使用hosts文件。

添加如下内容到/etc/hosts

```python
192.168.1.100 master.k8s
192.168.1.101 node1.k8s
192.168.1.102 node2.k8s
```

---

### 四 master节点

__下列操作在master节点以root用户执行。__

#### 允许指定端口访问

```python
firewall-cmd --permanent --add-port=6443/tcp
firewall-cmd --permanent --add-port=2379-2380/tcp
firewall-cmd --permanent --add-port=10250/tcp
firewall-cmd --permanent --add-port=10251/tcp
firewall-cmd --permanent --add-port=10252/tcp
firewall-cmd --permanent --add-port=10255/tcp
firewall-cmd --reload
```

端口作用：

|端口|目的|
|---|---|
|6443|kube-apiserver|
|2379-2380|etcd server client API|
|10250|kubelet api|
|10251|kube-scheduler|
|10252|kube-controller-manager|
|10255|Read-only Kubelet API |

#### 启动服务

```python
systemctl enable kubelet && systemctl restart kubelet
systemctl enable docker && systemctl restart docker

```

#### kubeadm 初始化

```python
kubeadm init --kubernetes-version=v1.8.4 --token-ttl 0 --pod-network-cidr=10.244.0.0/16
```

>--kubernetes-version=v1.8.4 :不指定会去google获取版本信息，所以你懂的~~~
>--token-ttl 0 :token永不过期，不指定默认24h后过期
>--pod-network-cidr=10.244.0.0/16 :如果要正常使用Flannel,则确保使用此配置

接着等待初始化完成

![kubeadm-init](https://img.pycoder.org/blog/kubeadm-init.png)

如果看到提示1，则说明初始化成功，恭喜，你已经成功了90%了。

按照提示2执行对应操作。

提示3则非常重要了，要妥善保存好，以后添加node机到K8s集群就需要它了。

#### 安装 Flannel

K8s有许多可选[Pod Network](https://kubernetes.io/docs/setup/independent/create-cluster-kubeadm/#pod-network)，这里选择Coreos的[Flannel](https://github.com/coreos/flannel)。

```python
kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/v0.9.1/Documentation/kube-flannel.yml
```

#### 查看 master 状态

![get-info](https://img.pycoder.org/blog/get-info.png)

---

### 五 Nodes 节点

__下列操作在nodes节点以root用户执行。__

#### 允许指定端口

```python
firewall-cmd --permanent --add-port=10250/tcp
firewall-cmd --permanent --add-port=10255/tcp
firewall-cmd --permanent --add-port=30000-32767/tcp
firewall-cmd --reload
```

>30000-32767为NodeService的默认端口

#### 启动服务

```python
systemctl enable kubelet && systemctl restart kubelet
systemctl enable docker && systemctl restart docker
```

#### kubeadm join

使用步骤4.3中的提示3，将nodes节点添加到K8s集群中。

![kubeadm-join](https://img.pycoder.org/blog/kubeadm-join.png)

---

### 最后

至此，我们借助Kubeadm搭建了一套3节点的集群环境，不过需要指出的是Kubeadm还是一个beta版工具，还不建议在生产环境中使用。因为master节点、etcd、kube-apiserver等都还属于单节点。

现在，回到master机器上，再来验证下K8s环境：

![get-info2](https://img.pycoder.org/blog/get-info2.PNG)  

在创建一个简单的Pod：

```python
cat >> /opt/k8s/myapp-pod.yml << EOF
apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
  labels:
    app: myapp
spec:
  containers:
  - name: myapp-container
    image: busybox
    command: ['sh', '-c', 'echo Hello Kubernetes! && sleep 3600']
EOF

kubectl apply -f /opt/k8s/myapp-pod.yml
```

验证：

![pod-info](https://img.pycoder.org/blog/pod-info.png)

K8s 还有许许多多的特性和功能，在深入学习中你会发现K8s是如此的强大而富有魅力。

奔跑的 Kubernetes ！！！
