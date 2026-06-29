---
title: "Harness Engineering: Matching Agents to the Work"
layout: post
use_toc: true
use_code: true
use_mermaid: true
excerpt: Tool calls and sandboxed CLI work are different agent harnesses. The production question is how much freedom, structure, and accountability the task needs.
description: Tool calls and sandboxed CLI work are different agent harnesses. The production question is how much freedom, structure, and accountability the task needs.
---

## Introduction

Most agent architecture debates start in the wrong place.

They ask whether tool-calling agents are better than coding agents, or whether a CLI is a better interface for AI than structured tool calls.

That framing is too narrow.

In production, the useful question is not which interface is more advanced. The useful question is:

> Which harness gives the model the right amount of freedom, structure, and accountability for the work at hand?

This is what I mean by **Harness Engineering**.

An agent harness is the execution environment around the model: the tools it can access, the runtime it operates in, the files and state it can inspect, the permissions it must respect, the way work is observed, and the way results are validated.

Different work needs different harnesses.

- A bounded operational task needs a constrained tool harness.
- An ambiguous investigation needs an exploratory sandbox harness.
- A reusable workflow needs a way to move discoveries from the exploratory harness back into a governed execution harness.

The mistake is trying to force all agent work through one interface.

We kept seeing the same pattern: **the more exploratory the task, the worse the fit between the problem and the tool catalog**. Tool catalogs scale poorly when the set of possible user problems keeps expanding. At the same time, pure sandbox freedom is the wrong fit for high-volume, permission-sensitive operations.

This article is not a step-by-step implementation guide and not original research. It is a production design principle: match the agent harness to the shape of work.

## Two work streams: Field Agent and Assistant

The distinction became clearer once we separated two work streams that often get mixed together.

| Work stream | Best description | Best harness |
| --- | --- | --- |
| **Field Agent** | A role-specific agent that performs known actions inside a business process. | Predefined tools with tight permissions. |
| **Assistant** | A more exploratory agent that helps a user investigate, compose, debug, or create a workflow. | Sandboxed CLI, files, logs, and runtime state. |

A **Field Agent** is closer to an operational worker. It may classify support tickets, apply an approved procedure, draft a reply, update a CRM field, request missing documents, or create follow-up tasks. The work is bounded. The allowed actions should be visible. The outcome should be easy to audit.

An **Assistant** is closer to an exploratory operator. It may inspect files, compare data sources, discover which workflow commands exist, write a small script, recover from an error, and then decide the next step. The path is not known upfront.

This distinction matters because the two work streams optimize for different things.

| Dimension | Field Agent | Assistant |
| --- | --- | --- |
| Primary goal | Reliable execution | Exploration and composition |
| Interface | Tool calls | CLI, files, shell, logs |
| Permission model | Narrow and role-specific | Broader but sandboxed |
| Best for | Large-scale repeatable workflows | Ambiguous long-running tasks |
| Failure mode | Wrong tool call or bad input | Unbounded exploration |
| Validation | Structured result checks | Evidence, logs, intermediate artifacts |

The Field Agent should be constrained and predictable enough to run at scale. The Assistant should be flexible enough to figure out what needs to happen.

The two short demos below show that difference in practice.

The first demo shows a bounded tool harness. A Field Agent named `ClaimAnalysisAgent` has one narrow goal: extract problems from a claim, then append a new problem to a note only if that problem is not already present. The agent has a small tool surface: `append_to_note`, `read_file`, `create_note`, `use_skill`, and `view_task`. It then processes 100 cases and extracts recurring problems from them. This is a good fit for a Field Agent because the work is repetitive, permissioned, and constrained to a small set of known actions.

<div style="display: flex; justify-content: center; padding-top: 20px; padding-bottom: 20px;">
    <iframe src="https://www.loom.com/embed/d5afe251e47740a2ad250c3d000560d6" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen title="ClaimAnalysisAgent field agent harness demo"></iframe>
</div>

The second demo shows the sandbox harness on an analytics task. The Assistant inspects 100 synthetic IT department cases, builds an analytics summary by status, priority, department, location, and recurring issue theme, then identifies the biggest bottlenecks and produces a short operations report.

