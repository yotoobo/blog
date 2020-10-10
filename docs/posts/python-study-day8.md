---
title: "Python study day8"
date: 2016-03-14
categories: 
 - Python
---

### socket 拾遗  

#### socket常用方法  

- **socket.socket(family=AF_INET, type=SOCK_STREAM, proto=0, fileno=None):**  

 创建socket句柄:

    + family参数代表地址家族，可为:  

        + AF_INET (ipv4,the default),
        + AF_INET6 (ipv6),
        + AF_UNIX (unix 套接字),
        + AF_CAN,
        + AF_RDS。

    + type参数代表套接字类型,可为:  
        + SOCK_STREAM (the default), 处理tcp
        + SOCK_DGRAM, 处理udp
        + SOCK_RAW, 原始套接字,处理ICMP,IGMP
        + SOCK_RDM, 可靠的upd,保证数据完整交付但不保证顺序

<!--more-->
- **socket.bind(address)**  
将socket句柄绑定到address上,在AF_INET下,address以元组('ip',port)的形式

- **socket.listen([backlog])**  
允许server接受的连接.如果指定backlog,它至少应为0;如果backlog为10,则系统最多接受10个请求并维护在一个队列中,第11个则会连接失败.

- **socket.connect(address)**  
连接远程socket.

- **socket.setblocking(flag)**  
设置socket是否为阻塞模式: 如果flag为false,socket为非阻塞模式,否则为阻塞模式.

- **socket.accept()**  
接受一个连接:
Accept a connection. The socket must be bound to an address and listening for connections. The return value is a pair (conn, address) where conn is a new socket object usable to send and receive data on the connection, and address is the address bound to the socket on the other end of the connection.

- **socket.send(bytes[,flag])**  
将bytes数据发送到连接的套接字.返回值是要发送的字节数量.但有可能指定内容未全部发送.

- **socket.sendall(bytes[,flag])**  
将bytes数据发送到连接的套接字,在返回之前会尝试发送所有数据.成功返回None.  
内部通过递归调用send.

- **socket.sendto(bytes, flags, address)**  
将数据发送到套接字，address是形式为（ipaddr，port）的元组，指定远程地址。返回值是发送的字节数。该函数主要用于UDP协议。

- **socket.settimeout(value)**  
Set a timeout on blocking socket operations.

- **socket.getsockname()**  
返回套接字自己的地址.格式为元组(ipaddr,port)

- **socket.recv(bufsize[, flags])**  
接受大小为bufsize的数据.当接受数据时,socket句柄会进入"blocking"状态.

- **socket.close()**  
关闭socket连接

- **sk.getpeername()**  
返回连接套接字的远程地址。返回值通常是元组（ipaddr,port）。

- **sk.getsockname()**  
返回套接字自己的地址。通常是一个元组(ipaddr,port)

- **sk.fileno()**  
套接字的文件描述符

---

### socketserver
#### 0. 介绍  
上一节课使用的socket不支持并发连接,所以并无卵用.这次开始学习更加强大的socketserver,支持多并发!  

`socketserver` 模块简化了编写网络服务的难度.  
它有四个基本的server class:  

1. TCPServer
2. UDPServer
3. UnixStreamServer
4. UnixatagramServer

TCPServer使用TCP协议提供server和client之间的数据流传输.  
UDPServer使用数据报的形式,将一整个包分成很多小的包进行传输,但有可能会丢失.  
UnixStreamServer和UnixatagramServer使用本地unix套接字.它们不支持非unix架构.  

这四个类处理请求是同步的;下一个请求启动之前每个请求必须完成。如果每个请求需要很长的时间来完成，因为它需要大量的计算，或者因为它返回大量的数据，客户端处理很长时间,所以这是不合适的。解决方案是创建一个单独的进程或线程来处理每个请求;可以使用`ForkingMixIn`和`ThreadingMixIn`类来支持异步行为.  

#### 1. 继承示意图: 
    +------------+
    | BaseServer |
    +------------+
      |
      v
    +-----------+        +------------------+
    | TCPServer |------->| UnixStreamServer |
    +-----------+        +------------------+
      |
      v
    +-----------+        +--------------------+
    | UDPServer |------->| UnixDatagramServer |
    +-----------+        +--------------------+


