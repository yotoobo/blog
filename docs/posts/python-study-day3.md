---
title: "Python study day3"
date: 2016-02-02
categories: 
 - Python
---

### 集合

集合特点：
  
- 无序
- 不能重复

创建一个set对象： 

```python
new_set = set()

new_set = set([1,1,2,3]) # 自动去重
```
<!--more-->

set 集合可用于关系测试，元素去重：

```python
's' in set(['a','b','s'])
```

常用方法：

- add()        # 添加新元素
- clear()      # 清空集合
- copy()       # 浅拷贝
- difference() # 做差，返回一个新set.不会改变原有值

```python
In [7]: s1 = set([1,2,3,])

In [8]: s2 = set([2,3])

In [9]: s1.difference(s2)
Out[9]: {1}

In [10]: s1
Out[10]: {1, 2, 3}
```
- difference_update() # 从当前集合中删除掉传入的集合，改变原有值

```python
In [10]: s1 = set([1,2,3,])

In [11]: s2 = set([2,3])

In [12]: s1.difference_update(s2)

In [13]: s1
Out[13]: {1}
```
- discard() # 移除元素

```python
In [14]: s1
Out[14]: {1}

In [15]: s1.discard(1)

In [16]: s1
Out[16]: set()
```
- intersection() # 取交集，返回一个新集合

```python
In [18]: s1 = set([1,2,3,])

In [19]: s2 = set([2,3])

In [20]: s1.intersection(s2)
Out[20]: {2, 3}
```
- intersection_update # 取交集，修改原有集合

```python
In [23]: s1 = set([1,2,3,])

In [24]: s2 = set([2,3])

In [25]: s1.intersection_update(s2)

In [26]: s1
Out[26]: {2, 3}
```

- isdisjoint() # 如果没有交集，返回True
- issubset() # 是否是子集
- issubset() # 是否是父集
- pop()	# 移除一个元素并返回它，返回值可以用变量接受
- remove()  # 移除指定的元素。没有返回值
- symmetric_difference() # 返回一个差集


```python
In [39]: s1 = set([1,2,3,])

In [40]: s2 = set([2,3])

In [41]: s1.symmetric_difference(s2)
Out[41]: {1}

In [42]: s1
Out[42]: {1, 2, 3}
```

- symmetric_difference_update() # 做两次差集(s1->s2,s2->s1)，修改原有值

```python
In [43]: s1 = set([1,2,3,])

In [44]: s2 = set([2,3,4])

In [45]: s1.symmetric_difference_update(s2)

In [46]: s1
Out[46]: {1,4}
```

- union() # 返回一个并集
- update() # 更新



### collections 系列

对基础数据类型的一个补充和扩展。比如字典默认是无序的，但是可以使用 collections.OrderedDict() 创建一个有序字典。

#### 计数器

collections.Count 类继续自字典，所以它包含字典所以的功能。

它很方便快捷的统计元素的次数,如：

```python
In [50]: import collections

In [51]: s = collections.Counter('ajkd838377') #创建Counter对象

In [52]: s	#以元素:出现次数的形式存储
Out[52]: Counter({'3': 2, '7': 2, '8': 2, 'a': 1, 'd': 1, 'j': 1, 'k': 1})

In [53]: type(s)
Out[53]: collections.Counter

In [54]: s.	 #常用方法
s.clear        s.elements     s.get          s.keys         s.pop          s.setdefault   s.update
s.copy         s.fromkeys     s.items        s.most_common  s.popitem      s.subtract     s.values

```

常用方法:  

- clear() # 清空
- setdefault() # 设置默认值
- copy()
- popitem()  # 删除任一键值对
- elements() # 通过此方法获取元素
- update() # 更新计数器，也就是计算新的元素统计并与原来的统计进行合并
- subtract # 更新计数器，与update()相反,减少对应元素次数
- get()	# 取值
- items()	# 所有键值对
- values()	# 所有值,这里指元素的次数
- keys()	# 所有键，这里指元素本身
- most_common([n]) # n 个次数最多的key
- pop()	# 移除

#### 有序字典

继承字典类，拥有字典的所以方法属性.并记录了字典元素添加的顺序,所有它是有序的.

创建一个有序字典：

`s = collections.OrderedDict()`

添加成员的方法同字典一样：

`s['k1'] = 'v1'`

由于字典有序,所以popitem()方法也就会按照顺序删除(后进先出:栈)