<div style="display: flex; justify-content: center; padding-top: 20px; padding-bottom: 20px;">
    <iframe src="https://www.loom.com/embed/692d6aeeee88443b8dab62c3f638890c" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen title="Sandboxed assistant analytics demo"></iframe>
</div>

The difference is not the number of cases. In the first demo, the Field Agent repeats a narrow approved action against each case. In the second, the Assistant has to discover the data shape, decide the grouping logic, write analysis code, and produce a new artifact.

## Why tool catalogs stop scaling

For a while, the default way to build an AI agent was simple: define a set of tools, describe them with schemas, and let the model decide which one to call.

That is still a good design for bounded operations.

If the user wants to create a task, assign an owner, apply a tag, send a draft reply, or trigger a known workflow, a tool is a clean contract:

- The action is visible.
- The inputs are structured.
- The permission boundary is explicit.
- Success is easy to validate.

The trouble starts when the work is not one action but a chain of decisions.

```python
# Tool-based field agent
create_task("Task 1")
create_note("Task 1 note")
create_task("Task 2")
create_note("Task 2 note")

# Assistant in a sandbox
for i in range(1, 51):
    create_task(f"Task {i}")
    create_note(f"Task {i} note")
```

Take a simple example: a user asks an agent to create 50 tasks and 50 matching notes from a generated pattern.

Repetition alone does not make a task exploratory. A Field Agent can still be the right harness if each action needs permission checks, auditability, or human review. But when the user wants to generate or transform many related operations from a pattern, a sandbox gives the model a cheaper way to express that pattern as code instead of repeated tool calls.

That difference gets more important when the task is less repetitive and more ambiguous.

Consider a finance operations request like this:

> Compare this month's unpaid invoice export with payment-provider data, check whether support already promised an extension, and prepare a list of accounts that need follow-up.

There usually is no single perfect tool for that. The agent may need to inspect CSV files, query different systems, compare mismatched identifiers, derive intermediate results, and adjust its approach once it sees the real data.

You can try to model all of that as tools, but the system gets noisy quickly:

- Either you expose dozens of narrow tools.
- Or you create a few oversized tools that are hard to validate and hard for the model to use correctly.

There is also a context cost.

Tool calls are often attached directly to the agent definition. As the tool catalog grows, the model has to carry more schemas, more descriptions, and more possible actions in context. That increases cost, slows down responses, and can reduce quality because the model spends more attention choosing from the menu than reasoning about the problem.

Dynamic tool selection can help, but it introduces a different tradeoff: every invocation now needs a routing or retrieval step, and prompt-cache reuse becomes harder because the effective tool surface changes between calls.

This is the core scaling problem:

> A large tool catalog is a good interface for software, but a poor working memory for an agent solving an open-ended problem.

## The tool harness fits bounded work

The tool harness is not obsolete. It is the right harness when the work is bounded, repeatable, and permission-sensitive.

That is why Field Agents still matter.

A support Field Agent might be allowed to:

- classify a ticket
- create a follow-up task
- draft a customer response
- apply an approved escalation procedure

A sales operations Field Agent might be allowed to:

- update a CRM field
- add tags
- create a reminder
- notify the account owner

These agents should not have general problem-solving freedom. They should have a carefully designed action surface.

That matters for governance. Tools are not only capabilities. They are responsibility boundaries.

In a production system, these should not be the same permission:

- "This agent can apply an approved procedure to a live case."
- "This agent can redesign the procedure everyone else depends on."

A workflow architect may be allowed to define the template. A frontline operator may only be allowed to apply it.

```text
Workflow Responsibility Split

Workflow architect / manager
  -> procedure_management
     -> create / update / view reusable procedure definitions
        -> procedure template

Case manager / operator
  -> apply_procedure
     -> stage execution

Boundary:
  The execution persona can apply the workflow without being allowed
  to redesign the workflow itself.
```

That distinction is one of the strongest arguments for Field Agents. You can attach tools to a very specific role and omit them everywhere else.

The result is not just better security. It is a cleaner product contract.

