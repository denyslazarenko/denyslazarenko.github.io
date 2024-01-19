---
title: [LLMOps] How to create an evaluation pipeline for production ready RAG
layout: post
use_toc: true
excerpt: [LLMOps] How to create an evaluation pipeline for production ready RAG
---
## System Design

## UI

## Metrics
### Chunking
this is difficult to measure, therefore we can only evaluate end-to-end performance. 

### Retrival
focuses on how accurately we can retrieve necessary chunks from vector store.
- #### Mean Average Precision
- evaluates System 1’s result for the query to be 0.6 and System 2’s to be 0.1. 
![image](./images/LLMOps/retrival.png)
- #### Ragas
  - Context Precision
    - evaluates whether all of the ground-truth relevant items present in the `context` are ranked higher or not. Ideally all the relevant chunks must appear at the top ranks. This metric is computed using the `question` and the `contexts`.

### Generation
- #### BLEU/ROUGE
- #### BERTScore
- #### Ragas
  - Answer Relevance 
    - focuses on assessing how pertinent the generated answer is to the given prompt. This metric is computed using the `question` and the `answer`.     
  - Faithfulness
    - This measures the factual consistency of the generated answer against the given context. It is calculated from `answer` and retrieved `context`.


### Literature 
- Books from [O'Reilly](https://learning.oreilly.com/library/view/)