>Note: Note that UnixDatagramServer derives from UDPServer, not from UnixStreamServer — the only difference between an IP and a Unix stream server is the address family, which is simply repeated in both Unix server classes.

每个server类型的`Forking`(多进程) 和 `threading`(多线程) 可以使用`ForkingMixIn` 和 `ThreadingMixIn` 类创建. 例如, 一个多线程的UDP server class 创建:  

`class ThreadingUDPServer(ThreadingMixIn, UDPServer): pass`

#### 2. socketserver Example
要实施一个服务,你必须要衍生一个继承自 `BaseRequestHandler` 的类并且重写 `handle()` 方法.  

场景: client发送数据到server,server原样返回数据.  

**示例代码:**  
**my_socketclient.py**  

```python
import socket

ip_port = ('127.0.0.1',40000)
client = socket.socket()
client.connect(ip_port)

while True:
    say = input(">>> ").strip()
    if len(say) == 0:continue
    client.send(say.encode())   #send数据给server

    server_reply = client.recv(1024)    #recv接受server返回的数据
    print(server_reply.decode())

client.close()
```

运行client:  
`python3 my_socketclient.py`

**my_socketserver.py**  

```python
# -*- coding: utf-8 -*-

import socketserver

class MyTCPHandler(socketserver.BaseRequestHandler):    #继承BaseRequestHandler

    def handle(self):   #重写handle
        while True:
            print("New Conn: ",self.client_address) #当有client时,打印其地址
            data = self.request.recv(1024)  #接受client发送的数据
            if not data:break
            print('Client Says: ',data.decode())
            self.request.send(data) #将数据再次发送回去


if __name__ == '__main__':
    HOST,PORT = '127.0.0.1',40000
    #将MyTCPHandler当做参数传递给ThreadingTCPServer类,每当有新的连接,就会启动一个新线程提供服务
    server = socketserver.ThreadingTCPServer((HOST,PORT),MyTCPHandler)
    #启动server,会一直运行下去.除非ctrl-c退出
    server.serve_forever()
```

运行server:  

`python3 my_socketserver.py`

>Note: 所有和客户端交互的工作都是在handle()方法中处理,发送和接受要使用self.request,获取客户端地址是self.client_address.

当运行多个client时,server会为每个连接启动一个线程提供服务.  

RequestHandler除了有handle()方法,还有:  

- setup()
在handle()之前调用.

- finish()
在handle()之后调用.

---

### isinstance 和 issubclass
之前要判断一个数据类型,使用type()方法.同样还可以使用isinstance().  

```python
# 判断变量是否为某个类型
In [2]: a = [1,2]

In [3]: isinstance(a,list)
Out[3]: True

# 判断实例是否属于某个类
In [5]: class Foo(object):pass

In [6]: f = Foo()

In [7]: isinstance(f,Foo)
Out[7]: True

```

`issubclass(sub,super)`用于判断sub类是否继承super类.

---

### 异常处理
为了用户友好,通常都会对程序中可能出现的异常进行捕捉并做对应的处理.  

**1. 语法:**  

```python
try:
    pass
except Exception as ex: #这里的Exception代表任何异常.推荐指定明确的异常类型,便于排错
    pass
```

- 首先，执行try子句(在 try 和 except 关键字之间的部分)。
- 如果没有异常发生，except子句在try语句执行完毕后就被忽略了。
- 如果在try子句执行过程中发生了异常，那么该子句其余的部分就会被忽略。如果异常匹配于except 关键字后面指定的异常类型，就执行对应的except子句。然后继续执行try语句之后的代码。
- 如果发生了一个异常，在except子句中没有与之匹配的分支，它就会传递到上一级try 语句中。如果最终仍找不到对应的处理语句，它就成为一个未处理异常，终止程序运行，显示提示信息。

**2. else:**  

```python
try:
    pass
except Exception as ex:
    pass
else:
    pass
```

如果没有出现异常,则执行else.

**3. finally: **  
异常还有一个`finally`分支:  

