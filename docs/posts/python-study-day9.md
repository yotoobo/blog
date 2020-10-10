---
title: "Python study day9"
date: 2016-03-28
categories: 
 - Python
---

### queue队列
**1. 简介**  
队列在多线程的应用中是十分有用的,因为它是线程安全的.队列最多只允许一个线程去操作数据,直到线程执行完毕后下一个线程在继续操作.效果类似于给数据使用__线程锁__,__递归锁__等!

队列有三种类型:  

1. class queue.Queue(maxsize=0) -> 先进先出
2. class queue.LifeQueue(maxsize=0) -> 后进先出
3. class queue.PriorityQueue(maxsize=0) -> 存储队列时可设置优先级

<!--more-->

>PriorityQueue()在put时,要传入一个元组: (priority_number, data).其中numer越小优先级越高.

其中, 有两种异常:

1. exception queue.Empty
>在一个空的队列对象中调用 non-block get() (or get_nowait())时抛出此异常

2. exception queue.Full
>在一个已满的队列对象中调用 non-block put() (or put_nowait())时抛出此异常

**2. Queue object**  
Queue对象提供了以下方法:

- Queue.qsize()
>返回队列大小

- Queue.empty()
>如果队列为空,返回True;否则返回False

- Queue.full()
>如果队列已满,返回True;否则返回False

- Queue.put(item,block=True,timeout=None)
>添加item到队列中.当队列已满时,如果block=True,则put()会阻塞执行.否则put()直接抛出Full异常;如果timeout设了一个非0数n,不管block如何,put都会在n秒之后抛出异常.

- Queue.put_nowait(item)
>与put(item,block=False)相同

- Queue.get(block=True,timeout=None)
>从队列中取出元素.当队列为空时,如果block=True,则get()会阻塞等待.否则get()会抛出Empty异常;如果timeout设置了非0数n,不管block如何,get()都会在n秒之后抛出异常

- Queue.get_nowait()
>与get(block=False)相同

- Queue.task_done()
- Queue.join()
>task_done()和join()方法等到生产者消费者的示例代码中说明.

**3. 示例代码**  

- 创建队列

```python
# FIFO
In [58]: q = queue.Queue(4)
In [59]: q.put(1)
In [60]: q.put(2)
In [61]: q.get()
Out[61]: 1

# LIFO
In [62]: q = queue.LifoQueue(4)
In [63]: q.put(1)
In [64]: q.put(2)
In [65]: q.get()
Out[65]: 2

# PriorityQueue
In [66]: q = queue.PriorityQueue(4)
In [67]: q.put((10,1))
In [68]: q.put((1,11))
In [69]: q.get()
Out[69]: (1, 11)

```

- 异常

```python
In [71]: q = queue.Queue(1)
In [72]: q.put(1)
In [73]: q.put(2,block=False)
---------------------------------------------------------------------------
Full                                      Traceback (most recent call last)
<ipython-input-73-e9eafd01926e> in <module>()
----> 1 q.put(2,block=False)

/Users/ifree/.pyenv/versions/3.5.1/lib/python3.5/queue.py in put(self, item, block, timeout)
    128                 if not block:
    129                     if self._qsize() >= self.maxsize:
--> 130                         raise Full
    131                 elif timeout is None:
    132                     while self._qsize() >= self.maxsize:

Full:
```

---


### 生产者消费者模型

**1. 简介**  
**生产者就是生产数据的线程，消费者就是消费数据的线程。**在多线程开发当中，如果生产者处理速度很快，而消费者处理速度很慢，那么生产者就必须等待消费者处理完，才能继续生产数据。同样的道理，如果消费者的处理能力大于生产者，那么消费者就必须等待生产者。为了解决这个问题于是引入了生产者和消费者模式。

生产者和消费者不进行直接通信,而是通过第三方.生产者生产数据交由第三方,消费者直接找第三方获取数据.这样就大大平衡了生产者和消费者的处理能力.

