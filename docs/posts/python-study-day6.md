---
title: "Python study day6"
date: 2016-03-02
categories: 
 - Python
---

### shutil moudle

**shutil**模块允许对文件进行高级操作,比如复制,移动,压缩等.

**常用方法：**

```python
shutil.copyfileobj(fsrc, fdst[, length])
将文件内容拷贝到另一个文件中，fsrc和fdst都是文件对象

shutil.copyfile(src, dst)
拷贝文件

shutil.copymode(src, dst)
仅拷贝权限，组，用户均不变

shutil.copystat(src, dst)
拷贝状态的信息

shutil.copy(src, dst)
拷贝文件和权限

shutil.copy2(src, dst)
拷贝文件和状态信息

shutil.copytree(src, dst, symlinks=False, ignore=None, copy_function=copy2, ignore_dangling_symlinks=False)
递归的拷贝文件

shutil.rmtree(path, ignore_errors=False, onerror=None)
递归的删除目录

shutilmove(src, dst)
递归的移动

shutil.make_archive(base_name, format[, root_dir[, base_dir[, verbose[, dry_run[, owner[, group[, logger]]]]]]])
创建档案文件(如zip或者tar)

```

<!--more-->

---

### shelve moudle
对于**pickle**模块来说，如果要序列化三个对象(a,b,c)到一个文件中，则反序列化时第一次取出的对象是a，第二次取出的是b，第三次取出的是c。当要序列化大量的对象到一个文件时，pickle则显得力不从心了。这时，就该shelve模块出马了！！！  

shelve是对pickle的封装扩展。它使用键值对来对应要序列化的对象！反序列化时只要知道存储的‘key’就可以了！

示例：  

```python
#序列化操作
import shelve

f = shelve.open('test')

f['mylist'] = [0,1,2]
f['mystr'] = 'hello world'

f.close()

#反序列化操作
d = shelve.open('test')

print(d.get('mylist')) #打印[0,1,2]
print(d.get('mystr'))  #打印‘hello world'

d.close()	#关闭

```

---




### xml moudle
**XML**指可扩展标记语言。它通过`<>`节点来区别数据结构 

xml实例文件：  

```python
<collection shelf="New Arrivals">
<movie title="Enemy Behind">
   <type>War, Thriller</type>
   <format>DVD</format>
   <year>2003</year>
   <rating>PG</rating>
   <stars>10</stars>
   <description>Talk about a US-Japan war</description>
</movie>
<movie title="Ishtar">
   <type>Comedy</type>
   <format>VHS</format>
   <rating>PG</rating>
   <stars>2</stars>
   <description>Viewable boredom</description>
</movie>
</collection>
```

**获取根节点名字**

```python
# -*- coding: utf-8 -*-

import xml.etree.ElementTree as xtet


tree = xtet.parse('movies.xml')
root = tree.getroot()
print(root.tag)
```

**遍历xml文件**

```python
import xml.etree.ElementTree as xtet

tree = xtet.parse('movies.xml')
root = tree.getroot()

for child in root:
    print(child.tag,child.attrib)	#子节点名字，子节点属性
    for i in child:
        print("-->",i.tag,i.text)	#子节点的属性和值
        
#遍历特定节点
for node in root.iter('format'): #找出所有的’format‘节点
	print(node.tag,node.text)
	
```

**修改xml文件**

```python
import xml.etree.ElementTree as xtet

tree = xtet.parse('movies.xml')
root = tree.getroot()

#将节点format的值都改为DVD
for node in root.iter('format'):
	new_value = 'DVD'
	node.text = new_value
	node.set("updated","yes") #给节点增加属性
	
tree.write("update_movies.xml")

```

**删除xml节点**

```python
import xml.etree.ElementTree as xtet

tree = xtet.parse('movies.xml')
root = tree.getroot()

#如果movie节点的stars小于5，则删除
for movie in root.findall('movie'):
	stars = int(movie.find('stars').text)
	if stars < 5:
		root.remove(movie)
		
tree.write("del_movies.xml")
	
```

---

### configparser module
**configparser**模块可以创建、操作一种简单结构的配置文件，类似于windows的ini问句！  