```text
Claims Case Agent

Profile                         Tools
                                --------------------------------
[ ] create_agent                Create a new agent
[ ] create_procedure            Create a reusable procedure
[ ] update_procedure            Edit a reusable procedure
[ ] update_escalation           Change escalation rules
[ ] update_approvers            Update who can approve exceptions
[x] create_note                 Add a note to a claim
[x] request_documents           Request missing claim documents
[x] apply_procedure             Apply an approved review procedure
[x] draft_customer_reply        Draft a customer reply

                                           [Revert] [Save Agent]
```

```text
Claims Operations Lead Agent

Profile                         Tools
                                --------------------------------
[ ] draft_customer_reply        Draft a customer reply
[ ] request_documents           Request missing claim documents
[ ] create_note                 Add a note to an individual claim
[x] create_procedure            Create a reusable procedure
[x] update_procedure            Edit a reusable procedure
[x] update_escalation           Change escalation rules
[x] update_approvers            Update who can approve exceptions
[x] view_audit_log              Review workflow and approval history

                                           [Revert] [Save Agent]
```

Both agents are useful. They should not be the same agent.

## The sandbox harness fits exploratory work

The main change with sandboxed Assistants is not that the model becomes smarter. It is that we stop handing the model a long tool menu and give it a workspace.

Inside a sandbox, the Assistant can inspect files, run commands within a scoped environment, call a CLI, write a short script, recover from errors, and build intermediate structure around the task.

That makes a big difference for work where the path is not known upfront.

Three capabilities matter most:

1. **Explore before committing.** The Assistant does not have to pretend the plan is obvious from the first token. It can look around, gather evidence, and decide what to do next.
2. **Compose steps naturally.** Many real requests are not one business action. They are ten small actions with judgment in between. A sandboxed Assistant can transform data, branch based on results, retry with a different approach, and keep going.
3. **Recover better.** When a rigid tool call fails, the interaction often stops at the error boundary. A sandboxed Assistant can inspect the failure, fix the input, add a missing transformation, or choose another route.

This is why the sandbox harness is a better fit for tasks that sound like:

- "Figure out why these customer imports keep failing and fix the broken rows."
- "Compare the contracts in this folder against the CRM and highlight exceptions."
- "Review the last 200 support notes, group the recurring issues, and draft an escalation summary."

Those are not just actions. They are investigations.

The CLI matters because it externalizes part of the capability surface.

Instead of attaching every possible tool schema to the agent context, the Assistant can discover the interface when it needs it:

```text
npx -y @interloom/cli@latest --help
npx -y @interloom/cli@latest cases --help
npx -y @interloom/cli@latest cases list --help
```

The Assistant does not need to remember every command forever. It can inspect help text, save intermediate artifacts, write small scripts, retry commands, and use files or logs as working memory.

In long-running workflows, this can reduce token usage dramatically. In some long-running internal tasks, we have seen CLI/sandbox runs use materially fewer tokens, in some cases around 90% less, because exploratory state moves out of the prompt and into files, command output, and intermediate artifacts. The exact savings depend on task shape, schema size, and how much state needs to be preserved.

That does not make the CLI universally better. It makes the CLI a better harness for work that needs exploration.

## Example: turning IT cases into an analytics workflow

Imagine a user asks:

> Analyze these 100 IT department cases. Build an analytics summary by status, priority, department, location, and recurring issue theme. Then identify the biggest bottlenecks and create a short operations report.

This is not a single business action. It is a small analytical workflow.

The Assistant has to discover where cases live, inspect the available fields, decide how to classify themes, write analysis code, run it, check the output, and turn the result into an artifact a manager can read.

```text
user asks
  -> npx -y @interloom/cli@latest --help
  -> npx -y @interloom/cli@latest cases --help
  -> npx -y @interloom/cli@latest cases list --help
  -> read the current workspace config
  -> list the current IT Inbox cases
  -> fetch full case details because list output is not enough
  -> write a compact analysis script
  -> group by status, priority, department, location, and theme
  -> identify bottlenecks
  -> produce an operations report and JSON artifact
```