```python
In [94]: s['k1'] = 1

In [95]: s['k2'] = 2

In [96]: s.popitem()
Out[96]: ('k2', 2)

In [97]: s.popitem()
Out[97]: ('k1', 1)
```

使用 pop() 删除指定 k

>__**强调一点，pop() 有返回值,可以使用变量接受**__

```python
In [104]: s = collections.OrderedDict()

In [105]: s['k1'] ='v1'

In [106]: res = s.pop('k1')

In [107]: print(res)
v1
```

使用 update() 更新字典，k 不存在新增, k 存在覆盖

```python
In [113]: s
Out[113]: OrderedDict([('k1', 'v1'), ('k2', 'v2')])

In [115]: s.update({'k2':2000,'k3':'v3'})

In [116]: s
Out[116]: OrderedDict([('k1', 'v1'), ('k2', 2000), ('k3', 'v3')])
```

#### 默认字典

默认字典，即创建时指定字典成员类型。  
创建一个成员类型为列表的字典：

`s = collections.defaultdict(list)`  

这样，就算字典为空时，也可以直接调用列表方法，如append()

```python
In [99]: s = collections.defaultdict(list)

In [100]: s['k1'].append(1)

In [101]: s
Out[101]: defaultdict(list, {'k1': [1]})
```

#### 可命名元组

元组是通过索引去访问元素的，而命名元组可以使用名称去访问，类似字典的key。  
创建一个可命名元组：

```python
In [2]: MytupleClass = collections.namedtuple('MytupleClass',['x','y','z'])	#先创建一个可命名元组类

In [3]: MytupleClass
Out[3]: __main__.MytupleClass

In [4]: mynametuple = MytupleClass(1,2,3)	#使用上面创建的类来创建对象

In [9]: mynametuple.x
Out[9]: 1

In [10]: mynametuple.z
Out[10]: 3
```

#### 队列

1. 双向队列:
	- 两头可以随时进出，非常随意
2. 单向队列：
	- 先进先出

创建队列：

```python
# 创建双向队列:
mydeque = collections.deque()

# 创建单向队列:
mydeque = queue.Queue()
```

双向队列方法：

- append() #添加一个元素到队列右端
- appendleft()	#添加元素到左端
- clear()	#清空
- count()	#统计元素次数
- extend()	#将新成员添加到队列(右端)
- extendleft() #将新成员添加到队列左端
- index()	#找到指定元素第一次出现的下标
- insert()	#在指定位置插入成员
- pop()		#删除最右端的成员
- popleft()	#删除最左端的成员
- remove()	#删除第一次出现的指定元素
- reverse()	#反转
- rotate([n=1])	#默认将所有成员向右移动一步


单向队列方法:

- qsize() #返回队列的元素个数
- empty() #如果队列为空,返回True;否则返回False
- put() #往队列中添加
- get() #从队列中取


### 深浅拷贝

池:  
Python 解释器在内部维护了池，用于保存最常用的数据(共享使用)。如定义10个相同值的变量，类型为int或者str。那么使用id()可以看到它们指向的是同一块内存地址

结论:  

- 浅拷贝只拷贝第一层。其下的数据还是共用
- 深拷贝则是赋值到第N层。当然最里的整数字符串还是指向同一内存地址的



### 函数

函数就是一段可重复调用的代码块.  

**定义函数：**

```python
def func():
    pass
```

其中`def`是关键字，func是函数名称(不可以使用python关键字作为函数名)，pass那里是函数体。  

**调用函数：**

```python
# 执行函数
func()

# 以给函数设置别名，使用别名来调用
f = func
f()
```

**返回值：**  

当函数执行完，我们不知道成功或失败。所以需要函数来告诉我们结果如何！这就是返回值的作用！  
在定义函数时，使用 `return` 关键字。可以返回任意值！  

>当没有return时，函数其实也有返回值，就是None。

当函数执行到 `return` 时，函数就执行完毕了。所以下面的 func() 永远不会打印 111

```python
def func():
    print('hello')
    return True
    print(111)
```

接受函数的返回值,然后我们就可以通过返回值来做下一步行动，如：  

```python
result = func()

if result:
    print('执行成功')
else:
    print('执行失败')
```

**无参数函数：**

```python
def func():
    pass
```

**有参数函数：**

