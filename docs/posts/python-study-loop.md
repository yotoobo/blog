---
title: "Python study loop"
date: 2016-01-30
categories: 
 - Python
---

### 循环是什么？  
转自维基的解释：

- 循环是一段在程序中只出现一次，但可能会连续运行多次的代码。循环中的代码会运行特定的次数，或者是运行到特定条件成立时结束循环，或者是针对某一集合中的所有项目都运行一次。  
- 更多信息请阅读：[维基百科-程序循环](https://zh.wikipedia.org/wiki/%E7%A8%8B%E5%BC%8F%E8%BF%B4%E5%9C%88)


<!--more-->

#### python实现循环的方式有：  

1. for循环  
    - 它拥有一个循环计数器或是循环变数。这使得For循环能够知道在迭代过程中的执行顺序。  
2. while循环  
    - 可以在特定条件成立时继续循环的进行，或是特定条件不成立时继续循环的进行，进行到特定条件成立为止

---

> 这里以while循环为例，尝试解决3层循环嵌套的进入退出。

#### 设置3个变量，作为3个while的条件

```python
lay1_loop = False
lay2_loop = False
lay3_loop = False
```

#### 先实现一个两层循环：

```python
while not lay1_loop:    #条件为真，进入第一层while循环
    print("这里是第一层循环...")        
    choose = input("q,退出  其他键继续: ").strip()

    if choose == 'q': 
        lay1_loop = True
        lay2_loop = True
    else:
        pass

    while not lay2_loop:  #条件为真，进入第二层while循环
        print("这里是第二层循环...")        
        choose = input("b,返回上一层 q,退出 其他键继续: ").strip()                
        
        if choose == 'b': 
            lay2_loop = True        
        elif choose == 'q':            
            lay2_loop = True            
            lay1_loop = True
        else:
            pass
```

>改进：
这段代码中，如果想要退出，就要同时设置lay1_loop, lay2_loop 为True。
>假设循环有更多层的嵌套，相应的就要同时更改多个变量。这样代码就会很容易出错，也不够友好。
>那么既然要退出整个循环，是否可以只要设lay1为True并且第二层的while
条件也为假呢？

#### 修改后的代码：

```python
while not lay1_loop:    #条件为真，进入第一层while循环
    print("这里是第一层循环...")        
    choose = input("q,退出  其他键进入下一层: ").strip()

    if choose == 'q': 
        lay1_loop = True  
    else:
        pass

    while not (lay1_loop or lay2_loop):  #当lay1为真，两个while的条件都为False，退出循环
        print("这里是第二层循环...")        
        choose = input("b,返回上一层 q,退出 其他键进入下一层: ").strip()                
        
        if choose == 'b': 
            lay2_loop = True        
        elif choose == 'q':        
            lay1_loop = True
        else:
            pass
```
同理继续添加第三次while循环。

#### 3层嵌套

```python
while not lay1_loop:    #条件为真，进入第一层while循环
    print("这里是第一层循环...")        
    choose = input("q,退出  其他键进入下一层: ").strip()

    if choose == 'q': 
        lay1_loop = True  
    else:
        pass

    while not (lay1_loop or lay2_loop):  #当lay1为真，两个while的条件都为False，退出循环
        print("这里是第二层循环...")        
        choose = input("b,返回上一层 q,退出 其他键进入下一层: ").strip()                
        
        if choose == 'b': 
            lay2_loop = True        
        elif choose == 'q':        
            lay1_loop = True
        else:
            pass

        while not (lay1_loop or lay2_loop or lay3_loop):
            print("这里是第三层循环...")
            choose = input("b,返回上一层 q,退出:  ").strip()

            if choose == 'b': 
                lay3_loop = True        
            elif choose == 'q':        
                lay1_loop = True

```




### 代码中的小虫子

>当进入二层循环后：输入b返一层循环后(lay2_loop = True)，程序会卡在第一层循环中，无法再次进入二层。因为第二个while的条件不成立了。

>同理二层进入三层也会碰到这个问题。


>解决：

>第一层if中的pass语句改为 lay2_loop = False

>第二层if中的pass语句改为 lay3_loop = False