```bash
$ npx -y @interloom/cli@latest --help
Interloom CLI

Usage:
  interloom [flags]
  interloom [command]

Available Commands:
  agents      Retrieve a list of agents.
  auth        Authentication helpers
  cases       Retrieve and manage cases.
  completion  Generate completion scripts.
  config      Manage CLI configuration.
  files       Retrieve and manage files.
  notes       Retrieve a list of notes.
  procedures  Retrieve reusable procedures by workspace or ID.
  spaces      Retrieve workspaces.
  threads     Retrieve threads associated with tasks.
  users       Retrieve users.
  version     Show CLI version.

Global Flags:
  --base-url string
  -c, --config-name string
  -o, --output json
  -h, --help

# The Assistant identifies that inbox items are represented as cases.

$ npx -y @interloom/cli@latest cases --help
Retrieve and manage cases.

Usage:
  interloom cases [command]

Available Commands:
  list        Retrieve cases.
  get         Retrieve a case by ID.
  create      Create a case.
  update      Update a case.
  delete      Delete a case.

# The Assistant drills into the exact list command before acting.

$ npx -y @interloom/cli@latest cases list --help
Retrieve cases.

# The Assistant exports the raw cases and inspects the shape before deciding
# how to analyze them.

$ npx -y @interloom/cli@latest config current
Ruinart denys-org

$ npx -y @interloom/cli@latest cases list -o json > /private/tmp/interloom-case-list.json

$ jq '.[0]' /private/tmp/interloom-case-list.json
{
  "id": "case_...",
  "name": "IT-069: Badge reader not unlocking door",
  "status": "blocked"
}

# The list output is useful for discovering the case IDs, but the fields needed
# for analytics live in the full case detail. The Assistant writes a small
# script that calls the CLI for each case and keeps progress visible.

$ node analyze-it-inbox.js
fetched 25/100
fetched 50/100
fetched 75/100
fetched 100/100

$ jq '.sample_case' /private/tmp/interloom-it-inbox-analysis.json
{
  "id": "IT-069",
  "name": "Badge reader not unlocking door",
  "status": "blocked",
  "priority": "blocked",
  "department": "Executive Office",
  "location": "support floor",
  "description": "My office badge scans green but the door does not unlock..."
}

$ jq '.summary' /private/tmp/interloom-it-inbox-analysis.json
{
  "status": {
    "completed": 25,
    "blocked": 25,
    "started": 25,
    "open": 25
  },
  "priority": {
    "blocked": 25,
    "urgent": 25,
    "high": 25,
    "normal": 25
  },
  "analysis_file": "/private/tmp/interloom-it-inbox-analysis.json"
}
```

The important part is not the CLI syntax. The important part is the harness.

The Assistant can discover the available interface, notice that list output is incomplete, fetch full records, write code, run analysis, track progress, and produce durable artifacts.

In the video, the final report identifies that 50 of 100 cases are still active or blocked, with 25 blocked cases and a broad issue mix. No single issue dominates, so the bottleneck is likely triage and ownership capacity rather than one broken system. The recommended actions are to triage urgent blocked items first, assign owners by issue family, review blocked tickets in the most affected locations, and keep open cases as backlog or control data for workflow testing.

Trying to solve the same request only through a static tool catalog would require either many predefined analytics tools in context or a higher-level "analyze inbox" tool that hides too much behavior. The sandbox harness lets the Assistant build a temporary workflow around the data, then leave useful outputs behind.

The sandbox harness still needs boundaries. A workspace is not a license for unlimited action. Production sandboxes need command allowlists, network controls, scoped credentials, approval gates for side effects, artifact retention, and logs that make the Assistant's path reviewable. Otherwise the same flexibility that makes the sandbox useful for exploration can become difficult to audit or reproduce.

## From exploration back to bounded capabilities

The product boundary became clearer over time.

Once sandboxed Assistants solved more difficult tasks, the valuable output was often not only the final answer. It was the working path the Assistant discovered.

That changes the product loop.

If managers keep asking for the same IT inbox report, the sandbox run should not remain a one-off. The analysis script can become a governed workflow with typed inputs, fixed grouping logic, permission checks, test cases, and a reusable report artifact.

