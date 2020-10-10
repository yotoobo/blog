---
title: "解决 Linux No space left on device"
date: 2016-10-13
categories: 
 - Linux
---

### 情景还原
今天上午，开发突然向我反映说开发环境没有空间了，没法写入新文件。我一听，第一反应就是: 不可能啊！一共200G空间这么快就干完了？

SSH上去赶紧检查下空间使用情况:，并经过N分钟的排除，最终解决问题。晚上赶紧记下来步骤，归纳起来就三步操作，完美解决NO space on device的问题。

<!--more-->

1. 检查硬盘空间使用率： `$ df -h`

2. 如果空间未满，则继续检查inode：`$ df -i`

3. 如果inode也没有使用完，则调整**/proc/sys/fs/inotify/max_user_watches**参数

```
echo 32768 >  /proc/sys/fs/inotify/max_user_watches
echo 'fs.inotify.max_user_watches = 32768' >> /etc/sysctl.conf
```
