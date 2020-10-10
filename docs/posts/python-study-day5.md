---
title: "Python study day5"
date: 2016-02-22
categories: 
 - Python
---

### 正则表达式

#### re.compile方法

`re.compile(strPattern[, flag]):` 

第二个参数 flag 是匹配模式，取值可以使用按位或运算符 '|' 表示同时生效，比如 re.I | re.M。另外，你也可以在 regex 字符串中指定模式，比如 re.compile('pattern', re.I | re.M) 与 re.compile('(?im)pattern') 是等价的。 

可选值有：

- re.I(re.IGNORECASE): 忽略大小写（括号内是完整写法，下同）
- M(MULTILINE): 多行模式，改变'^'和'$'的行为
- S(DOTALL): 点任意匹配模式，改变'.'的行为
- L(LOCALE): 使预定字符类 \w \W \b \B \s \S 取决于当前区域设定
- U(UNICODE): 使预定字符类 \w \W \b \B \s \S \d \D 取决于unicode定义的字符属性
- X(VERBOSE): 详细模式。这个模式下正则表达式可以是多行，忽略空白字符，并可以加入注释。  

<!--more-->

#### 正则表达式常用5种操作

- re.match(pattern, string)	#从头匹配，没有返回None
- re.search(pattern, string) #匹配整个字符串
- re.split() #将匹配到的格式当做分割点，字符串变为列表

```python
In [61]: m = re.split('[?]','123?456?789')

In [62]: m
Out[62]: ['123', '456', '789']

```

- re.findall() #找到所有匹配的字符并返回一个列表

```python
In [63]: m = re.findall('[?]','123?456?789')

In [64]: m
Out[64]: ['?', '?']
```

- re.sub(pattern,repl,string,count,flag)	#字符串替换

```python
In [65]: m = re.sub('[?]','+','123?456?789')

In [66]: m
Out[66]: '123+456+789'

In [67]: m = re.sub('[?]','+','123?456?789',count=1)

In [68]: m
Out[68]: '123+456?789'
```

#### 灵活使用正则表达式规则

如数字表示 `\d`, 非空字符 `\S`. 还有许多数量词，边界匹配等

#### 在线[正则工具](http://tool.oschina.net/regex)

#### 借助圆括号分组

```python
In [73]: s = re.search('(\w)(\w)(\w)','abc123')

In [74]: s
Out[74]: <_sre.SRE_Match object; span=(0, 3), match='abc'>

In [75]: s.groups()
Out[75]: ('a', 'b', 'c')

In [76]: s.group(1)
Out[76]: 'a'

In [77]: s.group(2)
Out[77]: 'b'

In [78]: s.group(3)
Out[78]: 'c'
```

---

### 冒泡排序