Once the path is known, we can capture it, parameterize it, and turn it into something reusable.

That reusable unit may become:

- a proper tool
- a code-execution block inside a workflow
- part of a procedure another agent can run safely with structured inputs

This is the bridge between the harnesses:

1. An Assistant explores an ambiguous task.
2. It lands on a working script or execution pattern.
3. The platform turns that pattern into a bounded capability.
4. A Field Agent can now run the report on demand without rediscovering the case schema every time.

In that sense, Assistants are not only workers. They are also a way to discover future product capabilities.

## One platform, multiple harnesses

Supporting multiple harnesses cleanly requires more than adding a sandbox next to a tool system. The harnesses need one shared layer underneath them.

The key architectural decision is simple: UI, APIs, predefined tools, CLI commands, and external integrations should all reach the same business logic.

Otherwise the system drifts:

- Features appear in one interface and lag in another.
- Validation rules diverge.
- Permission checks become inconsistent.

That shared execution layer gives three practical benefits:

1. **Shared semantics.** A human can trigger an action in the UI, a Field Agent can call it as a tool, and an Assistant can reach it through the CLI. Each surface does not need to invent its own version of the rule.
2. **Controlled runtime.** The sandbox becomes a controlled runtime rather than a side channel. The Assistant can investigate and act, but it does so through a constrained environment with explicit permissions, visibility, and approval boundaries.
3. **Durable execution.** Assistant sessions are inherently multi-step. They pause, retry, recover, and sometimes wait for user input. That only works well in production if the runtime can persist state and resume cleanly.

The first diagram shows the shared business layer. Different harnesses reach the same underlying semantics.

<pre class="mermaid">
flowchart TD
    User[People via UI]
    Assistant[Assistant Harness]
    FieldAgent[Field Agent Harness]
    Integration[External Integrations]
    User --> API[Application API]
    FieldAgent --> Tools[Predefined Tools]
    Assistant --> CLI[Platform CLI]
    Integration --> ExternalAPI[External API]
    API --> Internal[Internal API Layer]
    Tools --> Internal
    CLI --> Internal
    ExternalAPI --> Internal
    Internal --> Domain[Shared Business Logic]
    Domain --> Data[Platform Data and Services]
</pre>

The second diagram shows the sandbox harness. The model is not directly mutating production state. It works through a controlled runtime and reaches product capabilities through the same internal layer.

<pre class="mermaid">
flowchart TD
    Chat[User and Assistant]
    Workflow[Durable Workflow Runtime]
    Sandbox[Isolated Sandbox]
    AgentServer[Agent Runtime Server]
    Model[Model Runtime]
    CLI[Platform CLI]
    Internal[Internal API Layer]
    Data[Platform Data and Services]
    Chat --> Workflow
    Workflow --> Sandbox
    Sandbox --> AgentServer
    AgentServer --> Model
    Model --> AgentServer
    AgentServer --> CLI
    CLI --> Internal
    Internal --> Data
    AgentServer --> Workflow
    Workflow --> Chat
</pre>

This architecture lets the same platform capability be used in different ways without creating two separate products under the hood.

## Conclusion

Harness Engineering is about matching the agent's runtime to the work.

Tool-based Field Agents remain the right answer for bounded, governed, repeatable operations. They are easier to debug, easier to trust, and easier to align with business roles.

Sandboxed Assistants are the better answer for ambiguous work. They can inspect, compose, recover, and discover the path to an outcome when the user cannot specify every step in advance.

The most useful systems need both.

- One harness handles execution with clear boundaries.
- Another harness handles exploration in a controlled environment.
- A shared platform layer lets discoveries move from exploration back into governed execution.

That is the real evolution: not tools versus coding agents, but a platform that can choose the right harness for the shape of work.

## Resources

[1] [Agentic Task Delegation]({{ site.baseurl }}/2025/05/14/agentic_task_delegation.html)

[2] [Collective Long-Term Memory of AI Agents]({{ site.baseurl }}/2024/05/29/collective_memory.html)
