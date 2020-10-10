---
title: "Python study day2"
date: 2016-01-22
categories: 
 - Python
---

### 执行过程

Python 执行过程：

1. Python 解释器读取源代码到内存中
2. 解释器进行词法,语法检测
3. 解释器将源代码翻译成字节码
4. 将字节码交由 Python 虚拟机执行

>Note：.pyc 文件就是字节码的文件存储。 Python 解释器会优先执行 pyc 文件。 
>如果源码文件修改时间较新，则会执行源码并重新生成 pyc 文件。

![](https://img.pycoder.org/20181026001732.png)

<!--more-->

Python 脚本的执行方式:

1. 指定 Python 解释器:  
`$ python xxx.py`
2. 脚本里指定了解释器,并给文件加执行权限:  
`$ ./xxx.py`


### 编码

计算机是老美发明的，所以计算机最早只支持美国人常用的255个字符，即 [ASCII](https://zh.wikipedia.org/wiki/ASCII) 编码，只包括大小写字母，数字还有一些特殊符号。

当计算机在世界范围内迅速发展起来，很多国家都不满足于 `ASCII` 编码，于是都搞起了适合本国使用的编码。假如中国人使用本国编码 gbk 写邮件给外国人，那么外国人打开后看到的不是正常文字，而是乱码。

这种问题的根本原因就在于不同编码之间互不相识。

为了解决各国混乱的编码问题，非营利机构统一码联盟推出了万国码[Unicode](https://zh.wikipedia.org/wiki/Unicode)，它包含了世界上所有的字符，可以解决不同国家之间编码混乱的问题。

虽然乱码问题解决了，但是 Unicode 规定一个字符占用2个字节。如果在使用英语的国家，使用 Unicode 编码会浪费很多空间。于是出现了可变长字符编码：[UTF-8](https://zh.wikipedia.org/wiki/UTF-8). 它在兼顾编码统一的情况下，可以更加节省存储成本。

回到 Python：  
因为 Python2 默认使用了 ASCII，打印中文会乱码，所以在源代码文件种要显示指定使用 utf-8 来存储代码:  

`# -*- coding: utf-8 -*-`  

>Python3 可以忽略，因为默认使用 Unicode。

编码转换：  

- Python2: 首先要先将编码转换成 Unicode ，然后在转换成 gbk 等
- Python3: 默认使用 Unicode 编码。所以在转换编码时，直接转换成 gbk 等编码了。



### 三元运算

如果 if 条件表达式成立，变量A = 值A, 否则值 A = 值B : 


```python
variable_a = 10 if 10%2 == 0 else 9
print(variable_a)   # 输出 10
variable_a = 10 if 10%3 == 0 else 9
print(variable_a)   # 输出 9
```



### 运算符

**数学运算符：**

| 运算符 | 描述            |
| ------ | --------------- |
| +      | 加              |
| -      | 减              |
| *      | 乘              |
| /      | 除              |
| %      | 求模-返回余数   |
| x**y     | 幂-返回x的y次方 |
| //     | 取商的整数部分  |

**比较运算符：**

| 运算符 | 描述         |
| ------ | ------------ |
| ==     | 等于，比较值 |
| !=     | 不等于       |
| >      | 大于         |
| <      | 小于         |
| >=     | 大于等于     |
| <=     | 小于等于     |

**赋值运算符：**  

| 运算符 | 描述                      |
| ------ | ------------------------- |
| =      | 赋值，如 x = 10           |
| +=     | x += y 等同于 x = x + y   |
| -=     | x -= y 等同于 x = x - y   |
| *=     | x *= y 等同于 x = x * y   |
| /=     | x /= y 等同于 x = x / y   |
| %=     | x %= y 等同于 x = x % y   |
| **=    | x **= y 等同于 x = x ** y |
| //=    | x //= y 等同于 x = x // y |

**逻辑运算符：**  

| 运算符 | 描述 |
| ------ | ---- |
| and    | 与   |
| or     | 或   |
| not    | 非   |

**成员运算符：**  

| 运算符 | 描述                       |
| ------ | -------------------------- |
| in     | 如果x是y的成员，返回True   |
| not in | 如果x不是y的成员，返回True |

**同一性运算符：**  

| 运算符 | 描述                                                |
| ------ | --------------------------------------------------- |
| is     | 判断是否是同一个引用地址，即 id(x) 与 id(y) 是否相等 |
| is not | 判断是否不是同一个引用地址                          |


>注意：  
>这里容易和 `==` 混淆。`==` 是判断值相等； 而 `is` 是判断
>是否是指向同一个内存地址


**优先级：**  

| 运算符                   | 描述                                                   |
| ------------------------ | ------------------------------------------------------ |
| **                       | 指数 (最高优先级)                                      |
| ~ + -                    | 按位翻转, 一元加号和减号 (最后两个的方法名为 +@ 和 -@) |
| * / % //                 | 乘，除，取模和取整除                                   |
| + -                      | 加法减法                                               |
| <= < > >=                | 比较运算符                                             |
| <> == !=                 | 等于运算符                                             |
| = %= /= //= -= += *= **= | 赋值运算符                                             |
| is is not                | 身份运算符                                             |
| in not in                | 成员运算符                                             |
| not or and               | 逻辑运算符                                             |



### 对象，对象，对象

对象的概念到后面会讲，现在只要先记住几个结论：

1. 一切皆对象
2. 对象是由类创建的
3. 对象具有的功能都是从类里找的

```python
x = 0 # x = int('0')
x = '10' # x = str(10)
x = [] # x = list()
x = () # x = tuple()
x = {} # x = dict()
```


### int 内部功能介绍

>Note: Python3 中没有 long 类型了, 统一为 int .

常用方法：

* `__abs__` # 返回绝对值，可以直接调用abs()
* `__add__` # 3+2 表达式中的 *+* 就是调用的这个方法 
* `__bool__` # 返回True 或 False
* `bit_length()` # 返回当前数的最小位数(二进制)
* `__divmod__` # 返回一个由商和余数组成的元组

```python
In [160]: divmod(10,3)
Out[160]: (3, 1)
```

* `__eq__` # 判断两个数的值是否相等

```python
In [161]: s = 19
In [162]: s.__eq__(20)
Out[162]: False
```

* `__float__` # 转换成浮点型
* `__floordiv__` # 只保留商的整数部分

```python
In [170]: s
Out[170]: 19
In [171]: s.__floordiv__(3)
Out[171]: 6
In [172]: 19 / 3
Out[172]: 6.333333333333333
```

* `__or__` # 等同于 a|b
* `__pow__` # 幂运算
* `__divmod__` 

```python
In [28]: x
Out[28]: 10

In [29]: x.__pow__(2)
Out[29]: 100

In [30]: x.__divmod__(9)
Out[30]: (1, 1)

```

### 字符串

字符串就是使用一对单引号或一对双引号括起来的任意字符。

当单引号中含有单引号或双引号中含有双引号时，需使用反斜杠来转义。 

多行字符串：使用一对 *"""* 或 *'''* 来生成多行字符串。

转换字符串：str()

**声明字符串**

```python
my_str = 'hello world'
print(my_str)
```

**字符串重复**

```python
'123' * 2
('abc' * 2) + '123'
```

**字符串拼接**

>以前常使用 *+*, 但是这种方式浪费内存，效率也不高。不推荐使用。推荐使用 format 方法。


**字符串格式化**

使用 %s

```python
print('Hello, %s.' %('wang'))
```

**字符串 format 方法**

```python
In [16]: s = '{}{}'.format('1','123')

In [17]: s
Out[17]: '1123'

In [20]: s = '{1}<{1}'.format('1','123')

In [21]: s
Out[21]: '123<123'
```

**遍历字符串**  
字符串是可迭代对象:  

```python
s = 'abcde'
for i in s:
    print(i)
```

**使用索引打印**

```python
>>> s = 'abcde'
>>> s[0]
'a'
```

**字符串切片**

```python
>>> s = 'abcde'
>>> s[:2]
'ab'
>>> s[-2:]
'de'
```

**字符串替换**

使用 replace() 方法：

```python
>>> s = 'hello world'
>>> s.replace('world','hello')
```

**字符串查找**

- S.index(sub[, start[, end]])
 
```python
>>> s = 'abca'
>>> s.index('a')
0
>>> s.index('a',1)
3
```
 
- find()
    - 和 index() 用法一样. 但是在找不到时返回 -1，而 index() 找不到会报错
- rindex()
    - 反向查找

```python
>>> s = 'abca'
>>> s.rindex('a')
3
```

- rfind()
    - 反向查找

**字符串分割**

可以用 S.split, S.rsplit 方法，通过相应的规则来切割成生成列表对象

```python
>>> s = 'a b c d e'
>>> s.split() # 默认使用空格，可以指定其他
['a', 'b', 'c', 'd', 'e']
>>> s.split('b')
['a ', ' c d e']
```

S.splitlines([keepends]), 把S按照行分割符分为一个 list，keepends 是一个 bool 值，如果为真每行后会保留行分割符。  

```python
>>> s = 'a\nb\nc\n'
>>> s.splitlines()
['a', 'b', 'c']
>>> s.splitlines(True)
['a\n', 'b\n', 'c\n']
```

**字符串反转**

```python
>>> s = 'abc'
>>> s[::-1]
'cba'
```

**字符串的join方法**

```python
>>> s = 'abc'
>>> ' '.join(s)
'a b c'
>>> s = ['a','b','c']
>>> ''.join(s)
'abc'
>>> '_123_'.join(s)
'a_123_b_123_c'
```

**使用 len() 计算字符串长度**

`>>> len('abc') # 返回3` 

**字符串大小写**

S.upper() # S 中的字母大写  
S.lower() # S 中的字母小写  
S.capitalize() # 首字母大写  
S.istitle() # S 是否是首字母大写的  
S.isupper() # S 中的字母是否全是大写  
S.islower() # S 中的字母是否全是小写  
S.swapcase() # 大小写互换  
S.title() # 首字符大写, 其他小写

```python
>>> 'abc'.upper()
'ABC'
>>> 'ABC'.lower()
'abc'
>>> 'abc'.capitalize()
'Abc
>>> 'abc'.istitle()
False
>>> 'abc'.isupper()
False
>>> 'abc'.islower()
True
>>> 'aBc'.swapcase()
'AbC'
>>> 'who am i'.title()
'Who Am I'
```

**字符串去空格**

strip(), lstrip(), rstrip() 方法默认去除字符串的空格，可以指定去除其他字符。  
S.strip() 去掉字符串的左右空格  
S.lstrip() 去掉字符串的左边空格  
S.rstrip() 去掉字符串的右边空格  

```python
>>> ' abc'.lstrip()
'abc'
>>> 'abc '.rstrip()
'abc'
>>> ' a b c '.strip() # 只去掉字符串两头的空格
'a b c'
```

**字符串其他方法**

字符串还有很多玩法可以折腾，如：  
S.center(width[, fillchar])  # 字符串居中

```python
>>> s = 'abc'
>>> s.center(20)
'        abc         '
>>> s.center(20,'*')
'********abc*********'
```

S.count(substr, [start, [end]]) # 计算 substr 在 S 中出现的次数  
`>>> 'aabc'.count('a') # 返回2`  

S.encode() # 编码，默认 utf-8

S.expandtabs(tabsize=8) # 将 tab 转换成空格

```python
>>> s
'\tabc'
>>> ss = s.expandtabs()
>>> ss
'        abc'
```

S.endswith() # 判断尾字符  
`>>> 'abcd'.endswith('d') # 返回True`

S.isalnum() # 是否全是字母和数字，并至少有一个字符   

```python
>>> 'abc'.isalnum() # 返回True 
>>> '23ab'.isalnum() # 返回True
>>> '_23ab'.isalnum() # 返回False
>>> ''.isalnum() # 返回False
```
S.isalpha() # 是否全是字母，并至少有一个字符  

```
>>> 'abc'.isalpha()
True
>>> 'abc_'.isalpha()
False
```

S.isdigit()  # 是否全是数字，并至少有一个字符

```
>>> '123'.isdigit()
True
>>> '123_'.isdigit()
False
```

S.isspace() # 是否全是空白字符，并至少有一个字符  

`>>> ' '.isspace() # 返回True`  

S.rpartition()  # 返回分隔符本身，和前后的子字符串

```python
>>> s
'who am i'
>>> s.rpartition('am')
('who ', 'am', ' i')
>>> s.rpartition('is') # 如果分隔符没有找到，则返回两个空字符串和s
('', '', 'who am i')
```

S.startswith() # 判断首字符  
`>>> 'abcd'.startswith('ab') # 返回True`

查看详细的字符串方法  

`>>> dir('str')`



### 列表

列表存储的是N个元素，类型任意，通过下标(索引) 返回对应值。
特点：

1. 有序
2. 下标从0开始

常用方法：

- 列表通过索引(下标)获取数据，索引从0开始。如 new_list[0] 为第一个元素
- append(object) 往列表末尾添加元素
- clear() 清空列表所有元素
- copy() 浅拷贝
- count(value) 统计指定元素出现几次
- index(value,[start,[stop]]) 查找指定元素第一次出现的下标
- insert(index,object) 将元素插入指定位置
- pop([index]) 默认删除列表最后一个元素
- remove(value) 删除第一次出现的元素
- sort() 对列表的元素进行排序
- extend(iterable)  将iterable中的元素添加到列表中

>Note: 相对于copy(),还有一种深拷贝。浅拷贝还有一定联系。而深拷贝可以理解成是一个完全独立的复制体。



### 元组

元组是列表的一个子集，元组有的方法列表都有。  
特点：

- 元组的元素不可变

>Note: 不可变性只适用于元组元素,不适用元组元素的子元素。比如元组中有一个元素是列表类型，列表中的元素就是可变的。

```python
In [11]: tu = (1,2,[1,2,])

In [13]: tu[2][0]=2

In [14]: tu
Out[14]: (1, 2,[2,2,])
```

创建元组：

```python
t = (1,2,3,) 等价于 t = 1,2,3, # 要注意最后有一个逗号，当只有一个元素时，一定要有逗号。

In [192]: type((1))
Out[192]: int

In [193]: type((1,))
Out[193]: tuple
```

方法：

- count()
- index()
- 切片操作

列表元组转换：

```python
In [187]: tuple(l)
Out[187]: (1, 2, 3)

In [188]: t = (1,2,3,)

In [189]: list(t)
Out[189]: [1, 2, 3]
```

字符串转元组：

```python
In [190]: s = 'hello'

In [191]: tuple(s)
Out[191]: ('h', 'e', 'l', 'l', 'o')
```



### 字典

**简介**  

字典存储的是N个键值对(k:v). 键的类型为字符串或数字，值的类型任意。  

特点：  

1. 无序  
2. 键唯一  
3. 占用内存
4. 查询速度快

**创建字典**  


第一种方式.     

```python
>>> d=dict{) # 创建一个空字典
>>> d={'tom':‘cat’,001:23}
```

第二种方式.   

```python
>>> items=[('name','wzl')]
>>> dict(items)
{'name': 'wzl'}
>>> d=dict([('name','yuan'),('job','stu')])
```

第三种方式.      

```python
>>> d = {k:v for (k,v) in zip(['a','b','c'],[1,2,3])}
>>> d
{'a': 1, 'c': 3, 'b': 2}
```


**字典基本操作**  
  
```python
d={'tom':'cat', 001:23}

d['tom']  # 取值

d['tom'] = 20  # 如果key存在，更新‘tom'所对应的值；如果key不存在，则为添加
```

**遍历字典**  
可以遍历 keys()，values()，items()
  
```python
dic = {'k1':'v1,'k2':'v2','k3':'v3'}

for k in dic.keys():	#打印所有的key
    print(k)

for v in dic.values():	#打印所有的value
    print(v)

for k,v in dic.items(): #打印所有的key:value
    print(k,v)

# 打印value，并自动添加序号，数字表示从1开始，默认为0
for i,v in enumerate(dic.values(),1):
    print(i,v)
```

**常用方法**  

* clear(),清空所有键值对
* copy(),浅拷贝
* fromkeys(),创建一个新字典：从一个可迭代对象获取元素作为key，并且value设为同一值
  
```python
>>> d = {}
>>> d.fromkeys([1,2,3],'hello')
{1: 'hello', 2: 'hello', 3: 'hello'}
```

* get(k[,d]), 获取 k 对应值，如果 k 不存在，默认返回 None。可通过 d 来指定返回值
  
```python
>>> d = {1: 'hello', 2: 'hello', 3: 'hello'}
>>> d.get(1)
'hello'
>>> d.get(5) #d.keys()没有5，返回None
>>> d.get(5,100)
100
```

* items()，a set-like object providing a view on D's items
* keys(),a set-like object providing a view on D's keys
* pop(k,d=None), 删除指定的k。如果 k 不存在，且 d=None，返回 KeyError
  
```python
d = {1: 'hello', 2: 'hello', 3: 'hello'}
d.pop(1)
d.pop(100) # KeyError
d.pop(100,'invalid') # 返回 invalid
```

* popitem(), 删除任一键值对，并以元组的形式返回。如果字典为空，则抱 KeyError
* setdefault(k,d=None),同get(k,d=None)。只不过当k不存在时，会执行添加
  
```python
In [110]: d
Out[110]: {1: 'default'}

In [111]: d.setdefault(2)

In [112]: d
Out[112]: {1: 'default', 2: None}

In [113]: d.setdefault(3,'v3')
Out[113]: 'v3'

In [114]: d
Out[114]: {1: 'default', 2: None, 3: 'v3'}
```

* update(E=None,**F)
* values(), a set-like object providing a view on D's values

### Day2 End