**定义一个配置文件，如下：**  

```python
[DEFAULT]
ServerAliveInterval = 45
Compression = yes
CompressionLevel = 9
ForwardX11 = yes

[bitbucket.org]
User = hg

[topsecret.server.com]
Port = 50022
ForwardX11 = no
```

**代码如下**  

```python
# -*- coding: utf-8 -*-

# 导入configparser模块
import configparser

#创建一个ConfigParser对象
config = configparser.ConfigParser()
#定义'DEFAULT'节点(全局配置,在任一节点下都可用),以dict形式设置
config['DEFAULT'] = {'ServerAliveInterva': '45',
                     'Compression': 'yes',
                     'CompressionLevel': '9',
                     }
#定义'bitbucket.org'节点,添加'User'配置
config['bitbucket.org'] = {}
config['bitbucket.org']['User'] = 'hg'
#定义'topsecret.server.com'节点,将节点赋予一个变量,使用变量来添加配置
config['topsecret.server.com'] = {}
topsecret = config['topsecret.server.com']
topsecret['Port'] = '50022'
topsecret['ForwardX11'] = 'no'
#新增'DEFAULT'节点配置
config['DEFAULT']['ForwardX11'] = 'yes'
#将定义的配置写入文件
with open('example.ini','w') as configfile:
    config.write(configfile)

```

> 'DEFAULT'节点比较特殊，可以将它看做全局配置，存在于每个节点下.调用sections方法不可见

**读取操作**

```python
In [5]: config = configparser.ConfigParser() # 创建对象

In [7]: config.sections()	#返回除‘DEFAULT'之外的节点名列表
Out[7]: []

In [8]: config.read('example.ini')	#读取配置文件
Out[8]: ['example.ini']

In [10]: config.sections()	
Out[10]: ['bitbucket.org', 'topsecret.server.com']


In [14]: config['bitbucket.org']['User']	#获取’bitbucket.org‘节点下的'User'值
Out[14]: 'hg'

In [15]: config['DEFAULT']['Compression']	#直接获取’DEFAULT'配置项
Out[15]: 'yes'

In [16]: config['bitbucket.org']['Compression'] #通过节点获取‘DEFAULT'配置项
Out[16]: 'yes'

In [17]: topsecret = config['topsecret.server.com'] #引用变量

In [18]: topsecret['Port'] #通过变量获取
Out[18]: '50022'

In [32]: options = config.options('bitbucket.org') #optins方法返回节点配置的key，即配置项的名字，不包含值

In [33]: options
Out[33]: ['user', 'compression', 'serveraliveinterva', 'compressionlevel', 'forwardx11']


```

**判断节点，遍历节点**

```python
In [23]: 'www.baidu.com' in config.sections() 
Out[23]: False

In [24]: 'bitbucket.org' in config.sections()
Out[24]: True

In [25]: for key in config['bitbucket.org']:print(key) #同时打印出’DEFAULT‘
user
compression
serveraliveinterva
compressionlevel
forwardx11

```

**修改配置**  

删除节点'bitbucket.org'

```python
In [38]: config.remove_section('bitbucket.org') 

In [39]: config.sections()
Out[39]: ['topsecret.server.com']

```

删除节点’topsecret.server.com‘的'port'配置

```python
In [46]: config.options('topsecret.server.com')
Out[46]: ['port', 'forwardx11', 'compression', 'serveraliveinterva', 'compressionlevel']

In [53]: config.remove_option('topsecret.server.com','port')
Out[53]: True

In [55]: config.options('topsecret.server.com')
Out[55]: ['forwardx11', 'compression', 'serveraliveinterva', 'compressionlevel']

```

新增节点和配置

> 配置的值只能为字符串类型。

```python
In [56]: config.add_section('new') #新增节点

In [57]: config.sections()
Out[57]: ['topsecret.server.com', 'new']

In [58]: config['new']['name'] = 'wzl'

In [59]: config['new']['age'] = '28'

In [61]: config['new']['age']
Out[61]: '28'

In [62]: config['new']['age'] = '29' #更新

In [63]: config['new']['age']
Out[63]: '29'

In [64]: config.set('new','name','hello') #使用set方法更新
```

