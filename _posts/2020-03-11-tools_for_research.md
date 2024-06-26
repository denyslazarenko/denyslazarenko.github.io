---
title: Tools for a scientific research
layout: post
use_toc: true
excerpt: Tools for a scientific research
---

## How to setup simple markdown converter to pdf in Sublime:
![image](https://user-images.githubusercontent.com/13698885/78026067-5a27d700-735b-11ea-92b5-fe19884636e6.png)

1. Install `pandoc` and `pdflatex` 
```
sudo apt-get install texlive-latex-base texlive-fonts-recommended texlive-fonts-extra texlive-latex-extra
```
2. Start `Sublime` go to menu: Tools -> Build System -> New Build System 
3. In the New window `pandoc.sublime-build` put the following:
```
{
	"shell_cmd": "pandoc --toc --toc-depth=5 $file_base_name.md -o  $file_base_name.pdf"
}
```
  - `--toc --toc-depth=5` is responsible for generating `Table of content` and takes into account depth of `#####`
4. In order to modify `pandoc.sublime-build`:
  - In menu: Preferences -> Browse Packages -> User -> pandoc.sublime-build
5. In order to execute the `pandoc` press `Cmnd+B` 

## How to check grammar in your text:
- [Language Tool](https://github.com/languagetool-org/languagetool) with the [DB of n-gramms](https://languagetool.org/download/ngram-data/) in 5 different languages(works not worth than Grammarly, can be connected to the IDE). 

## SVG draw tool for papers and posters:
- [Inkscape](https://inkscape.org/)

## How to keep order of papers:
- There is a tool called [Mendeley](https://www.mendeley.com/newsfeed) which helps to keep order of all papers in one place. There is a posibility to connect it with cloud as well as to use extension in a browser. 
- Tutorial how to use it efficiently is [here](https://www.youtube.com/watch?v=pxgwBZMGq8k)
![image](https://user-images.githubusercontent.com/13698885/79067231-2edbab00-7cbe-11ea-9f67-76697bc30874.png)

## How to use jupyter notebooks efficiently:
- [Represent ipynb, md as a webpage hosted by GitHub](https://fastpages.fast.ai/fastpages/jupyter/2020/02/21/introducing-fastpages.html)
- [How to use Jupyter Notebooks in 2020.](https://ljvmiranda921.github.io/notebook/2020/03/16/jupyter-notebooks-in-2020-part-2/)
	* version control of jupyter notebooks
	* version control of data with DVC
	* deployment
- [How to run an MLflow tracking server on AWS EC2](https://medium.com/@alexanderneshitov/how-to-run-an-mlflow-tracking-server-on-aws-ec2-d7afd0ac8008)
- [Jupyter notebook to PDF extension](https://github.com/betatim/notebook-as-pdf)

## Create and Maintain python package:
- https://package-helper.readthedocs.io/en/latest/readme.html
- https://antonz.org/python-packaging/
