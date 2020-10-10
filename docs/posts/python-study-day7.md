---
title: "python study day7"
date: 2016-03-10
categories: 
 - Python
---

### 面向对象编程

#### OOP三大特性

##### 1.封装  
把客观事物封装成抽象的类，并且类可以把自己的数据和方法只让可信任的类或对象来操作，对不可信的进行信息隐藏。

##### 2.继承  
它可以使用现有类的所有功能，并且无需编写原来类的情况下对其进行扩展。
- 通过继承创建的类称为 ‘子类’ 或 ‘派生类’。
- 被继承的类称为 ‘超类’ 或 ‘父类’。

继承的过程就是一般(父类：一般定义公共属性和方法)到特殊(子类：继承父类，并添加了很多新功能)的过程。

在考虑使用继承时，要注意两个类应该遵从 ‘A is B’ 的关系。如猫是动物，狗是动物。所以猫和狗可以继承动物类。

##### 3.多态  
多态性（polymorphisn）是允许你将父对象设置成为和一个或更多的他的子对象相等的技术，赋值之后，父对象就可以根据当前赋值给它的子对象的特性以不同的方式运作。简单的说，就是一句话：允许将子类类型的指针赋值给父类类型的指针。

<!--more-->

那么多态的作用是什么？我们知道继承和封装是实现--代码重用。而多态则是实现--接口重用，就是为了类在继承和派生的时候，保证使用“家谱”中任一类的实例的某一属性时的正确调用。

Python不支持多态并且基本用不到多态。多态的概念多应用于Java或C#这一类强类型语言中。

模拟多态：

```python
class Anmial(object):
	def talk(self):
        pass

class Dog(Anmial):
    def talk(self):
        print('Dog talk')

class Cat(Anmial):
    def talk(self):
        print('Cat talk')


def anmial_talk(obj):
    obj.talk()

c = Cat()
d = Dog()

#通过公共方法实现子类的调用
anmial_talk(c)
anmial_talk(d)
```

#### 类成员
类成员包括：  

- 变量(属性)
    - 类变量(属性)
    - 实例变量(属性)
- 方法
	- 普通方法
	- 成员修饰符，装饰器实现
	    - @classmethod #类方法
	    - @staticmethod #静态方法，不能访问类变量和实例变量
	    - @property	#把方法变成属性
	- 特殊方法

示例代码：  

```python
class Dog(object):
	num = 1	#类变量

	def __init__(self,name):
		self.name = name	#实例属性

	@classmethod	#talk()无法访问到实例变量
    def talk(self):
        print('[%s] Dog talk'%self.x)

	@staticmethod	#eat()无法访问类变量和实例变量，和类无关系
	def eat():
		print('Dog eat')

	@property	#将方法变为属性，使用属性的调用方式
	def total_dogs(self):
		return self.num

	@total_dogs.setter	#更改使用@property装饰的属性
    def total_dogs(self,num):
	    self.num = num
	    print('total dogs: ',self.num)

	@total_dogs.deleter	#删除@property装饰属性
	def total_dogs(self):
	    del self.num
	    print('total dogs got deleted.')

d = Dog('h')
#调用
d.total_dogs
#赋值
d.total_dogs = 10
#删除
del d.total_dogs
```

#### 私有变量  
将变量隐藏起来，只能通过类内部访问，类外部无法正常访问。  

示例代码：

```python
class Dog(object):
	def __init__(self,name,age)
		self.__name = name  #使用两个下划线标识
		self.age = age

d = Dog('a',20)
d.age #访问正常变量
d.__name #访问失败
d._Dog__name #只能通过这种方式访问私有变量
```

#### 类中的特殊方法  

- `__class__`,
- `__delattr__`,
- `__dict__`,
- `__dir__`,
- `__doc__`,
- `__eq__`,
- `__format__`,
- `__ge__`,
- `__getattribute__`,
- `__gt__`,
- `__hash__`,
- `__init__`,
- `__le__`,
- `__lt__`,
- `__module__`,
- `__ne__`,
- `__new__`,
- `__reduce__`,
- `__reduce_ex__`,
- `__repr__`,
- `__setattr__`,
- `__sizeof__`,
- `__str__`,
- `__subclasshook__`,
- `__weakref__`


