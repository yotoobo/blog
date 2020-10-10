---
title: "Python study day4"
date: 2016-02-04
categories: 
 - Python
---

### 迭代器

迭代器是一种访问集合元素的方式，它会依次访问集合中每一个元素。
迭代器不需要事先准备好所有的元素，直到迭代到某个元素时才被创建使用。

特点：

- 通过 next() 方法获取下一个内容
- 从头至尾依次访问
    - 不能随机访问
    - 迭代过程不可逆
- 占用内存少

<!--more-->

创建一个迭代器：  

```python
In [19]: x = iter(range(3))    # iter() 接受一个可迭代对象，如列表，元组

In [20]: next(x)
Out[20]: 0

In [21]: next(x)
Out[21]: 1

In [22]: next(x)
Out[22]: 2
```

当迭代过程结束后再次使用 next() 时，就会出错：  

```python
In [23]: next(x)
--------------------------------------------------------------
StopIteration   		Traceback (most recent call last)
<ipython-input-23-5e4e57af3a97> in <module>()
----> 1 next(x)

StopIteration:
```

>当迭代器执行完后，就不可再次使用了。如果想要使用则需要重新创建！


### 生成器

生成器就是一个函数，只不过调用它时返回的是迭代器。

写一个生成器和写函数一样，只不过它返回时不用 `return`，而是 `yield`。

示例一：

```python
def monkey(num):
    while num >100:
        num -= 100
        yield 100
        print('又来取钱了!')

# 如果是普通函数，就会立马执行它。但是生成器则会返回一个迭代器
test = monkey(500)

# 第一次使用 next()，当执行到 yield 时就会停止并退出
print(next(test))

# 第二次使用 next() ,则会回到第一次执行的 yield 处，并继续往下执行，然后再次从头执行并停留在 yield 语句退出
print(next(test))
```

>生成器厉害的地方就是可以保留上一次的运行状态，并可以继续进行下一次运行.借助这样的特性，就可以实现异步的效果！

示例二：

```python
import time
def consumer(name):	# 定义一个消费者，吃包子
    print("%s 准备吃包子啦!" %name)
    while True:
       baozi = yield	# 接受来自 send() 的参数，相当于动态接受参数
       print("包子[%s]来了,被[%s]吃了!" %(baozi,name))

def producer(name):	# 定义一个生产者，做包子
    c = consumer('A')	# 因为是生成器，并不会像普通函数一样去执行，而是要 nex()
    c2 = consumer('B')
    c.__next__()
    c2.__next__()
    print("老子开始准备做包子啦!")
    for i in range(10):
        time.sleep(1)
        print("做了2个包子!")
        c.send(i)	# 将i传递到消费者中的 yield
        c2.send(i)

producer("alex")
```


### 装饰器

在不改变原有的代码情况下，添加额外的功能。这就是装饰器所干的活。也就是将额外的功能装饰到原有功能之上。  

一个简单的装饰器示例：

```python
def login(func):
    def inner(arg):
        print('验证通过.')
        func(arg)
    return inner

@login	# 这就是装饰器语法糖
def tv(name):
    print('hello,%s!'%name)

def movie(name):
    print('hello,%s!'%name)

# tv = login(tv)	@login的作用就相当于这句
tv('wzl')
movie('hhh')

```