**保存**  
修改完配置文件后，保存

```python
config.write(open('new.ini','w'))

```

### hashlib moudle
此模块提供了主流的加密算法，如SHA1, SHA224, SHA256, SHA384, SHA512, md5.  
    
散列函数（或散列算法，又称哈希函数，英语：Hash Function）是一种从任何一种数据中创建小的数字“指纹”的方法。散列函数把消息或数据压缩成摘要，使得数据量变小，将数据的格式固定下来。该函数将数据打乱混合，重新创建一个叫做散列值（hash values，hash codes，hash sums，或hashes）的指纹。散列值通常用来代表一个短的随机字母和数字组成的字符串。好的散列函数在输入域中很少出现散列冲突。在散列表和数据处理中，不抑制冲突来区别数据，会使得数据库记录更难找到。

**md5加密**

```python
import hashlib

md5 = hashlib.md5()
md5.update('how to use md5 in python hashlib?'.encode('utf-8'))
print(md5.hexdigest())
```

**SHA1**

```python
import hashlib

sha1 = hashlib.sha1()
sha1.update('how to use sha1 in '.encode('utf-8'))
sha1.update('python hashlib?'.encode('utf-8'))
print(sha1.hexdigest())
```

>Note: MD5加密已经不可靠，推荐使用SHA256及以上加密强度的算法。但是也要综合考虑其性能，存储。因为越是安全的算法其耗费的资源也越多。

---

### subprocess moudle
这个模块允许你创建新的进程,连接它们的 input/output/error pipes,接受它们返回的代码.subprocess意在替代其他几个老的模块或者函数，比如：

- os.system 
- os.spawn
 
**run方法**  
>Note: run方法是3.5以后新加的,之前的版本是call()

```python
#执行 'df -h'
In [5]: subprocess.run(['df','-h'])
Filesystem      Size   Used  Avail Capacity iused    ifree %iused  Mounted on
/dev/disk1     112Gi   36Gi   76Gi    33% 9484712 19837014   32%   /
devfs          185Ki  185Ki    0Bi   100%     640        0  100%   /dev
map -hosts       0Bi    0Bi    0Bi   100%       0        0  100%   /net
map auto_home    0Bi    0Bi    0Bi   100%       0        0  100%   /home
/dev/disk2s1   313Mi  311Mi  1.4Mi   100%   79708      365  100%   /Volumes/XMind

#上面的linux命令是以列表的形式传入的,subprocess模块会把列表组合起来去执行.如果要直接输入linux指令的话,就会报错.
In [6]: subprocess.run('df -h')
---------------------------------------------------------------------------
FileNotFoundError                         Traceback (most recent call last)
<ipython-input-6-d6afde318cb5> in <module>()
----> 1 subprocess.run('df -h')

#如果必须要这么写,那么就要指定一个参数,告诉subprocess这就是一个完整的指令,不要你帮忙了
In [8]: subprocess.run('df -h',shell=True)
Filesystem      Size   Used  Avail Capacity iused    ifree %iused  Mounted on
/dev/disk1     112Gi   36Gi   76Gi    33% 9484948 19836778   32%   /
devfs          185Ki  185Ki    0Bi   100%     640        0  100%   /dev
map -hosts       0Bi    0Bi    0Bi   100%       0        0  100%   /net
map auto_home    0Bi    0Bi    0Bi   100%       0        0  100%   /home
/dev/disk2s1   313Mi  311Mi  1.4Mi   100%   79708      365  100%   /Volumes/XMind
```

**Popen()**  
>因为subprocess是启用子进程来执行的,由于进程间是无法直接通信的,所以要借助第三方来通信,这里使用管道.使用Popen()方法并使用管道来传输结果

```python
In [29]: res = subprocess.Popen('df -h',shell=True,stdout=subprocess.PIPE)

In [30]: res.stdout.read()
Out[30]: b'Filesystem      Size   Used  Avail Capacity iused    ifree %iused  Mounted on\n/dev/disk1     112Gi   36Gi   76Gi    33% 9486486 19835240   32%   /\ndevfs          185Ki  185Ki    0Bi   100%     640        0  100%   /dev\nmap -hosts       0Bi    0Bi    0Bi   100%       0        0  100%   /net\nmap auto_home    0Bi    0Bi    0Bi   100%       0        0  100%   /home\n/dev/disk2s1   313Mi  311Mi  1.4Mi   100%   79708      365  100%   /Volumes/XMind\n'

```