#### 经典类和新式类

##### 写法区别

```python
# 经典类写法
class Anmial:
	pass

# 新式类写法
class Anmial(object):
	pass
```

##### 多继承  
多继承： 同时继承多个类。  
在多继承上，经典类和新式类有一些差异。  

示例代码：

```python
class A:	#经典类
  n = 'A'

  def f2(self):
    print('f2 from a')

class B(A):
  n = 'B'

  def f1(self):
    print('f1 from b')

class C(A):
  n = 'C'

  def f2(self):
    print('f2 from c')

class D(B,C): #继承B,C
  pass

d = D()
```

- 当d调用f2时，先找B，B没有再找C，C没有再找A。这就是广度优先。
- 当d调用f2时，先找B, B没有再找A。这就是深度优先。

python2.x下经典类是深度优先，新式类是广度优先  
python3.x后经典类和新式类都是广度优先  


#### 反射 
反射是计算机程序可以在运行时动态检测并修改它自己的结构和行为.  

首先看一个示例代码：  

```python
from sys import argv

class WebServer(object):
    def __init__(self,host,port):
        self.host = host
        self.port = port

    def start(self):
        print('web is starting')

    def stop(self):
        print('web is stoping')

    def restart(self):
        self.stop()
        self.start()

if __name__ == '__main__':
    server = WebServer('127.0.0.1',80)
    action = argv   #获取用户输入的动作进行判断
    if action[1] == 'start':
        server.start()
    if action[1] == 'stop':
        server.stop()
    if action[1] == 'restart':
        server.restart()
```

使用if判断来进行对应操作,是很low的行为.如果方法有上百个.那就要写上百个判断了.  


##### hasattr() 和 getattr()  
但是,使用反射.情况就会非常优雅:  

```python
(以上代码省略)

if __name__ == '__main__':
    server = WebServer('127.0.0.1',80)
    action = argv   #获取用户输入的动作进行判断
    if hasattr(server,action[1]):    #hasattr()判断server对象中是否存在action[1],存在返回True
        func = getattr(server,action[1])    #getattr()获取server.action[1] 的内存地址
        func()  #执行方法,如果server.action[1]有参数,则func()直接上参数就好
```

##### 使用setattr()将函数绑定到实例中:

```python
class WebServer(object):
    (同上)

def test_run():
    print('test_running')

if __name__ == '__main__':
    server = WebServer('127.0.0.1',80)
    setattr(server,'run',test_run)  #将函数test_run绑定到server实例中,取名叫run.
    server.run()    #执行
```

>Note: 虽然setattr()可以将test_run方法绑定到实例上,但是和实例并没有关系,所以无法调用实例变量.除非将实例作为参数传递给test_run中.而且setattr()只绑定到指定实例,如果生成一个新的实例2,它是不能执行实例2.test_run()的.

##### 使用delattr()  
代码:  

```python
class WebServer(object):
    (同上)

if __name__ == '__main__':
    server = WebServer('127.0.0.1',80)
    delattr(server,'start')     # error.因为start方法不属于实例
    delattr(WebServer,'start')  # sucess.删除WebServer.start
    delattr(server,'host')      # sucess.删除server.host
```

---




### 网络编程之socket
socket通常也称作"套接字"，用于描述IP地址和端口，是一个通信链的句柄，应用程序通常通过"套接字"向网络发出请求或者应答网络请求。  

socket起源于Unix，而Unix/Linux基本哲学之一就是“一切皆文件”，对于文件用【打开】【读写】【关闭】模式来操作。socket就是该模式的一个实现，socket即是一种特殊的文件，一些socket函数就是对其进行的操作（读/写IO、打开、关闭）  

socket和file的区别：  

- file模块是针对某个指定文件进行【打开】【读写】【关闭】
- socket模块是针对 服务器端 和 客户端Socket 进行【打开】【读写】【关闭】