```python
def func(name):		# 定义函数时，这里的参数name是形式参数，简称形参
    return name
	
def func2(name, age)
    print(name,age)
	
func2('hello',30)	# 用函数时，传入的参数是实际参数，简称实参
```

>传入的参数数量必须等同于函数定义时的参数数量

**有默认参数的函数:**

```python
def func(name='hello', age=29):
    print(name, age)
	
func() # 如果没有传入参数，则使用默认值
func('wang', 27) # 入参数后，则会覆盖掉默认值
```

>Note: 如果有普通参数，又有默认参数。那么默认参数一定要放在普通参数后面。

**指定参数函数：**

默认情况下，实参和形参是一一对应的，即第一个实参对应第一个形参。但是也可以指定参数。  

```python
def show(a1, a2):
    print(a1,a2)
	
show('im a1', 'im a2')  # 参数位置是固定的
show(a2='im a2', a1='im a1') # 指定参数后，位置就无所谓了
```

**动态参数：** 

通过一个形数，我们可以让函数接受多个实参！
  
- `*args`接受实参并将它们转换成元组:  

```python
def func(*args):
    print(args)

func(1,2,3)
```

- `**kwargs`接受实参并将它们转换成字典:   

```python
def func(**kwargs):
    print(args)

func(k1='v1',k2='v2')
```

- 同时使用两种动态参数：  

```python
def func(*args, **kwargs):
    print(args,kvargs)
	
func(1,2,3,4,k1='v1',k2='v2')
```

>Note: 如果同时存在`*args`和`**kwargs`的话，`*args`一定要放在左边。

- 当出现以下情况时：

```python
def func(*args, **kwargs):
    print(args,kvargs)

mylist = [1,2,3,4]
mydict = {'k1':'v1','k2':'v2}

func(mylist,mydict)
#如果这么调用的话，两个实参是被传入到`*args`中。
#所以应该做下修改,这样mylist就会传入到*args，而mydict就会传入到**kwargs了
func(*mylist,**mydict)

```

动态参数在字符串格式化中的小应用：

```python
# 第一种
In [23]: s = "{0} is {1}"

In [24]: s.format('Tom','cat')
Out[24]: 'Tom is cat'

# 第二种
In [26]: sList = ['Tom','cat']

In [27]: s.format(*sList)
Out[27]: 'Tom is cat'

# 第三种
In [31]: s = "{who} is {what}"

In [32]: sDict = {'who':'Tom','what':'cat'}

In [33]: s.format(**sDict)
Out[33]: 'Tom is cat'
```

#### lambda

lambda, 简单函数的简易书写。如果是一些功能较简单指直接函数，可以直接使用 lambda 表达式。

```python
func = lambda a: a+1
```



#### 内置函数.

Python 内置了许多常用的函数：

- abs()       # 接受一个int，并返回它的绝对值
- all()       # 如果一个可迭代对象中所有的元素都为True，则返回True，否则False
- any()	      # 如果一个可迭代对象中所有的元素都为False，则返回False，否则True
- bool()      # 接受一个参数，返回True 或False
- dict()      # 生成字典对象
- dir()	      # 没有参数时，返回当前环境的标识符(变量，函数，类)组成的列表。有参数时，则返回这个对象所拥有的标识符列表。
- divmod()	  # 传入两个数字，返回商与余数
- enumerate() # 如循环一个字典的值时，自动输出序号。
- eval()      # 传入一个字符串，会去寻找是否和字符串同名的变量。还可以计算字符串
	- eval('x') # 寻找叫x的变量
	- eval('1+1')
- float()     # 转换成浮点型
- format()    # 字符串格式化
- getattr()   # 获取class中方法的内存地址
- help()      # 帮助信息
- id()	      # 返回一个对象的身份标识。在CPython中，还表示内存地址
- input()     # 接受用户输入
- int()       # 转换成整形
- isinstance(object, class-or-type-or-tuple)  #判断对象类型 
- len()       # 返回对象的长度
- list()      # 生成一个list对象
- locals()
- map()
- max()	      # 返回最大值
- min()	      # 返回最小值
- open()      # 打开并返回一个文件对象
- pow()       # 指数
- print()     # 打印
- range()     # 生成一个不可变的序列
- set()       # 生成集合
- setattr()
- sorted()
- str()       # 生成字符串
- sum()
- super()
- tuple()     # 生成元组
- type()      # 查看对象类型

### Day3 End