**使用方法:**  
subprocess.Popen(args, bufsize=-1, executable=None, stdin=None, stdout=None, stderr=None, preexec_fn=None, close_fds=True, shell=False, cwd=None, env=None, universal_newlines=False, startupinfo=None, creationflags=0, restore_signals=True, start_new_session=False, pass_fds=())
  
**常用参数:**  

- args: shell命令,可以是字符串或序列类型(list,tuple)
- bufsize: 指定缓存. 0-无缓冲,1-缓冲,负值-系统缓存,其他-指定缓存大小
- stdin,stdout,stderr: 标准输入,标准输出,错误句柄
- shell: 如果为True,args作为原生命令交由子进程去执行
- cwd: 用于设置子进程当前的目录
- env: 用于指定子进程的环境变量,默认继承父进程的env

**执行交互操作**  

```python
In [23]: a = subprocess.Popen(['python'],stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.PIPE)

In [24]: a.stdin.write("print('hello')\n".encode())
Out[24]: 15

In [25]: a.stdin.write("import os\n".encode())
Out[25]: 10

In [26]: print(a.communicate())
(b'hello\n', b'')
```

**check_call()**  
当命令错误,抛出异常.

```python
In [31]: res = subprocess.run('dfd -h',shell=True)
/bin/sh: dfd: command not found

In [32]: res = subprocess.check_call('dfd -h',shell=True)
/bin/sh: dfd: command not found
---------------------------------------------------------------------------
CalledProcessError                        Traceback (most recent call last)
<ipython-input-32-ad179703c2c8> in <module>()
----> 1 res = subprocess.check_call('dfd -h',shell=True)

/Users/ifree/.pyenv/versions/3.5.1/lib/python3.5/subprocess.py in check_call(*popenargs, **kwargs)
    582         if cmd is None:
    583             cmd = popenargs[0]
--> 584         raise CalledProcessError(retcode, cmd)
    585     return 0
    586

CalledProcessError: Command 'dfd -h' returned non-zero exit status 127

```


>Note: 同样也可以在run()方法中开启检测

```python
In [38]: res = subprocess.run('dfd -h',shell=True,check=True)
/bin/sh: dfd: command not found
---------------------------------------------------------------------------
CalledProcessError                        Traceback (most recent call last)
<ipython-input-38-4495fcbd0cbd> in <module>()
----> 1 res = subprocess.run('dfd -h',shell=True,check=True)

/Users/ifree/.pyenv/versions/3.5.1/lib/python3.5/subprocess.py in run(input, timeout, check, *popenargs, **kwargs)
    709         if check and retcode:
    710             raise CalledProcessError(retcode, process.args,
--> 711                                      output=stdout, stderr=stderr)
    712     return CompletedProcess(process.args, retcode, stdout, stderr)
    713

CalledProcessError: Command 'dfd -h' returned non-zero exit status 127
```

---

### logging moudle  
python的logging模块提供了标准的日志接口，你可以通过它存储各种格式的日志.  

logging的日志级别从低到高可以分为:

- debug()
- info()
- warning()
- error()
- critical()  

**直接输出日志信息**  

```python
In [35]: logging.debug('debug message') #没有输出到屏幕

In [36]: logging.info('info message')   #没有输出到屏幕

In [37]: logging.warning('warning message')   #还有个warn()就要弃用了,不建议使用
WARNING:root:warning message

```


**输出日志到文件**  

```python
# -*- coding: utf-8 -*-
import logging

logging.basicConfig(filename='example.log',level=logging.INFO)
logging.debug('This message should go to the log file')
logging.info('So should this')
logging.warning('And this, too')
```

>查看生成的日志得知debug级的没有写入,这是因为设定的level为INFO级,所以只会机会INFO级和它之上的级别日志