[冒泡排序](https://zh.wikipedia.org/wiki/%E5%86%92%E6%B3%A1%E6%8E%92%E5%BA%8F) 是一种简单的排序算法。它重复地走访过要排序的数列，一次比较两个元素，如果他们的顺序错误就把他们交换过来。走访数列的工作是重复地进行直到没有再需要交换，也就是说该数列已经排序完成。这个算法的名字由来是因为越小的元素会经由交换慢慢“浮”到数列的顶端。

冒泡排序算法的运作如下：

1. 比较相邻的元素。如果第一个比第二个大，就交换他们两个。
2. 对每一对相邻元素作同样的工作，从开始第一对到结尾的最后一对。这步做完后，最后的元素会是最大的数。
3. 针对所有的元素重复以上的步骤，除了最后一个。
4. 持续每次对越来越少的元素重复上面的步骤，直到没有任何一对数字需要比较。

示例代码：  

```python
def bubble(List):
    for j in range(len(List)-1,0,-1):
        for i in range(0,j):
            if List[i]>List[i+1]:List[i],List[i+1]=List[i+1],List[i]
    return List

```

---

### 时间复杂度  

在计算机科学中，算法的时间复杂度是一个函数，它定量描述了该算法的运行时间。这是一个关于代表算法输入值的字符串的长度的函数。时间复杂度常用大 O 符号表述，不包括这个函数的低阶项和首项系数。使用这种方式时，时间复杂度可被称为是渐近的，它考察当输入值大小趋近无穷时的情况。举例，如果一个算法对于任何大小为n的输入，它至多需要 5n^3+3n 的时间运行完毕，那么它的渐近时间复杂度是 O(n^3)。

计算时间复杂度的过程，常常需要分析一个算法运行过程中需要的基本操作，计量所有操作的数量。通常假设一个基本操作可在固定时间内完成，因此总运行时间和操作的总数量最多相差一个常量系数。

有时候，即使对于大小相同的输入，同一算法的效率也可能不同。因此，常对最坏时间复杂度进行分析。最坏时间复杂度定义为对于给定大小n的任何输入，某个算法的最大运行时间，记为 T(n)。通常根据 T(n) 对时间复杂度进行分类。比如，如果对某个算法有 T(n) = O(n)，则称其具有线性时间。如有 T(n) = O(2^n)，则称其具有指数时间。

常见的时间复杂度：

- 常数时间，O(1)
- 对数时间，O(log n),代表例子就是二分查找，每次搜索都为上次的一半
- 线性时间，O(n)
- 二次时间，O(n^2),代表例子冒泡排序

---

### 模块

模块，就是用一坨代码实现了某个功能的代码集合。

模块分为三种：  

1. 标准模块，集成到python程序中，可以直接import的都是；
2. 自定义模块，目录下包含 `__init__.py` 文件，那么它就是一个模块了；
3. 开源模块。

安装开源模块的推荐方式：

`pip install package-name`

#### 不同目录之间的模块导入  

首先，要知道 python 是如何去搜索模块的？python 自己维护了一个路径列表 sys.path，它会迭代这个列表的每一个路径去寻找模块。如果没有找到，就会报错： **no module**

所以要想可以导入自定义模块，有两种方式：  

1. 将自定义模块放在sys.path中的一个路径下（不推荐，以后模块多了非常混乱不易管理）
2. 将自定义模块的路径添加到sys.path中

```python
import os
import sys

#根据实际情况多层嵌套
base_dir = os.path.dirname(__file__) 
sys.path.append(base_dir)
```

#### time 模块和 datetime 模块  

时间日期模块:  

```python
import time,datetime

#使用time模块，首先得到当前的时间戳
In [42]: time.time()
Out[42]: 1456564798.400125

#将时间戳转换为时间元组 struct_time
In [43]: time.localtime(time.time())
Out[43]: time.struct_time(tm_year=2016, tm_mon=2, tm_mday=27, tm_hour=9, tm_min=42, tm_sec=20, tm_wday=5, tm_yday=58, tm_isdst=0)

#格式化输出想要的时间
In [44]: time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time()))
Out[44]: '2016-02-27 09:43:04'

#接上文，不加参数时，默认就是输出当前的时间
In [48]: time.strftime('%Y-%m-%d %H:%M:%S')
Out[48]: '2016-02-27 09:46:53’

#当然也可以透过datetime模块来实现，如下：
In [68]: t = time.time()
In [69]: datetime.datetime.fromtimestamp(t).strftime('%Y-%m-%d %H:%M:%S')
Out[69]: '2016-02-27 10:04:51’

#同时，也可以只使用datetime模块
In [46]: datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
Out[46]: '2016-02-27 09:45:27’
In [47]: datetime.datetime.today().strftime('%Y-%m-%d %H:%M:%S')
Out[47]: '2016-02-27 09:46:10'
```

```python
#计算昨天，同理还可以计算明天，后天，大后天
In [52]: d1 = datetime.datetime.now()
In [53]: d2 = d1 - datetime.timedelta(days=1)
In [54]: d1
Out[54]: datetime.datetime(2016, 2, 27, 17, 37, 38, 78880)
In [55]: d2
Out[55]: datetime.datetime(2016, 2, 26, 17, 37, 38, 78880)
```

```python
#时间元组转换成时间戳
In [56]: datetime.datetime.now()
Out[56]: datetime.datetime(2016, 2, 27, 17, 40, 37, 390713)

In [57]: datetime.datetime.now().timetuple()
Out[57]: time.struct_time(tm_year=2016, tm_mon=2, tm_mday=27, tm_hour=17, tm_min=41, tm_sec=1, tm_wday=5, tm_yday=58, tm_isdst=-1)

In [58]: time.mktime(datetime.datetime.now().timetuple())
Out[58]: 1456566088.0
```


####  os 模块  

与系统交互的模块:  

```python
import os

os.name     #字符串指示你正在使用的平台。比如对于Windows，它是'nt'，而对于Linux/Unix用户，它是'posix'。

os.getcwd() #函数得到当前工作目录，即当前Python脚本工作的目录路径。

os.chdir("dirname") #改变工作目录，相等于linux下的cd命令

os.curdir #返回当前目录

os.pardir #获取当前目录的父目录字符串

os.makedirs('dir1/dir2') #生成多层目录

os.makedir('dir1') #生成单级目录

os.removedirs('dirname') #如果目录为空，则删除

os.rmdir('dirname') #若目录为空，则删除，递归到上一级目录继续为空删除

os.getenv()和os.putenv() #函数分别用来读取和设置环境变量。

os.listdir()    #返回指定目录下的所有文件和目录名。

os.remove() #函数用来删除一个文件。

os.system() #函数用来运行shell命令。

os.linesep #字符串给出当前平台使用的行终止符。例如，Windows使用'\r\n'，Linux使用'\n'而Mac使用'\r'。

os.path.split() #函数返回一个路径的目录名和文件名。

>>> os.path.split('/home/swaroop/byte/code/poem.txt')
('/home/swaroop/byte/code', 'poem.txt')

os.path.isfile()和os.path.isdir()    #函数分别检验给出的路径是一个文件还是目录。类似地，os.path.existe()函数用来检验给出的路径是否真地存在。
```


#### sys 模块  

```python
import sys

sys.argv #命令行参数，以tuple形式存储，第一个元素为程序本身

sys.exit(n) #退出程序

sys.version #获取python解释器的版本信息

sys.maxint #最大的int值

sys.path #返回模块的搜索路径

sys.platform #返回操作系统平台名称

sys.stdout.write('please:') 
```


#### random 模块  

生成随机数:  

```python
import random

random.random() #默认生成一个大于0，小于1的随机数

random.randint(a,b) #a<= 随机数 <= b

random.randrange(start, stop=None, step=1) #start <= 随机数 < stop

```

### Day5 end