```python
try:
    pass
except Exception as ex:
    pass
finally:
    pass
```

不管执行try还是except.finally都会执行.当程序成功或失败,如果要做一些收尾工作(如清理临时文件)就可以使用finally语句.  

**4. 断言:**  
程序能一次写完并正常运行的概率很小,总会有各种各样的bug需要修正。有的bug很简单，看看错误信息就知道，有的bug很复杂，我们需要知道出错时，哪些变量的值是正确的，哪些变量的值是错误的，因此，需要一整套调试程序的手段来修复bug。  

1. 使用print()打印
2. 使用assert断言
3. 使用logging模块

```python
# -*- coding: utf-8 -*-

def fun(num):
    assert num.isdigit()
    print('num: ',num)

fun('1')    #'1'.isdigit()为True.执行后面的print语句
fun('a')    #'1'.isdigit()为False.断言失败，assert语句本身就会抛出AssertionError
```

>Note: 启动Python解释器时可以用-O参数来关闭assert.`python3 -O xxx.py`

**5. Python 内置异常:**  

```python
BaseException　　　　　　　　　　　　　　       所有异常基类
 +-- SystemExit　　　　　　　　　　　　　　　　  python解释器请求退出
 +-- KeyboardInterrupt　　　　　　　　　　　　  用户中断执行(通常是输入ctrl+C)
 +-- GeneratorExit　　　　　　　　　　　　　　  生成器(generator)发生异常来通知退出　
 +-- Exception　　　　　　　　　　　　　　　　   常规错误的基类
      +-- StopIteration　　　　　　　　　　　  迭代器没有更多的值
      +-- StandardError　　　　　　　　　　　  所有的内建标准异常的基类
      |    +-- BufferError　　　　　　　　　
      |    +-- ArithmeticError　　　　　　　  所有数值计算错误的基类
      |    |    +-- FloatingPointError　　  浮点计算错误
      |    |    +-- OverflowError　　　　　  数值运算超出最大限制
      |    |    +-- ZeroDivisionError　　　 除(或取模)零(所有数据类型)
      |    +-- AssertionError　　　　　　　  断言语句失败
      |    +-- AttributeError　　　　　　　  对象没有这个属性
      |    +-- EnvironmentError　　　　　   操作系统错误的基类
      |    |    +-- IOError　　　　　　　    输入输出失败
      |    |    +-- OSError　　　　　　　    操作系统错误　
      |    |         +-- WindowsError (Windows)　　　　windows系统调用失败
      |    |         +-- VMSError (VMS)　　　　　　　　　
      |    +-- EOFError　　　　　　　　　　   没有内建输入,到达EOF标记　　　　　　　　　　
      |    +-- ImportError　　　　　　　　   导入模块/对象 失败
      |    +-- LookupError　　　　　　　　   无效数据查询的基类
      |    |    +-- IndexError　　　　　　   序列中没有此索引(index)
      |    |    +-- KeyError　　　　　　　   映射中没有这个键
      |    +-- MemoryError　　　　　　　　   内存溢出错误(对于Python解释器不是致命的)
      |    +-- NameError　　　　　　　　　   未声明/初始化对象(没有属性)
      |    |    +-- UnboundLocalError　　  访问未初始化的本地变量
      |    +-- ReferenceError　　　　　　    弱引用(Weak reference)试图访问已经垃圾回收了的对象
      |    +-- RuntimeError　　　　　　　　一般的运行时错误
      |    |    +-- NotImplementedError　尚未实现的方法
      |    +-- SyntaxError　　　　　　　　 Pythony语法错误
      |    |    +-- IndentationError　　　缩进错误

      |    |         +-- TabError　　　　　Tab和空格混用
      |    +-- SystemError　　　　　　　　　一般的解释器系统错误
      |    +-- TypeError　　　　　　　　　　对类型无效的操作
      |    +-- ValueError　　　　　　　　　传入无效的参数
      |         +-- UnicodeError　　　　　Unicode相关错误
      |              +-- UnicodeDecodeError　　　　Unicode解码时错误
      |              +-- UnicodeEncodeError　　　　Unicode编码时错误
      |              +-- UnicodeTranslateError　　 Unicode转换时错误
      +-- Warning　　　　　　　　　　　　　　　 警告的基类　　　　　　　
           +-- DeprecationWarning　　　　　　关于被启用的特征的警告
           +-- PendingDeprecationWarning　　关于构造将来语义会有改变的警告
           +-- RuntimeWarning 　　　　　　　 可疑的运行时行为的警告
         +-- SyntaxWarning　　　　　　　     可疑的语言的警告　　
           +-- UserWarning　　　　　　　　   用户代码生成警告
           +-- FutureWarning
       +-- ImportWarning　　　　　　      导入模块/对象警告
       +-- UnicodeWarning　　　　　　     Unicode警告
       +-- BytesWarning　　　　　　　      Bytes警告
　　　　　　 +-- Overflow Warning　　　　　　旧的关于自动提升为长整型(long)的警告
```