**给日志信息加入时间**  

```python
logging.basicConfig(filename='example.log',level=logging.INFO,format='%(asctime)s %(message)s', datefmt='%Y-%m-%d %I:%M:%S %p')
```


**需求： 同时把日志输出到屏幕和文件中**

```python
# -*- coding: utf-8 -*-

import logging

# 创建一个logger
logger = logging.getLogger('mylogger')
logger.setLevel(logging.DEBUG)

# 创建一个handler，用于写入日志文件
fh = logging.FileHandler('test.log')
fh.setLevel(logging.DEBUG)

# 再创建一个handler，用于输出到控制台
ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)

# 定义handler的输出格式
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
fh.setFormatter(formatter)
ch.setFormatter(formatter)

# 给logger添加handler
logger.addHandler(fh)
logger.addHandler(ch)

# 记录一条日志
logger.info('foorbar')
```

---

### 面向对象
面向对象程序设计（英语：Object-oriented programming，缩写：OOP）是一种程序设计范型，同时也是一种程序开发的方法。对象指的是类的实例。它将对象作为程序的基本单元，将程序和数据封装其中，以提高软件的重用性、灵活性和扩展性。  
详细信息请看[维基百科](https://zh.wikipedia.org/wiki/%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1)  

**类：**  
类（Class）定义了一件事物的抽象特点。类的定义包含了数据的形式以及对数据的操作。举例来说，“狗”这个类会包含狗的一切基础特征，即所有“狗”都共有的特征或行为，例如它的孕育、毛皮颜色和吠叫的能力。类可以为程序提供模版和结构。一个类的方法和属性被称为“成员”。  

示例代码:

```python
class Dog(object): #boject是所有类的父类(基类)

	def __init__(self,name,color):	#构造方法，在实例化时自动执行
		self.name = name
		self.color = color

	def eat(self):	#所有的狗都会吃东西
		print('吃东西')
	
	pass
```

**对象:**  
对象（Object）是类的实例。例如，“狗”这个类列举狗的特点，从而使这个类定义了世界上所有的狗。而莱丝这个对象则是一条具体的狗，它的属性也是具体的。狗有皮毛颜色，而莱丝的皮毛颜色是棕白色的。因此，莱丝就是狗这个类的一个实例。一个具体对象属性的值被称作它的“状态”。（系统给对象分配内存空间，而不会给类分配内存空间。这很好理解，类是抽象的系统不可能给抽象的东西分配空间，而对象则是具体的。）

示例代码：  

```python
#实例化一个具体的狗
laisi = Dog('莱斯','red')
```

**消息传递:**  
一个对象通过接受消息、处理消息、传出消息或使用其他类的方法来实现一定功能，这叫做消息传递机制（Message Passing）。  

**实例化：**  
实例化就是由抽象到具体的过程！

**面向对象的三大特性:**  

- 封装  
具备封装性（Encapsulation）的面向对象程序设计隐藏了某一方法的具体执行步骤，取而代之的是通过消息传递机制传送消息给它。因此，举例来说，“狗”这个类有“吠叫()”的方法，这一方法定义了狗具体该通过什么方法吠叫。但是，莱丝的朋友并不知道它到底是如何吠叫的。
- 继承  
继承性（Inheritance）是指，在某种情况下，一个类会有“子类”。子类比原本的类（称为父类）要更加具体化。例如，“狗”这个类可能会有它的子类“牧羊犬”和“吉娃娃犬”。在这种情况下，“莱丝”可能就是牧羊犬的一个实例。子类会继承父类的属性和行为，并且也可包含它们自己的。我们假设“狗”这个类有一个方法（行为）叫做“吠叫()”和一个属性叫做“毛皮颜色”。它的子类（前例中的牧羊犬和吉娃娃犬）会继承这些成员。这意味着程序员只需要将相同的代码写一次。
- 多态

  
**实例属性和类属性：**  

```python
class Dog(object): #boject是所有类的父类(基类)
	count = 0 #类属性，所有实例都可以访问到

	def __init__(self,name,color):	#实例属性，每个对象都是访问自己的
		self.name = name
		self.color = color

```


### day6 end
