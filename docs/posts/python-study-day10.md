---
title: "Python study day10"
date: 2016-04-05
categories: Python
---

### 事件驱动

事件（event）是针对应用程序所发生的事情，并且应用程序需要对这种事情做出响应。 程序对事件的响应其实就是调用预先编制好的代码来对事件进行处理，这种代码称为事件处 理程序（event handler）。  

GUI 中最常见的事件是用户的交互动作，如按下某个键或者点击鼠 标。当然在其他类型的应用程序中也会出现其他类型的事件，例如在各种监控系统中，传感 器采集环境数据并传给程序，就可视为发生了需要处理的事件。又如在面向对象程序中，向 某个对象发送消息，也可看成是发生了某种需要响应的事件。  

<!--more-->

事件驱动编程（event-driven programming）就是针对这种“程序的执行由事件决定”的应用的一种编程范型。
事件驱动的程序一般都有一个主循环（main loop）或称事件循环，该循环不停地做两件 事：事件监测和事件处理。首先要监测是否发生了事件，如果有事件发生则调用相应的事件 处理程序，处理完毕再继续监测新事件。

![pic](http://www.blogjava.net/images/blogjava_net/xyz98/figure3-7.jpg)

参考:

* [事件驱动](https://wizardforcel.gitbooks.io/sjtu-cs902-courseware/content/165.html)
* [使用事件驱动模型实现高效稳定的网络服务器程序](https://www.ibm.com/developerworks/cn/linux/l-cn-edntwk/)

---

### Twsited网络框架

Twsited就是基于事件驱动的一个网络框架.它包含了诸多功能，例如：网络协议、线程、数据库管理、网络操作、电子邮件等。

>还未完全支持Python3.x　

**1. [Protocol](https://twistedmatrix.com/documents/current/api/twisted.internet.protocol.Protocol.html)**

这是用于流面向连接的协议的基类.继承自BaseProtocol.

如果你打算使用twsited写一个新的面向连接的协议，从这里开始。任何协议的实现，客户端或服务器，应该是这个类的子类。它包含如下方法:

|function|说明|
|---|:---|
| dataReceived |当数据接收时调用|
| connectionLost |当连接关闭时调用|
| makeConnection|在transports对象和服务器之间建立一个连接|
|connectionMade|连接建立时调用|

**2. [Transports](http://twistedmatrix.com/documents/current/api/twisted.internet.interfaces.ITransport.html)**

Transports代表网络中两个通信结点之间的连接。Transports负责描述连接的细节，比如连接是面向流式的还是面向数据报的，流控以及可靠性。TCP、UDP和Unix套接字可作为transports的例子。它们被设计为“满足最小功能单元，同时具有最大程度的可复用性”，而且从协议实现中分离出来，这让许多协议可以采用相同类型的传输。Transports实现了ITransports接口，它包含如下的方法：

|function|说明|
|---|:---|
|write|以非阻塞的方式按顺序依次将数据写到物理连接上|
|writeSequence|将一个字符串列表写到物理连接|
|loseConnection|写完所有挂起的数据后关闭连接|
|getPeer| 获取这个连接的远端地址|
|getHost| 获取这个连接的本端地址|

**3. 编写一个简单的示例模拟传输**

EchoServer:

```python
# -*- coding: utf-8 -*-

# 导入相关模块
from twisted.internet import protocol, reactor


'''自定义一个名叫Echo的protocol(继承twisted预定义好的protocl类),定义自己要做什么!
这个类的作用等同于socketserver中重定义的handle方法.
'''
class Echo(protocol.Protocol):
    # 定义dataReceived方法.当接收到数据时执行此方法.
    def dataReceived(self, data):
        # 将收到的数据以非阻塞的方式依次写到已建立的transport连接
        self.transport.write(data)

def main():
    '''twited已经定义好一个服务工厂类(包含了一系列方法属性的基类)
    先实例一个factory对象.并设置属性protocl为自己定义的Echo.每当一个新连接进来,就会执行Echo
    这就等同于在socketserver中应用重写的handle方法.
    '''
    factory = protocol.ServerFactory()
    factory.protocol = Echo

    '''reactor类似于一个触发器,管理者事件的注册执行(也就是新连接的相关动作).
    将端口号和factory对象作为参数传给reactor.listenTCP().并启动它
    '''
    reactor.listenTCP(1234,factory)
    reactor.run()

if __name__ == '__main__':
    #执行main方法
    main()
```

EchoClient:

```python
# -*- coding: utf-8 -*-

# 导入相关模块
from twisted.internet import protocol,reactor

# 定义EchoClient,继承twisted定义好的protocol(相当于socketserver中的handle方法)
class EchoClient(protocol.Protocol):
    """Once connected, send a message, then print the result."""

    # 当连接建立成功后,执行此方法
    def connectionMade(self):
        # 将字符串'hello alex!'以非阻塞的方式依次写到连接中
        self.transport.write("hello alex!")

    # 当有数据进来时,调用此方法
    def dataReceived(self, data):
        "As soon as any data is received, write it back."
        # 打印接受的数据data
        print "Server said:", data
        # 当数据全部接受完毕时,关闭此链接.这个会调用connectionLost方法
        self.transport.loseConnection()

    # 当连接关闭时,调用此方法
    def connectionLost(self, reason):
        # 打印信息
        print "connection lost"

# 定义EchoFactory,继承twisted定义好的clientFactory类
class EchoFactory(protocol.ClientFactory):
    # 将自定义的EchoClient赋值给protocol
    # 相当于socketserver中应用重写的handle方法
    protocol = EchoClient

    # 定义一个用户连接失败的方法,并打印失败信息
    def clientConnectionFailed(self, connector, reason):
        print "Connection failed - goodbye!"
        # 关闭客户端
        reactor.stop()

    # 定义一个用户连接正常关闭的方法,并打印信息
    def clientConnectionLost(self, connector, reason):
        print "------- Connection lost - goodbye!"
        # 关闭客户端
        reactor.stop()

# this connects the protocol to a server running on port 8000
# 定义main方法
def main():
    # 实例化一个对象,包含twisted定义好的方法属性.同时也有新的protocol->Echoclient(相当于socketserver中重写的handle方法)
    f = EchoFactory()
    # 相当于启动一个触发器.将f传入,连接server
    reactor.connectTCP("localhost", 1234, f)
    reactor.run()

# this only runs if the module was *not* imported
if __name__ == '__main__':
    main()

```

**4. 使用twisted编写一个简单的传输文件程序**

server端代码:

```python
# -*- coding: utf-8 -*-

# This is the Twisted Fast Poetry Server, version 1.0

# 导入相应模块,其中optparse是自定义命令行选项
import optparse, os

from twisted.internet.protocol import ServerFactory, Protocol

# 定义一个函数,处理命令行选项.比sys.argv更好用
def parse_args():
    # 定义使用信息
    usage = """usage: %prog [options] poetry-file

This is the Fast Poetry Server, Twisted edition.
Run it like this:

  python fastpoetry.py <path-to-poetry-file>

If you are in the base directory of the twisted-intro package,
you could run it like this:

  python twisted-server-1/fastpoetry.py poetry/ecstasy.txt

to serve up John Donne's Ecstasy, which I know you want to do.
"""

    # 创建一个optparseParser对象
    parser = optparse.OptionParser(usage)

    # 定义一个help字符串
    help = "The port to listen on. Default to a random available port."
    # 对象parser中添加一个选项'--port',类型为int.指定此选项的help信息
    parser.add_option('--port', type='int', help=help)

    # 定义一个help字符串
    help = "The interface to listen on. Default is localhost."
    # 往对象parser中添加一个选项'--iface',默认值为'localhost',指定help信息
    parser.add_option('--iface', help=help, default='localhost')

    ''' parse_args会解析用户输入的参数
    当执行命令: $ python twis_sendfile_server注释.py --port 133 hello.txt
    其中options,args 分别为<Values at 0x1015c7368: {'iface': 'localhost', 'port': 133}>, ['hello.txt']
    如果要获取port的值,只要通过options.port就可以
    args为一个数组, 里面存储的用户输入的文件名
    '''
    options, args = parser.parse_args()
    #print("--arg:",type(options),options,args)

    # 判断下args的长度,如果不为1,打印错误信息
    if len(args) != 1:
        parser.error('Provide exactly one poetry file.')

    # 获取文件名
    poetry_file = args[0]

    # 判断用户输入的文件是否存在,不存在打印错误信息
    if not os.path.exists(args[0]):
        parser.error('No such file: %s' % poetry_file)

    # 返回用户输入的选项,文件名
    return options, poetry_file


# 自定义一个Protocol,相当于socketserver中重写的handle方法
class PoetryProtocol(Protocol):

    # 当连接建立成功后,调用此方法
    def connectionMade(self):
        # 将用户输入的文件内容以非阻塞的方式写入transport连接
        self.transport.write(self.factory.poem)
        # 当连接中的数据发送完毕后,关闭连接
        self.transport.loseConnection()

# 创建一个PoetryFactory类并继承twisted定义好的ServerFactory类(定义好了一堆方法属性)
class PoetryFactory(ServerFactory):

    # 用自定义的protocol重写本身的protocol
    protocol = PoetryProtocol

    # 构造函数,poem为实例属性(存储用户输入的文件内容)
    def __init__(self, poem):
        self.poem = poem

def main():
    # 获取用户输入的参数和文件名
    options, poetry_file = parse_args()

    # 读取文件内容
    poem = open(poetry_file).read()

    # 创建一个PoetryFactory对象,传入文件内容poem
    factory = PoetryFactory(poem)

    # 导入reactor
    from twisted.internet import reactor

    # 将factory作为参数纯如,侦听用户输入的端口号(没指定则侦听9000),地址(默认localhost)
    port = reactor.listenTCP(options.port or 9000, factory,
                             interface=options.iface)
    # 获取port连接的本地地址,打印信息
    print 'Serving %s on %s.' % (poetry_file, port.getHost())

    # 启动侦听
    reactor.run()


if __name__ == '__main__':
    # 执行main方法
    main()
```


client端代码:

```python
# -*- coding: utf-8 -*-

# This is the Twisted Get Poetry Now! client, version 3.0.

# NOTE: This should not be used as the basis for production code.

import optparse

from twisted.internet.protocol import Protocol, ClientFactory


# 解析命令行参数的函数
def parse_args():
    # 定义使用信息
    usage = """usage: %prog [options] [hostname]:port ...

This is the Get Poetry Now! client, Twisted version 3.0
Run it like this:

  python get-poetry-1.py port1 port2 port3 ...
"""

    # 创建一个optparseParser对象
    parser = optparse.OptionParser(usage)

    # parse_args会返回两个对象,第一个为parser实例本身(不需要,下划线当占位符),第二个为用户输入的地址
    _, addresses = parser.parse_args()

    # 如果用户输入的地址为空,打印帮助信息,并退出
    if not addresses:
        print parser.format_help()
        parser.exit()

    #用户输入的地址可能包含ip,这就需要去解析了
    def parse_address(addr):
        # 如果没有冒号,则设置主机为127.0.0.1
        if ':' not in addr:
            host = '127.0.0.1'
            port = addr
        else:
            #以冒号为分隔符,host,port为用户输入的
            host, port = addr.split(':', 1)

        # 判断port是否为全数字
        if not port.isdigit():
            # 如果不是数字,打印错误错误信息
            parser.error('Ports must be integers.')
        # 返回host,port
        return host, int(port)
    # addresses为一个列表,将其中每个元素应用到parse_address函数中.并返回
    return map(parse_address, addresses)

# 自定义一个protocol.继承twisted定义好的protocol
class PoetryProtocol(Protocol):

    # 定义个类属性,用于接受服务端发送的数据
    poem = ''

    # 当有数据接(data)受时,就调用此方法
    def dataReceived(self, data):
        # 将接受的数据拼接到字符串poem中
        self.poem += data

    # 当连接关闭,调用此方法
    def connectionLost(self, reason):
        # 调用poemReceived方法,并将poem作为参数传递进去
        self.poemReceived(self.poem)

    # 自定义一个poemReceived方法,接受poem
    def poemReceived(self, poem):
        # 调用PoetryClientFactory中定义的poem_finished方法
        '''
        在类PoetryClientFactory中,定义了protocol = PoetryProtocol.这是twisted定义的格式,必须这么写
        所以在PoetryProtocol中,调用PoetryClientFactory中的方法就要用self.factory
        '''
        self.factory.poem_finished(poem)


# 自定义ClientFactory,并继承twisted定义的ClientFactory
class PoetryClientFactory(ClientFactory):

    # 重写protocol,改成自己写的(相当于在socketserver中应用handle方法)
    protocol = PoetryProtocol

    # 构造方法,接受传入的参数
    def __init__(self, callback):
        self.callback = callback

    # 自定义此方法,执行传进来的函数体.用于判断客户端是否接受完所有的数据.接收完毕就退出
    def poem_finished(self, poem):
        self.callback(poem)


def get_poetry(host, port, callback):
    """
    Download a poem from the given host and port and invoke

      callback(poem)

    when the poem is complete.
    """

    # 导入reactor
    from twisted.internet import reactor
    # 实例化自定义的工厂类(继承twisted定义好的ClientFactory)
    factory = PoetryClientFactory(callback)
    # 将host,port,factory 传入reactor,并连接
    reactor.connectTCP(host, port, factory)


def poetry_main():
    # 获取用户输入的地址,格式为[('127.0.0.1', 11), ('127.0.0.1', 22)]
    addresses = parse_args()
    # print addresses
    # exit()

    # 导入reactor
    from twisted.internet import reactor

    # 定义一个空列表poems
    poems = []

    # 客户端可以同时从多个server端接受数据.
    # 这里每当从server端接受完数据,就往poems添加接受到的数据.
    def got_poem(poem):
        poems.append(poem)
        # 如果接受的数量等于连接的server数量,就说明客户端指定的所有连接都接受完毕,然后退出
        if len(poems) == len(addresses):
            reactor.stop()

    # 遍历addresses
    for address in addresses:
        # address为包含两个元素的元组
        # 获取host,port
        host, port = address
        # 调用get_poetry,将host,port和got_poem函数传入
        get_poetry(host, port, got_poem)

    # 启动连接
    reactor.run()

    #for poem in poems:
    #    print poem


if __name__ == '__main__':
    # 执行poetry_main方法
    poetry_main()


```

>服务器端可以同时启动多个,客户端同时连接多个server来接受数据


参考:

- [API Documents](https://twistedmatrix.com/documents/current/api/)
- [twisted中文入门教程](https://www.gitbook.com/book/fengyouchao/twisted-intro-cn/details)


---




### RabbitMQ

**1. 简介**  
python中的默认队列对于不同进程之间,或者不同系统之间的通信是无能为力的.所以,往往需要真正的消息队列(Message Queue)来进行通信.

RabbitMQ是实现AMQP（高级消息队列协议）的消息中间件的一种，用于在分布式系统中存储转发消息，在易用性、扩展性、高可用性等方面表现不俗。消息中间件主要用于组件之间的解耦，消息的发送者无需知道消息使用者的存在，反之亦然!

在rabbitmq中常用名词有:

- 生产(Producing)意思就是发送。发送消息的程序就是一个生产者(producer)。我们一般用"P"来表示:

![生产](http://www.rabbitmq.com/img/tutorials/producer.png)

- 队列(Queue)就是存储生产的消息.可以有多个生产者,也可以有多个消费者.队列可以绘制成这样（图上是队列的名称）：

![队列](http://www.rabbitmq.com/img/tutorials/queue.png)

- 消费（Consuming）和获取消息是一样的意思。一个消费者（consumer）就是一个等待获取消息的程序。我们把它绘制为"C"：

![消费](http://www.rabbitmq.com/img/tutorials/consumer.png)


参考:

- [什么是RabbitMQ](http://lynnkong.iteye.com/blog/1699684)
- [RabbitMQ 中文](http://rabbitmq-into-chinese.readthedocs.org/zh_CN/latest/)
- [how to install rabbitmq](https://www.rabbitmq.com/download.html)

**2. 实现一个简单的队列通信**

2.1 实现一个1v1的队列通信:

![1v1](http://www.rabbitmq.com/img/tutorials/python-one-overall.png)

server端生产消息并发送到rbmq队列:

```python
# -*- coding: utf-8 -*-
import pika

# 以阻塞模式连接rbmq server,指定服务端地址
connection = pika.BlockingConnection(pika.ConnectionParameters(
                                    '192.168.33.10'))
# 建立一个管道.通过这个管道管理队列
channel = connection.channel()

# 创建一个名叫hello的队列
channel.queue_declare(queue='hello')

# 生产消息,并发送到指定的队列test
# exchage: 消息不能直接发送到队列,要使用exchage(充当交换机的功能,由它分发消息去指定队列)
# routing_key: 指定要发送的队列
# body: 消息内容
channel.basic_publish(exchange='',
                      routing_key='test',
                      body='first message')
print('Send message over')

# 关闭连接
connection.close()
```

client端从rbmq中消费消息:

```python
#_*_coding:utf-8_*_

import pika

# 以阻塞模式连接rbmq服务端
connection = pika.BlockingConnection(pika.ConnectionParameters(
               '192.168.33.10'))
# 建立一个通道
channel = connection.channel()

# 为什么又创建一个队列?
# 因为假设要是消费者先生产者运行.那么如果客户端不创建得话,队列就不存在了
# 还有就是生产者创建了好几个队列,消费者如果不指定的话就不知道从哪里获取消息了
# 所以这里要和生产者一样,创建相同的队列,避免出错
channel.queue_declare(queue='hello')

# 定义一个回调方法,当接收到消息时调用此方法,其中ch, method, properties三个参数必须写.这是规定好的.body为消息内容
def callback(ch, method, properties, body):
    print(" [x] Received %r" % body)

# 从指定队列中接收消息,如果接收到,则调用callback
# no_ack为设置是否要确认.如果no_ack=False,那么当消费完消息会确认.保证消息一定被处理
channel.basic_consume(callback,
                      queue='hello',
                      no_ack=True)
print(' [*] Waiting for messages. To exit press CTRL+C')
# 开始接收,阻塞
channel.start_consuming()
```


>在运行server代码时遇到个错误:
`PLAIN login refused: user 'guest' can only connect via localhost`.
因为guest用户被限制无法远程访问.由于是测试环境,直接给guest解除限制.  
方法: 修改/etc/rabbitmq/rabbitmq.config文件并添加`[{rabbit, [{loopback_users, []}]}].`
然后重启服务就可以了.  
详情请看官网[access-control](https://www.rabbitmq.com/access-control.html)

2.2 work queue:

![1v3](http://www.rabbitmq.com/img/tutorials/python-two.png)

P一直发送消息,那么C1,C2就会交替接收消息....

**3. 消息队列持久化**

默认情况下当rbmq服务重启后,之前创建的队列都不存在了.如果想要队列持久化,那么就要在创建队列时,指定一个参数:

`channel.queue_declare(queue='hello', durable=True)`

>如果已经存在了一个队列,是不能将其改为持久化的,只能重新生成一个新的或者将旧的删除在重新生成.  
还有持久化的是队列本身,而不是队列中的消息(重启rbmq服务后消息全部清空)

如果想要消息也持久化,那么生产消息时要加入一个参数:

```python
channel.basic_publish(exchange='',
                      routing_key="task_queue",
                      body=message,
                      properties=pika.BasicProperties(  # 使消息持久化
                      delivery_mode = 2,
                      ))
```

同时,消费消息时也要加上一个参数:

```python
def callback(ch, method, properties, body):
    print(" [x] Received %r" % body)
    time.sleep(body.count(b'.'))
    print(" [x] Done")
    ch.basic_ack(delivery_tag = method.delivery_tag)    #同时加上这一句

channel.basic_consume(callback,
                      queue='task_queue',
                      )
```


**4. 消息公平分发**

默认情况下RBMQ是不管消费者的消费能力的,只管按顺序发送消息.但是不同的消费者可能处理消息的速度不一样,处理快的消费者可能来一个处理一个,处理慢的就可能堆积了很多消息等待处理.

所以为解决此问题，可以在各个消费者端，配置`perfetch=1`,意思就是告诉RabbitMQ在我这个消费者当前消息还没处理完的时候就不要再给我发新消息了:

```python
import pika

connection = pika.BlockingConnection(pika.ConnectionParameters(
        host='192.168.33.10'))
channel = connection.channel()

channel.queue_declare(queue='rpc_queue')

def callback(ch, method, properties, body):
    print(" [x] Received %r" % body)

channel.basic_qos(prefetch_count=1) #这行代码就是告诉rbmq.在当前消息未处理完时不要给我发新消息了.
channel.basic_consume(callback, queue='rpc_queue')
```

![perfetch](http://www.rabbitmq.com/img/tutorials/prefetch-count.png)


**5. 消息发布和订阅**  

上面所述都是1v1的形式.我们可以生成一个消息,按照某种条件选择消费者去获取.这里就要再次说明一下`exchange`

>注意:  
1. 生产者是无法直接将消息发送到队列的.必须借由exchange.  
2. 只有绑定到exchange的队列才可以接受消息.


`exchange`常用类型:

1. `fanout`,绑定到此类型的队列都会接受到消息
2. `direct`,根据队列绑定的关键字进行发送
3. `topic`,所有符合routingKey(此时可以是一个表达式)的routingKey所bind的queue可以接收消息



**6. Remote procedure call (RPC)**

![rpc](http://www.rabbitmq.com/img/tutorials/python-six.png)


- 当客户端启动的时候，它创建一个匿名独享的回调队列。
- 在RPC请求中，客户端发送带有两个属性的消息：一个是设置回调队列的 reply_to 属性，另一个是设置唯一值的 correlation_id 属性。
- 将请求发送到一个 rpc_queue 队列中。
- RPC工作者（又名：服务器）等待请求发送到这个队列中来。当请求出现的时候，它执行他的工作并且将带有执行结果的消息发送给reply_to字段指定的队列。
- 客户端等待回调队列里的数据。当有消息出现的时候，它会检查correlation_id属性。如果此属性的值与请求匹配，将它返回给应用。

现在实现一个RPC,客户端请求一个计算斐波那契数列的任务到server,server计算完后将结果返回给客户端:

RPC client代码:

```python
import pika
import uuid
 
class FibonacciRpcClient(object):
    def __init__(self):
        # 连接rbmq
        self.connection = pika.BlockingConnection(pika.ConnectionParameters(
                host='localhost'))
 
        self.channel = self.connection.channel()
        # 生成一个随机队列,用于接收server返回的结果
        result = self.channel.queue_declare(exclusive=True)
        self.callback_queue = result.method.queue
        # 侦听callback_queue
        self.channel.basic_consume(self.on_response, no_ack=True,
                                   queue=self.callback_queue)
 
    def on_response(self, ch, method, props, body):
        # 在call方法中,发送了correlation_id给server,server在返回结果时也会带有此属性.
        # 如果两边id一致,则说明任务和结果匹配
        if self.corr_id == props.correlation_id:
            self.response = body
 
    def call(self, n):
        self.response = None
        self.corr_id = str(uuid.uuid4())
        # 发送任务到server,并设置消息的额外属性
        # reply_to: 告诉server将结果发送给谁
        # correlation_id: 一个随机字符串,用于验证结果和任务是否匹配,见on_response方法
        self.channel.basic_publish(exchange='',
                                   routing_key='rpc_queue',
                                   properties=pika.BasicProperties(
                                         reply_to = self.callback_queue,
                                         correlation_id = self.corr_id,
                                         ),
                                   body=str(n))
        # 判断是否接收到结果,如果没有则一直接收
        while self.response is None:
            self.connection.process_data_events()
        return int(self.response)

fibonacci_rpc = FibonacciRpcClient()

print(" [x] Requesting fib(30)")
# 调用call方法,传入参数30
response = fibonacci_rpc.call(30)
print(" [.] Got %r" % response)
```


RPC server代码:

```python
#_*_coding:utf-8_*_
__author__ = 'Alex Li'
import pika
import time

# 连接rbmp
connection = pika.BlockingConnection(pika.ConnectionParameters(
        host='localhost'))
 
channel = connection.channel()
 
channel.queue_declare(queue='rpc_queue')
 
# 计算菲波那切数列
def fib(n):
    if n == 0:
        return 0
    elif n == 1:
        return 1
    else:
        return fib(n-1) + fib(n-2)
# 回调函数
def on_request(ch, method, props, body):
    n = int(body)
 
    print(" [.] fib(%s)" % n)
    response = fib(n)
    # 得到结算结果,发送到客户端指定的callback_queue
    ch.basic_publish(exchange='',
                     routing_key=props.reply_to,
                     properties=pika.BasicProperties(correlation_id = \
                                                         props.correlation_id),
                     body=str(response))
    ch.basic_ack(delivery_tag = method.delivery_tag)
 
channel.basic_qos(prefetch_count=1)
# 侦听rpc_queue队列,接收到消息调用on_request
channel.basic_consume(on_request, queue='rpc_queue')
 
print(" [x] Awaiting RPC requests")

channel.start_consuming()

```

### day10 end
