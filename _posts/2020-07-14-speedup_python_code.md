---
title: Ways to speed up a python program
layout: post
use_toc: true
excerpt: Ways to speed up a python program
---
## 1. Before starting any optimizations identify the most problematic parts of Code 

### Python debugging performance 
- [Blog which collects useful tools](https://pythonspeed.com/articles/beyond-cprofile/)
- [PyInstrument](https://github.com/joerick/pyinstrument/)      

  ```python
  from pyinstrument import Profiler

  profiler = Profiler()
  profiler.start()

  tm = TMI()
  tm.fit(tree_100_0, tree_100_1)
  profiler.stop()

  print(profiler.output_text(unicode=True, color=True))
  ```    

- [cProfiler](https://ipython-books.github.io/42-profiling-your-code-easily-with-cprofile-and-ipython/)     

  ```
  %%prun -s tottime -q -l 20 -T prun0

  print(open('prun0', 'r').read())
  ```    
  
The %prun and %%prun magic commands accept multiple optional options (type %prun? for more details). 
In the example, 
-s allows us to sort the report by a particular column, -q to suppress (quell) the pager output (which is useful when we want to integrate the output in a notebook), 
-l to limit the number of lines displayed or to filter the results by function name (which is useful when we are interested in a particular function), 
and -T to save the report in a text file. In addition, we can choose to save (dump) 
the binary report in a file with -D, or to return it in IPython with -r. 
This database-like object contains all information about the profiling and can be analyzed through Python's pstats module.

## 2. Cython
- [Online Course from oreilly](https://learning.oreilly.com/videos/learning-cython/)
- Sample code of usage from [scikit-learn ](https://github.com/scikit-learn/scikit-learn/blob/master/sklearn/metrics/cluster/_expected_mutual_info_fast.pyx)
- Before starting make sure that `sudo apt-get install g++`
- Use magic method in jupyter nobooks for fast prototyping. Flag -a means to give analysis which shows parts which may be optimized `%%cython -a`
- In order to compile the file and later on import it in your code use: `python setup.py build_ext --inplace`

## 3. Multithreading in Python
- [Book and code repo from Packt](https://github.com/PacktPublishing/Mastering-Concurrency-in-Python)
- There are can be several `Threads` inside one `Process`. `Threads` share resources between each other, while `Process` can be executed in `parallel`: without any sharing.    
![image](https://user-images.githubusercontent.com/13698885/87418526-1b4c2300-c5d2-11ea-8b6b-8940428d4ff2.png)