![socket流程图](https://upload.wikimedia.org/wikipedia/commons/a/a1/InternetSocketBasicDiagram_zhtw.png)

#### python编写server的步骤:


- 第一步是创建socket对象,或者叫socket句柄。调用socket构造函数。如：

`socket_handle = socket.socket(family=AF_INET, type=SOCK_STREAM, proto=0, fileno=None)`

family参数代表地址家族，可为:  

    1. AF_INET (the default),
    2. AF_INET6,
    3. AF_UNIX,
    4. AF_CAN,
    5. AF_RDS。

AF_INET家族包括IPv4,IPv6，AF_UNIX家族用于同一台机器上的进程间通信。  
type参数代表套接字类型，可为SOCK_STREAM(流套接字)和SOCK_DGRAM(数据报套接字)。

- 第二步是将socket绑定到指定地址。这是通过socket对象的bind方法来实现的：

`socket.bind(address)`

由AF_INET所创建的套接字，address地址必须是一个双元素元组，格式是('host',port)。host代表主机，port代表端口号(必须为int)。如果端口号正在使用、主机名不正确或端口已被保留，bind方法将引发socket.error异常。

- 第三步是使用socket套接字的listen方法接收连接请求。

socket.listen(backlog)

backlog指定最多允许多少个客户连接到服务器。它的值至少为1。收到连接请求后，这些请求需要排队，如果队列满，就拒绝请求。

- 第四步是服务器套接字通过socket的accept方法等待客户请求一个连接。

connection, address = socket.accept()

调用accept方法时，socket会时入“waiting”状态。客户请求连接时，方法建立连接并返回服务器。accept方法返回一个含有两个元素的 元组(connection,address)。第一个元素connection是新的socket对象，服务器必须通过它与客户通信；第二个元素 address是客户的Internet地址。

- 第五步是处理阶段，服务器和客户端通过send和recv方法通信(传输 数据)。服务器调用send，并采用比特形式向客户发送信息。send方法返回已发送的字符个数。服务器使用recv方法从客户接收信息。调用recv时，服务器必须指定一个整数，它对应于可通过本次方法调用来接收的最大数据量。recv方法在接收数据时会进入“blocked”状态。如果发送的数据量超过了recv所允许的，数据会被截断,多余的数据将缓冲于接收端。下次调用recv时，(如果缓冲区里上次的数据还存在)继续接受上次被截断的数据.

- 传输结束，服务器调用socket的close方法关闭连接。


#### python编写client的步骤 

- 第一步,创建一个socket以连接服务器：

`socket = socket.socket(family, type)`

- 第二步,使用socket的connect方法连接服务器。对于AF_INET家族,连接格式如下：

`socket.connect((host,port))`

host代表服务器主机名或IP，port代表服务器进程所绑定的端口号。如连接成功，客户就可通过套接字与服务器通信，如果连接失败，会引发socket.error异常。

- 处理阶段，客户和服务器将通过send方法和recv方法通信。

- 传输结束，客户通过调用socket的close方法关闭连接。


#### socket编程中遇到的坑

>1. 如果使用python3: send()或sendall()只接受比特类型,所以数据要先bytes()或encode().

>2. 分包,粘包  
    - 分包  
    指接受方没有接受到一个完整的包，只接受了部分，这种情况主要是由于TCP为提高传输效率，将一个包分配的足够大，导致接受方并不能一次接受完.
    - 粘包  
    指发送方发送的若干包数据到接收方接收时粘成一包，从接收缓冲区看，后一包数据的头紧接着前一包数据的尾。出现粘包现象的原因是多方面的，它既可能由发送方造成，也可能由接收方造成。发送方引起的粘包是由TCP协议本身造成的，TCP为提高传输效率，发送方往往要收集到足够多的数据后才发送一包数据。若连续几次发送的数据都很少，通常TCP会根据优化算法把这些数据合成一包后一次发送出去，这样接收方就收到了粘包数据。接收方引起的粘包是由于接收方用户进程不及时接收数据，从而导致粘包现象。这是因为接收方先把收到的数据放在系统接收缓冲区，用户进程从该缓冲区取数据，若下一包数据到达时前一包数据尚未被用户进程取走，则下一包数据放到系统接收缓冲区时就接到前一包数据之后，而用户进程根据预先设定的缓冲区大小从系统接收缓冲区取数据，这样就一次取到了多包数据。分包是指在出现粘包的时候我们的接收方要进行分包处理。  
    处理方式:  
        - 告知对方要接受的数据大小,如果接受数据达到要求,则停止接受
    - [详细信息](http://my.oschina.net/OutOfMemory/blog/95857)


### day7 end
