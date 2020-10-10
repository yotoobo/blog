---
title: "Python study day1"
date: 2016-01-16
categories: 
 - Python
tags:
 - ''
---

### 简介

Python是一门广泛流行的动态语言。它不光可以写后端，还可以做科学计算，Web，图像处理，做自动化运维，自动化测试，爬虫，数据分析等。

特点:

- 纯面向对象语言，万物皆对象
- 支持面向过程和面向对象的编程范式
- 丰富的标准库和第三方库，可以完成任何能想到的事情
- 良好的可扩展性，可以很容易的和其他语言进行交互

缺点:

- 性能欠佳


<!-- more -->

Python 主流解释器:

- CPython: 官方版, 使用 C 语言实现, 使用最为广泛, 会将源代码转换成字节码 (.pyc) 运行
- JPython: 使用 Java 实现
- PyPy: 使用 Python 实现，为速度而优化,兼容性没有 CPyhton 好


### Python2 还是 Python3

因为很多 Linux 发行版还是预装的 Python2，所以在未来一段时间还会作为主要版本使用。
但是 Python3 无论是从性能上还是功能上，都已经超越了Python2，主流库基本都可以在 Python3 下使用，所以是时候学习并使用 Python3 了。

#### What's new in Python3 ?

- print to print()

```python
# Py2
print "hello world"
# Py3
print("hello world")
```

- raw_input() to input()

```python
# Py2
raw_input("> ")
# Py3
input("> ")
```

- All is Unicode

- math

```python
# Py2
>>> 1/2
0
# Py3
>>> 1/2
0.5
```