再看个通俗易懂的教程[廖雪峰的pychon3教程](http://www.liaoxuefeng.com/wiki/0014316089557264a6b348958f449949df42a6d3a2e542c000/0014318435599930270c0381a3b44db991cd6d858064ac0000)  

装饰器还可以接受参数，不过这个暂时还没搞明白。待补充~~


### 递归

在计算机科学中是指一种通过重复将问题分解为同类的子问题而解决问题的方法。递归式方法可以被用于解决很多的计算机科学问题，因此它是计算机科学中十分重要的一个概念。绝大多数编程语言支持函数的自调用，在这些语言中函数可以通过调用自身来进行递归。计算理论可以证明递归的作用可以完全取代循环，因此在很多函数编程语言（如Scheme）中习惯用递归来实现循环。

>详细说明移步[维基->递归](https://zh.wikipedia.org/wiki/%E9%80%92%E5%BD%92_(%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%A7%91%E5%AD%A6))

特点：  

1. 递归就是在过程或函数里调用自身。
2. 在使用递归策略时，必须有一个明确的递归结束条件，称为递归出口。
3. 递归算法解题通常显得很简洁，但递归算法解题的运行效率较低。所以一般不提倡用递归算法设计程序。
4. 在递归调用的过程当中系统为每一层的返回点、局部量等开辟了栈来存储。递归次数过多容易造成栈溢出等。所以一般不提倡用递归算法设计程序。

递归算法要求
递归算法所体现的“重复”一般有三个要求：

1. 每次调用在规模上都有所缩小(通常是减半)；
2. 相邻两次重复之间有紧密的联系，前一次要为后一次做准备(通常前一次的输出就作为后一次的输入)；
3. 在问题的规模极小时必须用直接给出解答而不再进行递归调用，因而每次递归调用都是有条件的(以规模未达到直接解答的大小为条件)，无条件递归调用将会成为死循环而不能正常结束。

递归函数： 函数中可以调用其他函数，如果是调用自己，则此函数就是递归函数

经典的递归函数应用：

1.  计算阶乘(n! = 1 x 2 x 3 x ... x n)

```python
def func1(n):
    if n==1:
        return 1
    return n * func1(n - 1)

```

2.  计算菲波那切数列(下一个数等于前两个数之和)

```python
def func1(a1,a2,stop):	
    if a1 == 0:
        print(a1,a2)
    a3 = a1 + a2
    print(a3)
    if a3 < stop:
        func1(a2,a3,stop)
```

>一定要注意不要过深的递归，避免栈溢出。再有就是要明确递归出口，避免死循环。


### 基础算法之二分查找法

是一种在**有序集合**中查找某一特定元素的搜索算法。搜索过程从数组的中间元素开始，如果中间元素正好是要查找的元素，则搜索过程结束；如果某一特定元素大于或者小于中间元素，则在数组大于或小于中间元素的那一半中查找，而且跟开始一样从中间元素开始比较。如果在某一步骤数组为空，则代表找不到。这种搜索算法每一次比较都使搜索范围缩小一半。

示例：

```python
def binSearch(data,findNum):	#data为要查找的集合
    mid = int(len(data)/2)

    if len(data) >= 1:
        if data[mid] > findNum:
            print('findNum in left')
            binSearch(data[:mid],findNum)
        elif data[mid] < findNum:
            print('findNum in right')
            binSearch(data[mid:],findNum)
        else:
            print('findNum: ',findNum)
    else:
        print('Not Find Num')

```


### 基础算法之2维数组90度旋转

将一个 4x4 的二维数组顺时针旋转90度。

```python
data = [[i for i in range(4)] for i in range(4)]

for i in data:
    print(i)


for rIndex,r in enumerate(data):
    for cIndex in range(rIndex,len(r)):
        temp = data[rIndex][cIndex]
        data[rIndex][cIndex] = data[cIndex][rIndex]
        data[cIndex][rIndex] = temp
print('----------------')
for i in data:
    print(i)
```


### 正则表达式

正则表达式（regular expression）就是用一个“字符串”来描述一个特征，然后去验证另一个“字符串”是否符合这个特征。比如 表达式“ab+” 描述的特征是“一个 'a' 和 任意个 'b' ”，那么 'ab', 'abb', 'abbbbbbbbbb' 都符合这个特征。

正则表达式可以用来： 

- 验证字符串是否符合指定特征，比如验证是否是合法的邮件地址  
- 用来查找字符串，从一个长的文本中查找符合指定特征的字符串，比查找固定字符串更加灵活方便。  
- 用来替换，比普通的替换更强大。


正则表达式规则：

- 字符相关

|语法|说明|
|---|---|
| . |匹配除换行符之外的任意字符|
| \ |转义字符|
| []|字符集，取反使用[^]|
| \d|数字[0-9]|
| \D|非数字[^\d]|
| \s|空白字符|
| \S|非空白字符|
| \w|单词字符，[A-Za-z0-9_]|
| \W|非单词字符，[^\w]|

>与大多数编程语言相同，正则表达式里使用"\"作为转义字符，这就可能造成反斜杠困扰。假如你需要匹配文本中的字符"\"，那么使用编程语言表示的正则表达式里将需要4个反斜杠：前两个和后两个分别用于在编程语言里转义成反斜杠，转换成两个反斜杠后再在正则表达式里转义成一个反斜杠。Python里的原生字符串很好地解决了这个问题，这个例子中的正则表达式可以使用r"\\"表示。同样，匹配一个数字的"\\d"可以写成r"\d"。有了原生字符串，你再也不用担心是不是漏写了反斜杠，写出来的表达式也更直观。



- 数量词相关

|语法|说明|
|---|---|---|---|
| \* |匹配前一个字符0次或无限次|
| \+ |匹配前一个字符1次或无限次|
| ? |匹配前一个字符0次或1次  |
| {m} |匹配前一个字符m次|
| {m,n} |匹配前一个字符m至n次|
| {m,}  |匹配前一个字符m至无限次|
| {,n}  |匹配钱一个字符0至n次|
| *? +? ?? {m,n}? |变成非贪婪模式|

>正则表达式通常用于在文本中查找匹配的字符串。Python里数量词默认是贪婪的（在少数语言里也可能是默认非贪婪），总是尝试匹配尽可能多的字符；非贪婪的则相反，总是尝试匹配尽可能少的字符。例如：正则表达式"ab*"如果用于查找"abbbc"，将找到"abbb"。而如果使用非贪婪的数量词"ab*?"，将找到"a"。

- 边界匹配

|语法|说明|
|---|---|
| ^ |匹配字符串开头|
| $ |匹配字符串结尾|


**如何在python中使用正则：**  

1. 导入re模块: `import re`
2. 常用方法
	- match
	- fullmatch
	- search
	- sub
	- findall
	- finditer
	- compile

match 方法。从头开始匹配，有则返回对象，无则返回 None。

```python
In [4]: m = re.match('ab','abc123')

In [5]: print(m)
<_sre.SRE_Match object; span=(0, 2), match='ab'>

In [6]: print(m.group())
ab
```

findall 方法。匹配所有，并返回一个列表。

```python
In [7]: m = re.findall('[0-9]','6ab99c123')

In [8]: print(m)
['6', '9', '9', '1', '2', '3']

In [9]: m = re.findall('[0-9]{2}','6ab99c123')

In [10]: print(m)
['99', '12']
```

sub 方法。

```python
In [12]: m = '6ab99c123'

In [13]: re.sub('ab','AB',m)
Out[13]: '6AB99c123'

In [14]: m
Out[14]: '6ab99c123'
```

compile方法，创建一个匹配规则的对象，并使用它来匹配字符串。

```python
In [12]: m = '6ab99c123'

In [15]: a = re.compile('ab')

In [16]: a
Out[16]: re.compile(r'ab', re.UNICODE)

In [17]: re.sub(a,'AB',m)
Out[17]: '6AB99c123'
```

>使用compile来对象化匹配规则，性能上更优！

### Day4 End

