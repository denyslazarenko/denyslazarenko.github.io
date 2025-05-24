---
title: Reliable planning with LLMs
layout: post
use_toc: true
excerpt: AI Agents reasoning and planning
---

## Introduction

A few days ago, OpenAI released o1 - a new series of AI models designed to spend more time thinking before they respond. The results are very impressive: on the GPQA benchmark, which tests physics, biology, and chemistry problems, the model exceeds the level of a human PhD.  It's evident that the new generation of models is gradually shifting from System 1 reasoning (fast, intuitive thinking) to System 2 reasoning (slow, deliberate thinking), which is great news for Agentic Workflows. 

While the o1 model represents a significant advancement, it is not without its limitations. We will talk below about them in more details. Recognizing these nuances and learning how to tackle these and other limitations of the models is crucial as we move towards more complex applications like AI agents.

## AI Agents are becoming a reality

In 2024 AI agents' topic dominates tech news. People try to use them everywhere: Customer Support, Market Research, Software Development, etc. While agents are an impressive concept, the initial prototype phase - when everything seems amazing and full of potential - is often followed by a sobering realization: bringing them into production and ensuring reliable operation isn't as straightforward as it first appears. Let's dive into the details.

An AI agent is a system that autonomously performs tasks by planning its actions and utilizing available tools. To solve tasks, agents use:

- **planning** by devising step-by-step actions from the given task
- **tools** to extend their capabilities like RAG, external APIs, or code interpretation/execution
- **memory** to store and recall past interactions for additional contextual information