**6. 自定义异常:**  
在某些业务场景中,python内置的异常无法满足业务逻辑,这时就需要自定义异常来满足需求.  

```python
class MyError(Exception):
    def __init__(self, value):
        self.value = value
    def __str__(self):
        return repr(self.value)

try:
    raise MyError(2*2)
except MyError as e:
    print('My exception occurred, value:', e.value)
```

---

### 线程和进程
**0. 概述**  
有兴趣可以先了解[中央处理器](https://zh.wikipedia.org/wiki/%E4%B8%AD%E5%A4%AE%E5%A4%84%E7%90%86%E5%99%A8).  

[多任务处理](https://zh.wikipedia.org/wiki/%E5%A4%9A%E4%BB%BB%E5%8A%A1%E5%A4%84%E7%90%86)是指计算机同时运行多个程序的能力。多任务的一般方法是运行第一个程序的一段代码，保存工作环境；再运行第二个程序的一段代码，保存环境；……恢复第一个程序的工作环境，执行第一个程序的下一段代码……现代的多任务，每个程序的时间分配相对平均。  
因为CPU运行的速度非常非常快,就算是单核CPU运行了多个任务,我们也感觉像是同时运行一样.  
现代CPU至少是双核,四核,甚至多核CPU了.但是如果有大量的任务要执行,操作系统还是会将任务分配到每个核心上去执行.

当操作系统运行一个任务时,就需要启动一个进程(process)了.如果这个进程不只是干一件事,那么它就需要启动多个线程(thread)来帮忙了.  

要实现多任务处理,有以下三种方式:  

1. 多进程
2. 多线程
3. 多进程+多线程

**1. 进程(process)**  
进程就是计算机程序(代码文件)执行的一个实例.  

每个进程提供了执行了执行程序所需的资源.启动进程的同时还要再启动一个线程,称为主线程,但是可以创建不止一个线程.  

**2. 线程(Thread)**  
线程是操作系统能够进行运算调度的最小单位。它被包含在进程之中，是进程中的实际运作单位。一条线程指的是进程中一个单一顺序的控制流，一个进程中可以并发多个线程，每条线程并行执行不同的任务.  

**3. 进程和线程之间的区别**  
>这里所说的线程都是由一个进程创建的.进程创建的第一个线程称为主线程.

1. 同一进程创建的多个线程共享一个内存空间; 而进程是独享各自的内存空间
2. 线程可直接访问进程数据; 进程都有各自的数据拷贝,哪怕是父进程与子进程
3. 线程之间可以直接通信; 进程之间不能直接通信,需要通过额外的进程
4. 创建一个新线程花费的代价很小; 创建一个子进程需要复制父进程的所有数据
5. 子线程可以执行很多动作控制其他子线程; 父进程只能对子进程执行kill
6. 改变主线程可能会影响其他子线程的行为; 改变父进程不会影响到子进程.

**4. Python GIL(Global Interpreter Lock)**  
>Note: 摘自[维基百科解释](https://zh.wikipedia.org/wiki/GIL):  

GIL，即全局解释器锁，是计算机程序设计语言解释器用于同步线程的工具，使得任何时刻仅有一个线程在执行。常见例子有CPython（JPython不使用GIL)。

Python 的 GIL:  

- CPython的线程是操作系统的原生线程。在Linux上为pthread，在Windows上为Win thread，完全由操作系统调度线程的执行。一个python解释器进程内有一条主线程，以及多条用户程序的执行线程。即使在多核CPU平台上，由于GIL的存在，所以禁止多线程的并行执行。
- Python解释器进程内的多线程是合作多任务方式执行。当一个线程遇到I/O任务时，将释放GIL。计算密集型（CPU-bound）的线程在执行大约100次解释器的计步（ticks）时，将释放GIL。计步（ticks）可粗略看作Python虚拟机的指令。计步实际上与时间片长度无关。可以通过sys.setcheckinterval()设置计步长度。
- 在单核CPU上，数百次的间隔检查才会导致一次线程切换。在多核CPU上，存在严重的线程颠簸（thrashing）。
- Python 3.2开始使用新的GIL。在新的GIL实现中，用一个固定的超时时间来指示当前的线程放弃全局锁。在当前线程保持这个锁，且其他线程请求这个锁的时候，当前线程就会在5ms后被强制释放掉这个锁。
可以创建独立的进程来实现并行化。Python 2.6引进了multiprocessing这个多进程包。或者把关键部分用C/C++写成 Python 扩展，通过cytpes使Python程序直接调用C语言编译的动态库的导出函数。

---

### threading 模块  
**线程有两种调用方式:**  

- 直接调用  

```python
# -*- coding: utf-8 -*-

import threading
import time

def sayhi(num): #定义每个线程要运行的函数
    print("running on number:%s" %num)
    time.sleep(3)

if __name__ == '__main__':
    t1 = threading.Thread(target=sayhi,args=(1,)) #生成一个线程实例
    t2 = threading.Thread(target=sayhi,args=(2,)) #生成另一个线程实例

    t1.start() #启动线程
    t2.start() #启动另一个线程

    print(t1.getName()) #获取线程名
    print(t2.getName())

```


- 继承调用  

```python
# -*- coding: utf-8 -*-

import threading
import time

class MyThread(threading.Thread):
    def __init__(self,num):
        threading.Thread.__init__(self) #继承父类的init方法,必须写
        #新式类写法:
        #super(MyThread,self).__init__(self)
        self.num = num

    def run(self):#定义每个线程要运行的函数,必须写
        print("running on number:%s" %self.num)
        time.sleep(3)

if __name__ == '__main__':
    t1 = MyThread(1)
    t2 = MyThread(2)
    t1.start()  #start()调用run()方法
    t2.start()
```

在运行线程时,还可以使用jion()方法去等待线程执行完毕.如果线程未执行完,则jion()方法会阻塞等待.

**守护线程**  
如果将线程设为守护模式,那么其子线程不管是否执行完毕,都会立即终止.  

```python
# -*- coding: utf-8 -*-

import threading
import time

def run(n):
    print('[%s]------running----\n' % n)
    time.sleep(10)
    print('--done--')

def main():
    for i in range(5):
        t = threading.Thread(target=run,args=[i,])
        t.start()
        print('starting thread', t.getName())

if __name__ == '__main__':
    m = threading.Thread(target=main,args=[])
    m.setDaemon(True) #将主线程设置为Daemon线程,它退出时,其它子线程会同时退出,不管是否执行完任务
    m.start()
    print("---main thread done----")
```


**线程锁(互斥锁)**  
开启100个线程对同一份数据进行操作:  
未加锁 process_no_lock.py:

```python
import time
import threading
 
def minusNum():
    global num #在每个线程中都获取这个全局变量
    time.sleep(1)   #这里sleep是为了让创建的所有线程尽可能的并发执行下面的-1操作
    print('--get num:',num )
    num  -=1 #对此公共变量进行-1操作

if __name__ == '__main__':
    num = 100  #设定一个公共变量
    thread_list = []    #保存创建的线程对象
    for i in range(100):
        t = threading.Thread(target=minusNum)
        t.start()
        thread_list.append(t)
    for t in thread_list: #等待所有线程执行完毕
        t.join()

    print('final num:', num )
```

多次执行`python2.7 process_no_lock.py`会发现其结果不是我们所期待的0.  
代码执行过程:

1. 定义函数,变量
2. 循环创建100个线程,执行addNum(因为执行速度超级快,所以可认为是并发)
3. 当100个线程并发执行,那么这100个线程也就同时拿到了num这个变量,并提交给系统进行`-1`操作
4. 然后这100个线程拿着计算完的结果(存在不同线程计算结果一致的情况)在去赋值给num变量.根据执行顺序,后面的线程会冲掉前面的线程结果
5. 由于线程的不可确定,所以计算结果就可能会出现错误

>此段代码在python3下测试结果都为0.

解决办法:  
对变量num加上一把锁,只允许一个线程进行操作.这样下一个线程进行操作时必须等待上一个线程锁释放.  
加锁 process_lock.py

```python
import time
import threading

def addNum():
    global num #在每个线程中都获取这个全局变量
    time.sleep(1)   #这里sleep是为了让创建的所有线程尽可能的并发执行下面的-1操作
    print('--get num:',num )
    lock.acquire() #修改数据前加锁
    num  -=1 #对此公共变量进行-1操作
    lock.release() #修改后释放

if __name__ == '__main__':
    num = 100  #设定一个公共变量
    lock = threading.Lock()
    thread_list = []    #保存创建的线程对象
    for i in range(100):
        t = threading.Thread(target=addNum)
        t.start()
        thread_list.append(t)
    for t in thread_list: #等待所有线程执行完毕
        t.join()

    print('final num:', num )
```


**递归锁**

示例代码:  

```python
import threading,time

'''
run1获取num,加锁执行+1操作,完毕释放锁
'''
def run1():
    print("grab the first part data")
    lock.acquire()
    global num
    num +=1
    lock.release()
    return num

'''
run2获取num2,加锁执行+1操作,完毕释放锁
'''
def run2():
    print("grab the second part data")
    lock.acquire()
    global  num2
    num2+=1
    lock.release()
    return num2

'''
run3加锁后执行run1和run2,完毕后释放锁
'''
def run3():
    lock.acquire()
    res = run1()
    print('--------between run1 and run2-----')
    res2 = run2()
    lock.release()
    print(res,res2)

if __name__ == '__main__':
    num,num2 = 0,0
    lock = threading.RLock()    #定义一个递归锁
    for i in range(10):     #创建10个线程,执行run3
        t = threading.Thread(target=run3)
        t.start()

    while threading.active_count() != 1:    #如果存活线程数不等于1,则打印线程数
        print(threading.active_count())
    else:                                   #当为1时,则说明线程都执行完毕了.
        print('----all threads done---')
        print(num,num2)
```

像 `run3` 函数中,加锁后执行了带有加锁操作的 `run1` 和 `run2`.这样的加锁就是递归锁.  
如果将递归锁改成线程锁,则代码执行会陷入死循环.因为线程锁不能确定哪个锁对应哪个操作.  

**Semaphore(信号量)**  
线程锁同时只允许一个线程修改数据,而信号量则允许多个线程同时修改数据.  

```python
import threading,time
 
def run(n):
    semaphore.acquire()
    time.sleep(1)
    print("run the thread: %s\n" %n)
    semaphore.release()
 
if __name__ == '__main__':
 
    num= 0
    semaphore  = threading.BoundedSemaphore(5) #最多允许5个线程同时运行
    for i in range(20):
        t = threading.Thread(target=run,args=(i,))
        t.start()
 
while threading.active_count() != 1:
    pass #print('active count: ',threading.active_count()    #打印还存活的线程数.为了更直观的观察结果,这里pass掉
else:
    print('----all threads done---')
    print(num)
```

**Event**  
event object 可以用来做线程交互.  
event管理着一个falg,通过 set()方法设置flag为True,clear()方法设置flag为false. wait()方法可以阻塞直到flag为true.flag初始为false.  

通过Event来实现两个或多个线程间的交互，下面是一个红绿灯的例子，即起动一个线程做交通指挥灯，生成几个线程做车辆，车辆行驶按红灯停，绿灯行的规则。  

process_event.py:  

```python
# -*- coding: utf-8 -*-

import threading,time
import random

'''
定义红绿灯,event的flas初始为flase
'''
def light():
    if not event.is_set():
        event.set() #flag为true,wait就不阻塞 #绿灯状态
    count = 0
    while True:
        if count < 10:  #0-9,为绿灯
            print('\033[42;1m--green light on---\033[0m')
        elif count <13: #10-12,为黄灯
            print('\033[43;1m--yellow light on---\033[0m')
        elif count <20: #13-19,为红灯
            if event.is_set():
                event.clear()   #设置flag为false,打开红灯
            print('\033[41;1m--red light on---\033[0m')
        else:
            count = 0
            event.set() #设置flag为true,打开绿灯
        time.sleep(1)
        count +=1

def car(n):
    while 1:    #死循环
        time.sleep(random.randrange(10))    #随机等待几秒,模拟车辆出现的间隔
        if  event.is_set(): #判断event的flag
            print("car [%s] is running.." % n)
        else:
            print("car [%s] is waiting for the red light.." %n)
            event.wait()    #检测event

if __name__ == '__main__':
    event = threading.Event()
    Light = threading.Thread(target=light)  #一个线程执行light方法,会根据count改变其flag
    Light.start()
    for i in range(3):  #在开启三个线程执行car方法
        t = threading.Thread(target=car,args=(i,))
        t.start()
```


执行`python3 process_event.py`

### multiprocessing
**multiprocessing**是一个调用系统API的支持批量创建进程的包,类似**threading**模块.  
**multiprocessing**包提供了本地和远程并发,实际上它使用**subprocess**来代替线程绕过GIL.它允许程序员充分的利用多进程来使用硬件资源.它同时支持类unix和windows.  

**1. 创建进程**
示例代码:  

```python
# -*- coding: utf-8 -*-

from multiprocessing import Process
import time

def f(name):
    time.sleep(2)
    print('hello',name)


if __name__ == '__main__':
    pro_list = []
    for i in range(10):
        p = Process(target=f,args=(i,))
        p.start()
        pro_list.append(p)

    for i in pro_list:
        i.join()

    print('--- main ---')
```

**2. 理解父进程子进程**  
示例代码:  

```python
# -*- coding: utf-8 -*-

from multiprocessing import Process
import os

def info(title):
    print(title)
    print('module name:', __name__)
    print('parent process:', os.getppid())  #获取父进程号
    print('process id:', os.getpid())   #获取当前进程号
    print("\n")

def f(name):
    info('\033[31;1mfunction f\033[0m') #调用info方法
    print('hello', name)

if __name__ == '__main__':
    info('\033[32;1mmain process line\033[0m')
    p = Process(target=f, args=('bob',))    #创建一个新的进程执行
    p.start()
    p.join()

```

执行脚本 `python3 mul_process.py`,输出如下:  

```python
main process line
module name: __main__
parent process: 18588   #这是调用python3解释器的进程号
process id: 21849   #这是执行脚本的进程号


function f
module name: __main__
parent process: 21849   #这是执行脚本的进程号
process id: 21880   #这是执行脚本的进程所创建的子进程号


hello bob
```

**3. 进程间的通信**  
不同进程间是无法直接通信的.如果想要不同进程间通信,可以使用以下方法:  

- Queues  

> Note: 队列是线程安全的.因为它保证最多只有一个线程来处理,就好比加锁控制.

**multiprocessing.Queues**对Queues进行封装,可以让父进程和子进程进行通信.  

```python
# -*- coding: utf-8 -*-

from multiprocessing import Process, Queue

def f(q):   #传入一个队列,执行put操作
    q.put([42, None, 'hello'])

if __name__ == '__main__':
    q = Queue() #实例化一个q队列
    p = Process(target=f, args=(q,))    #创建一个子进程,执行f方法,并把q传入
    p.start()
    print(q.get())    #父进程获取子进程添加到队列的数据
    p.join()
```


- Pipes  
multiprocessing.Pipe([duplex])方法返回一对pipe两端的连接对象.  
如果duplex是True(default True) 那么pipe就是双向的,否则就是单向的.一端的对象只能发送,另一端的对象只能接受.  

示例代码:  

```python
# -*- coding: utf-8 -*-

from multiprocessing import Process, Pipe
 
def f(conn):    #发送数据
    conn.send([42, None, 'hello'])
    conn.close()
 
if __name__ == '__main__':
    conn1, conn2 = Pipe()
    p = Process(target=f, args=(conn1,))    #创建一个进程,使用conn1发送数据
    p.start()
    print(conn2.recv())   #使用conn2接受数据, prints "[42, None, 'hello']"
    p.join()
```

**4. Manager**  
Managers 提供了一个不同进程间共享一份数据的方法,包括共享不同机器上的进程.managers对象控制了一个服务进程来管理共享对象.其他进程可以使用proxies访问共享对象.  

使用manager可以真正的实现多进程同时修改一份数据,而上面使用的Queues和pipes只是通过数据传递达到不同进程间操作一份数据.  

manager支持的数据类型有list,dict,namespace,lock,rlock, Semaphore, BoundedSemaphore, Condition, Event, Barrier, Queue, Value and Array.  

示例代码:  

```python
# -*- coding: utf-8 -*-

from multiprocessing import Process, Manager
 
def f(d, l):
    d[1] = '1'
    d['2'] = 2
    d[0.25] = None
    l.append(1)
    print(l)
 
if __name__ == '__main__':
    with Manager() as manager:  #类似打开一个文件对象,操作完后自动关闭
        d = manager.dict()  #创建一个manager dict
 
        l = manager.list(range(5))  #创建一个janager list
        p_list = []
        for i in range(10): #创建10个进程,执行f
            p = Process(target=f, args=(d, l))
            p.start()
            p_list.append(p)
        for res in p_list:  #等待10个进程执行完毕
            res.join()
 
        print(d)    #打印
        print(l)
```


**5. process synchronize**  
示例代码:  

```python
# -*- coding: utf-8 -*-

from multiprocessing import Process, Lock
 
def f(l, i):
    l.acquire()
    try:
        print('hello world', i)
    finally:
        l.release()
 
if __name__ == '__main__':
    lock = Lock()
 
    for num in range(100):
        Process(target=f, args=(lock, num)).start()
```

>Note: python2.x下不加锁,程序结果可能会不一致, 但是3.x下加不加锁结果都一致.

**6. process pool**  
A process pool object 控制一个工作的进程池来分配进程接受哪些jobs.  
进程池内部维护一个进程序列，当使用时，则去进程池中获取一个进程，如果进程池序列中没有可供使用的进进程，那么程序就会等待，直到进程池中有可用进程为止。  

进程池主要使用两个方法:  

- apply,同步
- aaply_async,异步

示例代码:  

```python
# -*- coding: utf-8 -*-


from  multiprocessing import Process,Pool
import time

def Foo(i):
    time.sleep(2)
    return i+100

def Bar(arg):
    print('-->exec done:',arg)


if __name__ == '__main__':
    #freeze_support()   windows导入freeze_support并上加上这句,防止意外
    pool = Pool(5)  #进程池对象,最多有5个进程同时运行

    for i in range(10):
        pool.apply_async(func=Foo, args=(i,),callback=Bar)  #callback: Foo执行完后在执行Bar
        #pool.apply(func=Foo, args=(i,))

    print('end')
    pool.close()
    pool.join() #进程池中进程执行完毕后再关闭，如果注释，那么程序直接关闭。
```

---

### paramiko 模块
paramiko 模块，该模块基于SSH用于连接远程服务器并执行相关操作.  

>Note: paramiko (1.16.0), python (3.5.1)


SSHClient示例代码:  

```python
import paramiko

# 创建SSH对象
ssh = paramiko.SSHClient()
# 允许连接不在know_hosts文件中的主机
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
# 连接服务器
ssh.connect(hostname='localhost', port=22, username='username', password='password')

# 执行命令
stdin, stdout, stderr = ssh.exec_command('df')
# 获取命令结果,为bytes类型
result = stdout.read()

# 关闭连接
ssh.close()
```

### day8 end