- 更多信息请阅读 [WhatsNew](https://docs.python.org/3/whatsnew/3.0.html)



### 第一个程序

编写一个 `hello_world.py` 文件，内容如下：

```python

#/usr/bin/env python3
# -*- coding: utf-8 -*-

print("hello world")
```

1. 第一行代码指定使用哪个 Python 解释器，env 会去找名叫 python3 的解释器来执行代码.
2. 第二行代码指定了文件编码

在命令行中执行代码:

```shell
python3 hello_world.py
```


### 缩进

Python 代码既整洁又美观，是因为它使用缩进来表示层级关系。所以一定要注意缩进是否正确，不然代码是无法正确被执行的。

>推荐使用4个空格来代替Tab键。

```python
#/usr/bin/env python3
# -*- coding: utf-8 -*-

if True:
    print("Hello")
else:
    print("World")
```



### 基本数据类型

数据类型是重点, 需要完全掌握。

基本类型:

- int: `-1, 0, 1`
- float: `1.2, 0.1`
- string:

```shell
# 单引号与双引号都可以: 'Hello',"World" 

# 有个地方要注意一下，单引号中的单引号需要转义
test1 = 'I\'m boy'
test2 = "I'm boy"
```

- 布尔型
    - True or 1
    - False or 0

- 列表
    - 定义一个列表: `new_list = [1,2,3,4]`
    - 列表操作
        - 列表通过索引(下标)获取数据，索引从0开始, 如 new_list[0]
        - append(object) # 往列表末尾添加元素
        - clear() # 清空列表所有元素
        - copy() # 浅拷贝
        - count(value) # 统计指定元素出现几次
        - index(value,[start,[stop]]) # 查找指定元素第一次出现的下标
        - insert(index,object) # 将元素插入指定位置
        - pop([index]) # 默认删除列表最后一个元素
        - remove(value) # 删除第一次出现的元素
        - sort() # 对列表的元素进行排序
        - extend(iterable) # 将 iterable 中的元素添加到列表中
- 元组
    - 列表是可变的，而元组不可变
    - 声明一个元组
        - `new_tuple = (0,1,2,3)`
    - 元组操作
        - count()
        - index()
- 字典
    - 存储任意kv键值对，查询速度超级快. 但是占内存。



### 变量与赋值

什么是变量？

在 Python 中，它是一个引用(类似 windows 快捷方式，变量本身不存储值)，通过变量，可以读取内存中保存的真实数据。

执行以下代码:

```python
name = 'aarong.wang'
name_copy = name
name = 'alex'
print(name,name_copy)
```

说明：

1. 先声明一个变量名 name
2. 在内存中开辟一个空间，用来存储等号右边的字符串 'aarong.wang'
3. 通过 = 把name 指向到存储 'aarong.wang' 的内存地址
4. 声明变量 name_copy
5. 重新赋值 name 变量
6. 打印两个变量

![变量示意图](https://img.pycoder.org/20181024230834.png)

明确一个概念：变量与真正的变量值之间是引用的关系。


>还可以使用 id() 方法来验证变量的**引用**:

```python
a = 10
b = a
print(id(a),id(b))
```

>通过结果可以得知变量 a 和 b 内存地址相同，这说明a与b是相同的。

变量名命名规则:

1. 只能以字母或下划线开头
2. 由字母、下划线、数字组成
    1. 合法变量名: a_1, _a1
    2. 非法变量名: 1_a, $a
3. Python 关键字不能作为变量名，如 if, else
4. 尽量使用有意义的变量名.

常用两种命名规范:

1. aa_bb_cc
2. AaBbCc

>尽量选择一种并一直贯彻使用下去,不要在代码中同时出现这两种命名方式.



### 用户交互

很多情况下，程序需要通过用户的输入来引导程序的走向。
比如注册新用户, 你要告诉程序你的信息。不然它会傻傻的等到天荒地老。

Python3 使用 `input()` 函数来获取用户输入

```python
#/usr/bin/env python3
# -*- coding: utf-8 -*-

sex = input("Are you are boy or girl? ")
```

>Python2 中使用 raw_input() 接受用户输入.

|| input() | raw_input() |
|------------- |------------- | -------------|
|Python2|接收用户输入作为变量名，变量存在则输出，不存在报错|接收用户输入|
|Python3|接收用户输入|没有这个函数|

### 流程控制

当获取到了用户输入，就可以来做判断了。

示例:

```python
#/usr/bin/env python3
# -*- coding: utf-8 -*-

sex = input("Are you are boy or girl? ")

if sex == "boy":
    print("去男厕")
elif sex == "girl":
    print("去女厕")
else:
    print("我也不知道你该去哪个厕所")
```



### 循环

接着上面的栗子，因为只能输入一次，如果用户不小心输错性别，那不得后悔死啊！
所以就要用到循环来给用户更多的机会。

#### while 循环

```python
#/usr/bin/env python3
# -*- coding: utf-8 -*-

while True:
    sex = input("Are you are boy or girl? ")

    if sex == "boy":
        print("去男厕")
    elif sex == "girl":
        print("去女厕")
    else:
        print("我也不知道你该去哪个厕所")
```

这下好了，用户总算可以找对厕所了。

但是用户又说了：为什么程序一直问我性别啊！输完了还问！

因为开头我们设置的 while 条件为 True，所以程序会一直运行。

那就让程序知道为 boy 时退出(女生可以继续玩)：

```python
#/usr/bin/env python3
# -*- coding: utf-8 -*-

while True:
    sex = input("Are you are boy or girl? ")

    if sex == "boy":
        print("去男厕")
        break
    elif sex == "girl":
        print("去女厕")
    else:
        print("我也不知道你该去哪个厕所")
```

#### for 循环

都说事不过三，不能老是犯错误吧！
所以加个次数限制，如果还是错了，那真对不起了！

这里使用 for 循环限制3次：

```python
for i in range(3):
    sex = input("Are you are boy or girl? ")

    if sex == "boy":
        print("去男厕")
        break
    elif sex == "girl":
        print("去女厕")
    else:
        print("我也不知道你该去哪个厕所")
        print("你到底是男是女还是~~")
```

在循环体中有两个非常有用的关键字需要理解并记住:

- break: 跳出当前循环
- continue: 跳出本次循环，继续下一次循环



### 文件操作

如下:

```python
open_file_obj = open('hello_world.py','r')
```

文件模式:

- 'r', 默认只读，可以省略不写
- 'w', 只写，文件存在会清空内容从头写入，文件不存在会创建
- 'a', 追加，文件存在会定位到文件末尾添加新内容，文件不存在会创建并写入
- '+', 打开文件并更新(可读可写)
- 'x', 创建新文件，并打开写入，如果文件存在则抛出异常：FileExistsError
- 't', 文本模式(默认)，如 rt
- 'b', 二进制模式，如 rb

> 在使用 w 模式，要注意备份数据，以免丢失。

打开文件, file_obj 是一个对象:

```python
file_obj = open('/path/to/file','r')
```

读取文件:

```python
file_obj.read([size]) # 读取所有内容
file_obj.readline() # 读取一行
file_obj.readlines() # 按行读取所有内容，按行存储在列表中
```

写入文件:

```python
file_obj.write("xxx")
```

刷新文件缓冲, 直接写入文件中:

```python
file_obj.flush()
```

关闭文件句柄:

```python
file_obj.close()
```

打开文件后最后都要手动关闭它,不然会一直占用资源. 

为了简便, Python 提供了 `with ... as ...` 的方式在操作完文件自动调用 close() 方法关闭文件句柄：

```python
with open('hello_world.py','r') as f:
    print(f.read)

with open('file1','r') as f,open('file2','w'):
    pass
```

文件指针:

```python
In [8]: file_obj = open(r'C:\Users\chubin\Desktop\newfile.txt','r')

In [9]: file_obj.tell() # 指针默认在开始位置
Out[9]: 0

In [10]: file_obj.seek(2) # 将指针偏移 2 个字节
Out[10]: 2

In [11]: file_obj.tell()
Out[11]: 2
```


### Day1 End