Tool calling works fairly well in latest LLMs and [latest benchmarks](https://gorilla.cs.berkeley.edu/) confirms it. Memory is getting better and we have covered it in the previous [blog post](https://interloom.io/en/blog/Remember-Everything-Ever-Collective-Long-Term-Memory-of-AI-Agents-against-the-Doom-of-Documentatio-922a0bd73dcd48d89a6556c793bbcfba) . Meanwhile, planning and reasoning problem is still not solved at all and arguably the most important part at this time. These capabilities are essential in more complex, real-world scenarios, such as autonomous decision-making, problem-solving, and strategic thinking. So today, we would like to talk about the absolute core for us at Interloom - **Planning**. 

## What is planning?

> Foundations could be found [here](https://www.cs.toronto.edu/~sheila/2542/s14/slides.html).
> 

The concept of planning is deeply rooted in various disciplines and has been an integral part of human decision-making processes throughout history. For example, in conjunction with automated sheet-metal bending machines to optimize manufacturing processes. The software is crucial in planning how each bend is made to avoid errors, improve efficiency, and ensure high-quality production.

<div style="display: flex; justify-content: center; align-items: center; padding-top: 20px; padding-bottom: 20px;">
    <img src="{{ site.baseurl }}/images/Reliable_planning/manufacturing_planning.png" style="max-width: 80%; height: auto;"/>
</div>

<aside>
Plan - A scheme, program, or method worked out beforehand for the accomplishment of an objective
Plan - A proposed or tentative project or course of action
</aside>

In the realm of discrete mathematics, set theory and logic, optimization methods planning is not a novel idea, rather a fundamental aspect that has been extensively studied and applied across various domains. This is evident in the significant focus on models such as Petri nets, Markov chains, state controllers, etc.

### Planning with LLMs

Initial planning abilities of LLMs were discussed in the following papers: [Learn more about GPT3-to-plan: Extracting plans from text using GPT-3](https://arxiv.org/pdf/2106.07131), [Explore how Large Language Models are Zero-Shot Reasoners,](https://arxiv.org/pdf/2205.11916) [Discover Language Models as Zero-Shot Planners: Extracting Actionable Knowledge for Embodied Agents](https://arxiv.org/pdf/2201.07207). They were followed up by numerous techniques that aim improving quality of reasoning and planning: [Internal Monologue](https://arxiv.org/pdf/2207.05608), [Chain of Thought,](https://arxiv.org/pdf/2201.11903) [ReAct and](https://arxiv.org/pdf/2210.03629) [Reflexion](https://arxiv.org/pdf/2303.11366) are only some of them. In the diagram below we can see how these methods pushed boundaries up on coding chellange [1].

<div style="display: flex; justify-content: center; align-items: center; padding-top: 20px; padding-bottom: 20px;">
    <img src="{{ site.baseurl }}/images/Reliable_planning/coding_banchmark_human_eval.png" style="max-width: 80%; height: auto;"/>
</div>

While these techniques demonstrate improvements in final scores on specific datasets, real-life applications for planning and agentic workflows are still in their early stages of development and continue to evolve.

From our experience, current planning systems face following issues:

1. Decomposition into vague functions or sub-tasks that are not feasible. The lack of plan verifier makes it impossible to judge correctness of the plan. What might seem correct from the first look, could be not feasible in reality.

2. Chain of Thought (CoT) fails in complex planning because excessively long prompts cause the LLM to hallucinate and produce made-up answers.

3. Tree of Thought prompting works to an extent but is really expensive and not feasible for enterprise-grade applications.

After developing several agentic applications, what has worked for us is a planner with a feedback loop and human verification. Instead of using Reasoning and Execute, we have created a system where we follow the approach of Reason + Evaluate + Execute. There are many systems that have this design pattern: [Reasoning without Observation**,**](https://arxiv.org/pdf/2305.18323) [Plan-and-Solve Prompting,](https://arxiv.org/pdf/2305.04091) [Language Agent Tree Search,](https://arxiv.org/pdf/2312.04511) [LLMCompilor](https://arxiv.org/abs/2312.04511) are some of them.

Additionally, there is a significant gap in use cases that were not part of the datasets on which LLMs were trained. Real human work data is often scarce, not captured at all, or aggregated in a way that does not allow for inferring plans. This is because employees and knowledge workers rely on "corporate memory" and use their "know-how" in the decision-making process.

Therefore, for us at **Interloom**, the core pillar is building a knowledge base by capturing human knowledge into structured processes. This approach enables case-based planning and powers any agentic workflows by using existing processes as precedents. Collecting valid plans is an essential step to improve plan generation. Case-based planning involves compiling a database of valid plans. For every new problem, we first search for the top N most relevant plans from this database to present to the LLM. This enables few-shot prompting and results in better decision-making because the LLM relies less on its own knowledge and more on processes specific to your business.

### Researches confirms that LLMs struggle in Autonomous Planning

Recent research suggests that LLMs often struggle with reasoning tasks that are relatively simple for most humans, highlighting the limitations of these models in this critical area: [Large Language Models Cannot Self-Correct Reasoning Yet](https://arxiv.org/pdf/2310.01798), [Can Graph Learning Improve Task Planning?](https://arxiv.org/pdf/2405.19119v1), [Chain of Thoughtlessness? An Analysis of CoT in Planning](https://arxiv.org/pdf/2405.04776). This year at ICML we have seen many papers dedicated to LLMs in context learning, planning and cognition.

**Relevant papers:**

- [Understanding the Role of Large Language Models in Planning](https://icml.cc/virtual/2024/tutorial/35226)
- [Large Language Models and Cognition](https://llm-cognition.github.io/)
- [DS-Agent: Automated Data Science by Empowering Large Language Models with Case-Based Reasoning](https://arxiv.org/pdf/2402.17453)
- [A Case-based Reasoning Approach to Dynamic Few-Shot Prompting for Code Generation](https://openreview.net/pdf/f2d10bfca1b7d9f6f0a87144fee8e775cba6701a.pdf)
- [A Human-Like Reasoning Framework for Multi-Phases Planning Task with
Large Language Models](https://openreview.net/pdf/74a6780c81ebfb089aa0364a7769edd05e943f24.pdf)
- [AutoGuide: Automated Generation and Selection of Context-Aware Guidelines for Large Language Model Agents](https://arxiv.org/pdf/2403.08978)

One which stood out from the crowd was [LLMs Can't Plan, But Can Help Planning in LLM-Modulo Frameworks](https://arxiv.org/pdf/2402.01817) and [LLM's still can't plan; Can LRM's? A Preliminary Evaluation of OpenAI's o1 PlanBench](https://arxiv.org/pdf/2409.13373).

**What is meant by struggle in autonomous planning?** Let's look into the Blocksworld problem. This is the problem that requires to write a plan on in order to move blocks from an initial state into goal state (you might have played this game in childhood). It is is relatively simple task for every human being, however makes any LLM struggle significantly and raises the question whether they are capable of reasoning. As you can see the best results are around 60% while for human being it is above 90%. More about this could be found [here](https://www.youtube.com/watch?v=hGXhFa3gzBs).

<div style="display: flex; justify-content: center; align-items: center; padding-top: 20px; padding-bottom: 20px;">
    <img src="{{ site.baseurl }}/images/Reliable_planning/metrics_1.png" style="max-width: 100%; height: auto;"/>
</div>

<div style="display: flex; justify-content: center; align-items: center; padding-top: 20px; padding-bottom: 20px;">
    <img src="{{ site.baseurl }}/images/Reliable_planning/metrics_2.png" style="max-width: 100%; height: auto;"/>
</div>

While o1 does outperform all previous models in planning, it degrades rapidly as the plan lengths increase. Even on the regular Blocksworld, o1's accuracy is below 25% for a set of instances requiring longer plans [3].

<div style="display: flex; justify-content: center; align-items: center; padding-top: 20px; padding-bottom: 20px;">
    <img src="{{ site.baseurl }}/images/Reliable_planning/metrics_3.png" style="max-width: 100%; height: auto;"/>
</div>

LLMs are capable of planning/reasoning by themselves, it is certainly not meant to imply that LLMs don't have any constructive roles to play in solving planning/reasoning tasks. They have an ability to generate ideas/potential candidate solutions with no guarantees about those guesses. They can be valuable in the generate-test-critique setups in conjunction with either model-based verifiers or expert humans in the loop.

How can we create such an environment that where we could validate the generated plan and then give a feedback to the model if generated plan was incorrect? This all brought us back to origins of planning task as itself where we are trying to understand how can we verify correctness of constructed plan programatically.

## Planning core concepts

While planning is very natural for human being and we are doing this almost automatically everyday, it is hard to transfer our natural ability to machines. For example, when cooking the dinner and **making pasta** we execute a plan step-by-step and succeed most of the time. Below you can see a typical receipt that exist in any cooking book. Let's break it down into concepts that more natural to a machine.

<div style="display: flex; justify-content: center; align-items: center; padding-top: 20px; padding-bottom: 20px;">
    <img src="{{ site.baseurl }}/images/Reliable_planning/interloom_plan.png" style="max-width: 100%; height: auto;"/>
</div>

- The agent in this scenario could be a robotic chef or an automated cooking system that follows a predefined set of actions to make tomato pasta. This agent interacts with the kitchen environment and ingredients to achieve the desired goal of making a specific type of pasta dish.
- The initial state describes the current status of all relevant elements in the world. For instance: the kitchen has spaghetti, cherry tomatoes, olive oil, basil vodka, wasabi peas, blue cheese, and edible flowers. The spaghetti is uncooked (spaghetti-amount = 0.4), cherry tomatoes are raw. A state after the first action could be: the spaghetti has been boiled, but the tomatoes are still raw.
- *Actions are the steps the agent can take to change the state. In the "pasta-making" domain, these actions include:*
    - **boil_spaghetti**: Boils the spaghetti, transitioning it from raw to boiled.
    - **saute_tomatoes**: Sautees the cherry tomatoes in olive oil.
    - **toss_spaghetti**: Mixes the boiled spaghetti with the sautéed tomatoes.
    - **plate_spaghetti**: Plates the spaghetti.
    - **sprinkle_wasabi_peas**: Adds wasabi peas on top of the plated spaghetti.
    - **garnish_with_flowers**: Garnishes the dish with edible flowers.
- The goal condition in this scenario defines what the finished product should look like. The goal condition requires that: the spaghetti is boiled, the cherry tomatoes are sautéed, the basil vodka has been added, the spaghetti is tossed, plated, sprinkled with wasabi peas and blue cheese, and garnished with edible flowers.
- Reasoning is the process the agent uses to determine which actions to take and in what order. For example, the agent recognizes that before it can sprinkle blue cheese, it first needs to boil the spaghetti, sauté the tomatoes, toss the spaghetti with the tomatoes, plate it, and sprinkle wasabi peas. The agent might reason that boiling spaghetti should occur before sautéing the tomatoes due to the different durations of these actions.
- A **plan** is the sequence of actions the agent will execute to reach the goal condition. For the "make-tomato-pasta" problem, a valid plan might be:

    1.	**boil_spaghetti** (duration: 5 minutes).

    2.	**saute_tomatoes** (duration: 10 minutes).

    3.	**add_basil_vodka** (immediately after tomatoes are sautéed).

    4.	**toss_spaghetti** (after spaghetti is boiled and tomatoes are sautéed).

    5.	**plate_spaghetti** (after spaghetti is tossed).

    6.	**sprinkle_wasabi_peas** (after spaghetti is plated).

    7.	**sprinkle_blue_cheese** (after wasabi peas are sprinkled).

    8.	**garnish_with_flowers** (final action).


Now that we have the same language to talk about the planning problem we can move to the more practical part on what language can we use to express a plan and which software can we run to solve a planning problem deterministically.

## Planning Domain Definition Language

> Foundations could be found [here](https://www.cs.toronto.edu/~sheila/2542/s14/A1/introtopddl2.pdf)
>

In the previous section we broke down the problem of making pasta into logical steps and derived a valid plan on how to execute it. The question now is how to make a machine do the same automatically? One of possible answers is to use **Planning Domain Definition Language** or **PDDL** in short**.**

<div style="display: flex; justify-content: center; align-items: center; padding-top: 20px; padding-bottom: 20px;">
    <img src="{{ site.baseurl }}/images/Reliable_planning/pddl_example.png" style="max-width: 100%; height: auto;"/>
</div>

PDDL is a language in which we can express concepts such as entities, states, actions, operators, constrains and run an optimization algorithms to come up with a valid plan. Planning tasks specified in PDDL are separated into two files: a) A **domain file** for predicates and actions and b) A **problem file** for objects, initial state and goal specification. Let's use the example from above and convert the cooking receipt from Natural Language into PDDL. We can use LLM to help us doing that.

**Domain** **Definition**

<div style="display: flex; justify-content: center; align-items: center; padding-top: 20px; padding-bottom: 20px;">
    <img src="{{ site.baseurl }}/images/Reliable_planning/domain_definition.png" style="max-width: 100%; height: auto;"/>
</div>

**Problem Definition**

<div style="display: flex; justify-content: center; align-items: center; padding-top: 20px; padding-bottom: 20px;">
    <img src="{{ site.baseurl }}/images/Reliable_planning/problem_definition.png" style="max-width: 100%; height: auto;"/>
</div>

As you can see the result is readable and understandable, but expressed in much more structured way. Now that we have domain and problem defined we can use solver algorithms to come up with the plan. There are traditional algorithms that have evolved over years: STRIPS, SATPlan, GraphPlan, Blackbox (SAT + Plan Graph), Model Checking and many more. The resulting plan could look like this for the problem of making spaghetti:

<div style="display: flex; justify-content: center; align-items: center; padding-top: 20px; padding-bottom: 20px;">
    <img src="{{ site.baseurl }}/images/Reliable_planning/plan_result.png" style="max-width: 100%; height: auto;"/>
</div>

Once we have used an appropriate algorithm and received a plan as output, we would like to validate this plan on correctness and whether it meets all constraints. There are many architectures on how validation could participate in the process, few are shown below [4]:

<div style="display: flex; justify-content: center; align-items: center; padding-top: 20px; padding-bottom: 20px;">
    <img src="{{ site.baseurl }}/images/Reliable_planning/modulo_framework.png" style="max-width: 100%; height: auto;"/>
</div>

In order to validate the plan it is possible to use [VAL](https://strathprints.strath.ac.uk/2550/6/strathprints002550.pdf) which is the plan validation tool for PDDL. It serves multiple processes:

- **Plan Validation**: VAL takes a PDDL domain and problem file, along with a plan file, and checks whether the plan leads to the goal state as specified in the problem file.
- **Error Detection**: The tool can identify errors in plans, such as actions that cannot be applied due to unmet preconditions, or actions that lead to states violating the constraints of the problem.
- **Metric Evaluation**: For domains that involve numeric fluents or other metrics, VAL can evaluate whether the plan optimizes the relevant objective (e.g., minimizing cost).

After this step we get fully valid plan which is ready to be executed!

## How to make LLMs plans reliable?

<div style="display: flex; justify-content: center; align-items: center;">
    <img src="{{ site.baseurl }}/images/Reliable_planning/modulo_improvements.png" style="max-width: 80%;"/>
</div>

Now that we have learned about LLMs and traditional planning methods, let's find out how can we make the most out of two worlds: deterministic as traditional methods and not deterministic like LLMs.

The use of LLMs in planning and reasoning tasks can be highly beneficial, particularly when leveraged to extract planning knowledge. LLMs can serve as a valuable source of approximate models of world or domain dynamics and user preferences. However, these models require verification and refinement by humans and specialized critics before being handed over to model-based solvers. This is exactly what we discussed in the section above and recent research backs up it: [Robust Planning with LLM-Modulo Framework: Case Study in Travel Planning and LLMs Can't Plan, But Can Help Planning in LLM-Modulo Frameworks.](https://arxiv.org/pdf/2402.01817)

In the proposed architecture above, the LLM generates candidate plans, while a bank of verifiers evaluates these candidates, offering suggestions for modifications and feedback. This setup is intentional, as it allows the LLM to generate candidate solutions that satisfy the critics' requirements, bypassing the expressiveness and search complexity challenges often faced by traditional planning architectures. That means we do not need traditional algorithms such as STRIPS, SATPlan, GraphPlan, Blackbox, etc., we can rely on LLM to suggest multiple plans and critics to validate them. This approach is more reflective of real-world planning scenarios, where LLMs not only generate plan candidates but also propose domain models, problem reduction strategies, and refinements to problem specifications. Additionally, LLMs excel at handling format and syntax changes [2].

Collecting valid plans is an essential step in improving future plan generation. This refined data can be used to fine-tune large language models, leading to better planning outcomes. Alternatively, case-based planning can be employed by building a database of valid plans. For each new problem, we search for the top N most relevant plans from the database to present to the LLM. This enables few-shot prompting and results in better decision-making because the LLM relies less on its general knowledge and more on processes specific to your business.

Verifiers evaluate the **LLM-generated plan** based on both hard and soft constraints. Hard constraints include correctness checks, such as causal correctness, timeline accuracy, and resource constraints using **VAL**. Soft constraints, on the other hand, pertain to abstract notions of quality, such as style, explicability, and preference alignment, which may require the use of other LLMs. The critiques from these various critics are consolidated by the **Meta Controller**, which then provides a **refined prompt to the LLM** for the next iteration. Human involvement in this process is minimal but crucial. Humans review the critiques from both hard and soft verifiers, confirming or correcting them if needed.

## Performance

In the case of Blockworld problem, the results in the table below show that with back prompting from VAL acting as the external verifier and critic, LLM performance in Blocks World improves to 82% within 15 back prompting rounds, while in Logistics, it improves to 70% [5].

<div style="display: flex; justify-content: center; align-items: center;">
    <img src="{{ site.baseurl }}/images/Reliable_planning/modulo_improvements.png" style="max-width: 80%;"/>
</div>

We plan to use this architecture in the real case scenario to validate and benchmark performance there. From first outcomes we can say that critics in the loop improves the performance, also LLMs can successfully implement functions corresponding to hard critics and several common-sense critics and finally LLMs reliably play the role of reformatter as well converting free form plans into structured plans.

## What is the Interloom take?

At Interloom, we are developing a comprehensive solution to optimize and guide the internal processes of every business. Our system leverages each company's unique workflows to enhance efficiency and effectiveness. Just as reliable plans are essential for success, we provide the tools necessary to power businesses effectively.

Our approach includes:

- **Case-Based Planning**: We retrieve relevant precedents/processes/cases, or plan that closely match the current problem and enhance them using our LLM-powered system. This involves modifications based on domain-specific rules as well as adjustments by domain-independent planners.
- **Agentic Workflow Planning**: We use agents that break down new problems into smaller tasks, validate them, reflect on progress, re-plan as necessary, and autonomously execute actions.

This innovative capability unlocks new potentials within organizations and automates many repetitive processes. We will introduce the concepts of workflow navigation and case planning in upcoming blog posts.

## Conclusion

To summarize, our aim is to find the best framework for the planning problem. We combine the determinism of traditional methods and with novel reasoning capabilities of LLMs which results into powerful system, capable to solve complex problems. The LLM plays important part within this architecture which involves multiple roles. First, it generates candidate plans in response to problem specifications and iterative feedback from the critics. Second, it converts these candidate plans into specialized representations required by various critics, leveraging its strength in format conversion. Third, the LLM assists end users in refining incomplete problem specifications. This gives a clear path for generating reliable plans with LLMs.

## Resources

[1] [What's next for AI agentic workflows ft. Andrew Ng of AI Fund](https://www.youtube.com/watch?v=sal78ACtGTc)

[2] [LLMs Can't Plan, But Can Help Planning in LLM-Modulo Frameworks](https://arxiv.org/pdf/2402.01817)

[3] [LLM's still can't plan; Can LRM's? A Preliminary Evaluation of OpenAI's o1 PlanBench](https://arxiv.org/pdf/2409.13373)

[4] [On the Planning Abilities of Large Language Models (A Critical Investigation with a Proposed Benchmark)](https://arxiv.org/pdf/2302.06706)

[5] [On the Planning Abilities of Large Language Models : A Critical Investigation](https://openreview.net/pdf?id=X6dEqXIsEW)