>[维基百科](https://zh.wikipedia.org/wiki/%E7%94%9F%E4%BA%A7%E8%80%85%E6%B6%88%E8%B4%B9%E8%80%85%E9%97%AE%E9%A2%98):  
生产者消费者问题（英语：Producer-consumer problem），也称有限缓冲问题（英语：Bounded-buffer problem），是一个多线程同步问题的经典案例。该问题描述了两个共享固定大小缓冲区的线程——即所谓的“生产者”和“消费者”——在实际运行时会发生的问题。生产者的主要作用是生成一定量的数据放到缓冲区中，然后重复此过程。与此同时，消费者也在缓冲区消耗这些数据。该问题的关键就是要保证生产者不会在缓冲区满时加入数据，消费者也不会在缓冲区中空时消耗数据。

**2. 顾客吃包子和厨师做包子**  

![吃包子](http://s3.51cto.com/wyfs02/M00/74/55/wKioL1YaZuXD7ML-AABsJiq32LM738.jpg)

厨师相当于生产者(**生成数据的线程**)，顾客相当于消费者(**消费数据的线程**)，顾客吃包子，厨师做包子。做一个假设，厨师做包子要花一定的时间,有这样一种情况: 厨师做好一个包子给第一个顾客吃,然后才能继续做包子给下一个顾客（这时我们说厨师与顾客的耦合度高，即厨师做包子与顾客吃包子是紧密相连的），当顾客一多,消费者就要等很久(时间与顾客人数呈线性增长),这样显然效率会很低.  

那么可以尝试这么解决: 厨师提前准备一定量的包子放在,这样顾客来后厨师直接从准备好的包子给顾客(顾客就不用等待了).当包子的存量不够了,厨师就开始做包子.不过这里也有问题: 当厨师在做包子的时候,有顾客要包子,但是厨师显然不能回应顾客,因为他要先做包子,所以顾客要等待厨师做完包子.

这时,就发现由厨师和顾客直接交流的效率很低,得要让厨师专心做包子,而不用关心顾客.所以就需要找一个服务员(**队列**).顾客要包子直接找服务员.当包子不够的时候由服务员通知厨师.这样,厨师专心做包子,顾客专心吃包子,服务员来传递他们之间的消息.大大提高了效率.


**2.1 示例代码**

```python
# -*- coding: utf-8 -*-

import time,random
import queue,threading

# 创建一个队列(招一个服务员q)
q = queue.Queue()

# 定义生产者
def Producer(name):
  count = 1 #生成的每个包子的标识
  while True:
    time.sleep(random.randrange(3)) # 生成包子的要花费的时间
    if q.size() < 3:    #当生产者产生的数据大于消费的数据,如果不对队列加以控制,则会出现生产过剩.因为join()是针对所有的生产者的,当队列为空时,会通知所有的生产者去生产.
        q.put(count)
        print('Producer %s has produced %s baozi..' %(name, count))
        q.join()  #阻塞,生产者就一直等待.直到队列为空.
        print('Baozi mei le!')
        count +=1

# 定义消费者
def Consumer(name):
    while True:
        time.sleep(random.randrange(4))
        print('\033[32;1mConsumer %s has eat %s baozi...\033[0m' %(name, q.get()))
        q.task_done()   #个人理解:好比队列有个计数器,当每次get()后,执行task_done().队里的计数器就会自减,当队列为空时,则触发q.join

if __name__ == '__main__':
    p1 = threading.Thread(target=Producer, args=('A1',))
    p2 = threading.Thread(target=Producer, args=('A2',))
    p3 = threading.Thread(target=Producer, args=('A3',))
    p4 = threading.Thread(target=Producer, args=('A4',))
    c1 = threading.Thread(target=Consumer, args=('B1',))
    c2 = threading.Thread(target=Consumer, args=('B2',))

    p1.start()
    p2.start()
    p3.start()
    p4.start()
    c1.start()
    c2.start()
```

生产者消费者模型对于程序的解耦,降低系统之间的直接关联是十分有效的,根据实际情况生产者和消费者可以任意设定:

![xxx](http://7xj980.com1.z0.glb.clouddn.com/sc.png)

---


### 协程
**1. 简介**  
协程是一种用户态的轻量级线程,系统并不知晓它的存在.

协程拥有自己的寄存器上下文和栈。协程调度切换时，将寄存器上下文和栈保存到其他地方，在切回来的时候，恢复先前保存的寄存器上下文和栈。因此：  
协程能保留上一次调用时的状态（即所有局部状态的一个特定组合），每次过程重入时，就相当于进入上一次调用的状态，换种说法：进入上一次离开时所处逻辑流的位置。

协程的优点:

- 无需上下文切换的开销
- 无需原子操作锁定及同步的开销(因为协程是串行)
- 方便切换控制流,简化编程模型
- 高并发,高扩展性,低成本.一个cpu支持上万个协程都可以的.

同时,也有以下缺点:

- 无法利用多核.因为协程的本质是单线程
>解决办法: 使用多进程+线程(使用协程)的方式

- 进行阻塞操作(如IO操作)时会阻塞整个程序
>解决办法: 在遇到阻塞时进行切换.


**2. greenlet 和 gevent 模块**  
默认情况下协程阻塞会阻塞整个程序.要想在阻塞时,切换到另一个协程去,就需要借助第三方模块了.  
主要是:

- greenlet
- gevent

>Note: 任何时刻都有且只有一个协程在执行,因为它是串行的.

`gevent`是一个第三方库,是在`greenlets`的基础上实现的.在gevent中用到的主要模式是Greenlet, 它是以C扩展模块形式接入Python的轻量级协程。 Greenlet全部运行在主程序操作系统进程的内部，但它们被协作式地调度。


**2.1 使用gevent实现简单并发**

```python
# -*- coding: utf-8 -*-

import gevent
 
def foo():
    print('Running in foo')
    gevent.sleep(0) #模拟阻塞
    print('Explicit context switch to foo again')
 
def bar():
    print('Explicit context to bar')
    gevent.sleep(0)
    print('Implicit context switch back to bar')
 
gevent.joinall([    #joinall等待协程执行完毕.
    gevent.spawn(foo),  #启动一个协程,执行foo
    gevent.spawn(bar),  #启动一个协程,执行bar
])
```

**2.2 使用gevent实现socket并发**

server 端:

```python
# -*- coding: utf-8 -*-

import gevent

'''gevent封装了socket类.已经不是阻塞了
但如果使用原生socket类,则需要用monkey来进行加工,使其为非阻塞
'''
from gevent import socket,monkey
monkey.patch_all()

def server(port):
    s = socket.socket()
    s.bind(('0.0.0.0', port))
    s.listen(500)
    while True:
        '''接受客户端连接
        每当进来一个新连接,就启动一个协程单独处理它.
        spawn()接受两个参数,第一个为要执行的函数,第二个为新连接对象
        '''
        cli, addr = s.accept()
        gevent.spawn(handle_request, cli)
def handle_request(s):
    try:
        while True:
            data = s.recv(1024)
            print("recv:", data)
            s.send(data)
            if not data:
                s.shutdown(socket.SHUT_WR)
    except Exception as  ex:
        print(ex)
    finally:
        s.close()

if __name__ == '__main__':
    server(8001)
```

client 端:

```python
# -*- coding: utf-8 -*-
import socket

HOST = 'localhost'    # The remote host
PORT = 8001           # The same port as used by the server

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect((HOST, PORT))
while True:
    msg = bytes(input(">>:"),encoding="utf8")
    if len(msg) == 0: continue
    s.sendall(msg)
    data = s.recv(1024)
    print('Received', repr(data))
```

---

### 论事件驱动与异步IO

**1. 简介**  
事件驱动编程是一种编程范式，这里程序的执行流由外部事件来决定。它的特点是包含一个事件循环，当外部事件发生时使用回调机制来触发相应的处理。另外两种常见的编程范式是（单线程）同步以及多线程编程。

让我们用例子来比较和对比一下单线程、多线程以及事件驱动编程模型。下图展示了随着时间的推移，这三种模式下程序所做的工作。这个程序有3个任务需要完成，每个任务都在等待I/O操作时阻塞自身。阻塞在I/O操作上所花费的时间已经用灰色框标示出来了。

![xx](http://www.aosabook.org/images/twisted/threading_models.png)


在单线程同步模型中，任务按照顺序执行。如果某个任务因为I/O而阻塞，其他所有的任务都必须等待，直到它完成之后它们才能依次执行。这种明确的执行顺序和串行化处理的行为是很容易推断得出的。如果任务之间并没有互相依赖的关系，但仍然需要互相等待的话这就使得程序不必要的降低了运行速度。

在多线程版本中，这3个任务分别在独立的线程中执行。这些线程由操作系统来管理，在多处理器系统上可以并行处理，或者在单处理器系统上交错执行。这使得当某个线程阻塞在某个资源的同时其他线程得以继续执行。与完成类似功能的同步程序相比，这种方式更有效率，但程序员必须写代码来保护共享资源，防止其被多个线程同时访问。多线程程序更加难以推断，因为这类程序不得不通过线程同步机制如锁、可重入函数、线程局部存储或者其他机制来处理线程安全问题，如果实现不当就会导致出现微妙且令人痛不欲生的bug

在异步版本中，3个任务交错执行，但仍然在一个单独的线程控制中。当处理I/O或者其他昂贵的操作时，注册一个回调到事件循环中，然后当I/O操作完成时继续执行。回调描述了该如何处理某个事件。事件循环轮询所有的事件，当事件到来时将它们分配给等待处理事件的回调函数。这种方式让程序尽可能的得以执行而不需要用到额外的线程。事件驱动型程序比多线程程序更容易推断出行为，因为程序员不需要关心线程安全问题。

**2. select/poll/epoll**

异步IO主要有三种:

1. select  

    >它通过一个select()系统调用来监视多个文件描述符的数组，当select()返回后，该数组中就绪的文件描述符便会被内核修改标志位，使得进程可以获得这些文件描述符从而进行后续的读写操作。
    select()将就绪的文件描述符告诉进程后，如果进程没有对其进行IO操作，那么下次调用select()和poll()的时候将再次报告这些文件描述符，所以它们一般不会丢失就绪的消息，这种方式称为水平触发（Level Triggered）。
    
    >缺点:  
    1. 随着文件描述符越多,其维护的成本也越大.  
    2. select()获得文件描述符的数据后,都会执行一次全扫描.尤其在数组很大时,效率极其低下
    3. 在*unix平台下,默认是有文件描述符的限制.但可以修改它.

2. poll

    >相对于select,poll取消了默认文件描述符的限制.

3. epoll

    >epoll可以同时支持水平触发和边缘触发（Edge Triggered，只告诉进程哪些文件描述符刚刚变为就绪状态，它只说一遍，如果我们没有采取行动，那么它将不会再次告知，这种方式称为边缘触发），理论上边缘触发的性能要更高一些，但是代码实现相当复杂。

    >epoll同样只告知那些就绪的文件描述符，而且当我们调用epoll_wait()获得就绪文件描述符时，返回的不是实际的描述符，而是一个代表就绪描述符数量的值，你只需要去epoll指定的一个数组中依次取得相应数量的文件描述符即可，这里也使用了内存映射（mmap）技术，这样便彻底省掉了这些文件描述符在系统调用时复制的开销。

    >另一个本质的改进在于epoll采用基于事件的就绪通知方式。在select/poll中，进程只有在调用一定的方法后，内核才对所有监视的文件描述符进行扫描，而epoll事先通过epoll_ctl()来注册一个文件描述符，一旦基于某个文件描述符就绪时，内核会采用类似callback的回调机制，迅速激活这个文件描述符，当进程调用epoll_wait()时便得到通知。



**2.1 使用select实现socket多连接**

server 端:

```python
# 导入模块select,socket,sys,queue
import select
import socket
import sys
import queue

# 创建一个名叫server的socket实例(使用IPV4,流套接字)
server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# 设置server为非阻塞,哪怕没有接受到数据
server.setblocking(False)

# 设置server的侦听地址
server_address = ('localhost', 10000)
# 如果程序出错,则打印错误信息
print(sys.stderr, 'starting up on %s port %s' % server_address)
# 将socket实例绑定到设定的地址
server.bind(server_address)

# server实例最多维护的侦听队列为5
server.listen(5)

'''定义三个通信列表供select.select()使用
inputs: 客户端输入的数据
outputs: 要发送给客户端的数据
还有一个错误列表,这里使用inputs列表,即默认所有客户端输入都可能出错,

将server实例加入到inputs中,这是为了第一次执行程序,满足有客户端连接的条件(第41行)
'''
inputs = [ server ]

outputs = [ ]

# 保存新连接对象的信息,key为新连接对象名,value为队列(每个连接都有自己的队列保存信息)
message_queues = {}

#此时inputs已经有一个server对象,满足条件
while inputs:

    # 打印信息
    print( '\nwaiting for the next event')

    '''select.select()方法接收并监控3个通信列表，
    第一个是所有的输入的data(即定义的inputs列表),就是指外部发过来的数据，
    第2个是监控和接收所有要发出去的data(即定义的outputs列表)
    第3个监控错误信息，这里使用inputs列表

    将三个列表传给select()后,会返回三个新的列表
    readable: 里面的socket对象有数据接收
    writeable: 里面的socket对象有数据发送
    exceptional: socket出现错误会添加到此列表中
    '''
    readable, writable, exceptional = select.select(inputs, outputs, inputs,2)  #2为超时时间(不设置为阻塞等待)
    # 遍历readable列表,判断每个socket对象
    for s in readable:
        #如果s 为 server对象,那么就说明readable处于就绪状态,等待新连接
        if s is server:
            # 接受新的客户端连接
            connection, client_address = s.accept()
            # 打印新连接的客户端地址
            print('new connection from', client_address)
            # 设置新连接对象为非阻塞模式
            connection.setblocking(False)
            # 将新连接对象添加到inputs列表中,如果此时接受数据,则无法接受新连接,所以要添加到inuts,留待下一次select()
            inputs.append(connection)

            # 每个连接都有自己的数据,为了避免数据互相污染.为每个连接创建一个队列来存储各自的数据
            message_queues[connection] = queue.Queue()
            '''不为server对象,说明是有数据的连接
            因为当为server时,接受了客户端的新连接并加入inputs了.
            '''
        else:
            # 接受数据
            data = s.recv(1024)
            # 如果数据不为空
            if data:
                # 打印接受到的数据及s的远端地址,如果有错误也打印出来
                print(sys.stderr, 'received "%s" from %s' % (data, s.getpeername()) )
                # 将接受的数据添加到以它命名的队列中
                message_queues[s].put(data)
                # 如果s不在outputs列表中,则添加进去
                if s not in outputs:
                    outputs.append(s)
            else:
                # 没有接受到数据,可认为客户端已断开
                # 打印关闭信息和客户端连接地址
                print('closing', client_address, 'after reading no data')
                # 判断s是否在outputs列表中
                # 如果存在,则说明此连接已经完毕,可以关闭了
                if s in outputs:
                    outputs.remove(s)  #既然客户端都断开了，我就不用再给它返回数据了，所以这时候如果这个客户端的连接对象还在outputs列表中，就把它删掉
                inputs.remove(s)    #inputs中也删除掉
                s.close()           #把这个连接关闭掉

                # 删除存储信息的队列
                del message_queues[s]
    # 循环writable,由outputs列表返回
    for s in writable:
        try:
            #根据对象名获取message队列中的数据
            next_msg = message_queues[s].get_nowait()
        # 队列可能为空
        except queue.Empty:
            # No messages waiting so stop checking for writability.
            print('output queue for', s.getpeername(), 'is empty')
            # 从outputs中移除socket连接
            outputs.remove(s)
        else:
            # 将获取到的数据发送到客户端
            print( 'sending "%s" to %s' % (next_msg, s.getpeername()))
            s.send(next_msg)
    # 当socket出现错误后,都会放到exceptional列表中
    for s in exceptional:
        # 打印错误信息及远端地址
        print('handling exceptional condition for', s.getpeername() )
        # 因为出错,所以要从inputs列表中删除此对象,避免下次while中调用
        inputs.remove(s)
        # 如果此对象也存在outputs中,也要删除
        if s in outputs:
            outputs.remove(s)
        # 关闭此连接
        s.close()

        # 删除此连接的存储信息的队列
        del message_queues[s]
```


client端:

```python
# 导入模块 socket,sys
import socket
import sys

# 定义信息列表
messages = [ 'This is the message. ',
             'It will be sent ',
             'in parts.',
             ]
# 定义连接地址
server_address = ('localhost', 10000)

# 创建4个 socket client
socks = [ socket.socket(socket.AF_INET, socket.SOCK_STREAM),
          socket.socket(socket.AF_INET, socket.SOCK_STREAM),
          socket.socket(socket.AF_INET, socket.SOCK_STREAM),
          socket.socket(socket.AF_INET, socket.SOCK_STREAM),
          ]

# 打印连接地址, 连接端口
print(sys.stderr, 'connecting to %s port %s' % server_address)
# 遍历每个socket对象,去连接socket server
for s in socks:
    s.connect(server_address)

# 遍历定义的信息列表
for message in messages:
    # 每个socket client 发送信息
    for s in socks:
        print(sys.stderr, '%s: sending "%s"' % (s.getsockname(), message))
        s.send(message.encode())

    # 遍历每个socket,接受server端返回的数据
    for s in socks:
        data = s.recv(1024)
        # 打印socket自己的地址,和接受到的数据
        print(sys.stderr, '%s: received "%s"' % (s.getsockname(), data))
        # 如果数据为空,则认为连接已断,打印信息并关闭连接
        if not data:
            print(sys.stderr, 'closing socket', s.getsockname())
            s.close()
```

---


### Python 操作数据库
**1. 简介**  
数据库，简单来说可视为电子化的文件柜——存储电子文件的处所，用户可以对文件中的数据运行新增、截取、更新、删除等操作.  

数据库管理系统（英语：Database Management System，简称DBMS）是为管理数据库而设计的电脑软件系统，一般具有存储、截取、安全保障、备份等基础功能。数据库管理系统可以依据它所支持的数据库模型来作分类，例如关系式、XML；或依据所支持的电脑类型来作分类，例如服务器群集、移动电话；或依据所用查询语言来作分类，例如SQL、XQuery；或依据性能冲量重点来作分类，例如最大规模、最高运行速度；亦或其他的分类方式。不论使用哪种分类方式，一些DBMS能够跨类，例如，同时支持多种查询语言。

>MySQL由于性能高、成本低、可靠性好，已经成为最流行的开源数据库.我们主要就学习它!


**2. SQL**  
SQL是高级的非过程化编程语言，它允许用户在高层数据结构上工作。它不要求用户指定对数据的存放方法，也不需要用户了解其具体的数据存放方式。而它的界面，能使具有底层结构完全不同的数据库系统和不同数据库之间，使用相同的SQL作为数据的输入与管理。它以记录项目〔records〕的合集（set）〔项集，record set〕作为操纵对象，所有SQL语句接受项集作为输入，回提交的项集作为输出，这种项集特性允许一条SQL语句的输出作为另一条SQL语句的输入，所以SQL语句可以嵌套，这使它拥有极大的灵活性和强大的功能。在多数情况下，在其他编程语言中需要用一大段程序才可实践的一个单独事件，而其在SQL上只需要一个语句就可以被表达出来。这也意味着用SQL可以写出非常复杂的语句。

SQL同时也是数据库文件格式的扩展名。

常用SQL类型：

- 数据定义语言
- 数据操纵语言
- 数据控制语言

**3. SQL 基本用法**

>首先要安装mysql服务,并启动它.  
linux下使用yum install mysql-server 或 apt-get install mysql-server

连接 mysql:  
`$ mysql -uroot -p`

>默认情况root账号是无密码的,建议设置密码

创建一个名叫mydb的数据库:

`mysql> create database mydb`

进入mydb,并创建新表persons:

```python
mysql> use mydb;
mysql> create table persons
(
PersonID int,
LastName varchar(255),
FirstName varchar(255),
Address varchar(255),
City varchar(255)
);
```

查看表:

```python
mysql> show tables;
+----------------+
| Tables_in_mydb |
+----------------+
| persons        |
+----------------+
1 row in set (0.00 sec)
```

表创建完毕,该插入数据了:

>插入数据时,字段名可以写也可以不写

```
mysql> insert into persons values (1,'zhiliang','wang','xxx','changzhou')
```

查询表:

```python
mysql> select * from persons;
+----------+----------+-----------+---------+-----------+
| PersonID | LastName | FirstName | Address | City      |
+----------+----------+-----------+---------+-----------+
|        1 | zhiliang | wang      | xxx     | changzhou |
+----------+----------+-----------+---------+-----------+
1 row in set (0.00 sec)
```

还可以通过where条件查询指定数据:

```python
mysql> select * from persons where PersonID=1;
+----------+----------+-----------+---------+-----------+
| PersonID | LastName | FirstName | Address | City      |
+----------+----------+-----------+---------+-----------+
|        1 | zhiliang | wang      | xxx     | changzhou |
+----------+----------+-----------+---------+-----------+
1 row in set (0.00 sec)
```

更多SQL用法请看[w3schools](http://www.w3schools.com/sql/).  
顺便还可以练习英语,一举两得<>!


**4. Mysql-python**

Python2.7下安装mysql-python:

`pip install mysql-python`

Python3.5下安装mysqlclient:

`pip install mysqlclient`

>Mysql-python模块暂时还不支持Python3.x.  
如果想要在python3下使用,可以安装[mysqlclient模块](https://github.com/PyMySQL/mysqlclient-python).它是mysql-python的分支版本,最新版已经支持Python-2.7, 3.3-3.5.

修改操作:

```python
# 导入模块,在Python3中安装完mysqlclient后,同样是导入MySQLdb
import MySQLdb

# 创建一个数据库连接对象
conn = MySQLdb.connect(host='127.0.0.1',user='root',passwd='1234',db='mydb')

# 真正的操作都是使用cursor来进行的
cur = conn.cursor()

# execute()中执行具体的sql语句
reCount = cur.execute('insert into UserInfo(Name,Address)values(%s,%s)',('alex','usa'))
reCount2 = cur.execute('update UserInfo set Address='CN')
# 当然也可以使用executemany来执行多条sql
#cur.executemany(
#      """INSERT INTO breakfast (name, spam, eggs, sausage, price)
#      VALUES (%s, %s, %s, %s, %s)""",
#      [
#      ("Spam and Sausage Lover's Plate", 5, 1, 8, 7.95 ),
#      ("Not So Much Spam Plate", 3, 2, 0, 3.95 ),
#      ("Don't Wany ANY SPAM! Plate", 0, 4, 3, 5.95 )
#      ] )

# 提交操作,这一步是真正把数据写到表中.如果没有commit,则数据库中数据不会更改
conn.commit()

# 关闭游标
cur.close()
# 关闭连接对象
conn.close()

print(reCount)
```


查询操作:

```python
import MySQLdb

conn = MySQLdb.connect(host='127.0.0.1',user='root',passwd='1234',db='mydb')
cur = conn.cursor()

reCount = cur.execute('select * from UserInfo')

print cur.fetchone()
print cur.fetchone()
cur.scroll(-1,mode='relative')
print cur.fetchone()
print cur.fetchone()
cur.scroll(0,mode='absolute')
print cur.fetchone()
print cur.fetchone()

cur.close()
conn.close()

print reCount

```

参考:

- [mysqlclient](https://github.com/PyMySQL/mysqlclient-python)
- [MySQLdb文档](https://mysqlclient.readthedocs.org/en/latest)



### day9 end
