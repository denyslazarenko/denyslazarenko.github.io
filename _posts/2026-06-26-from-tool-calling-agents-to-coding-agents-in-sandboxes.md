---
title: From Tool-Calling Agents to Coding Agents in Sandboxes
layout: post
use_toc: true
use_code: true
use_mermaid: true
excerpt: Why we evolved from predefined tool-calling agents to coding agents in sandboxes, and why both paradigms still matter in production.
description: Why we evolved from predefined tool-calling agents to coding agents in sandboxes, and why both paradigms still matter in production.
---

## Introduction

```text
Interloom CLI

Usage:
  interloom [flags]
  interloom [command]

Available Commands:
  agents      Retrieve a list of agents.
  auth        Authentication helpers
  completion  Generate the autocompletion script for the specified shell
  documents   All files and notes that have been uploaded to the Space.
  files       Retrieve file metadata by file ids.
  help        Help about any command
  info        Show current instance and auth info
  notes       Retrieve a list of notes.
  procedures  Retrieve procedures for a space or by IDs.
  set         Set configuration values
  spaces      Retrieve all spaces.
  tasks       Retrieve a list of tasks.
  threads     Retrieve threads associated with tasks.

Flags:
  -h, --help              help for interloom
      --instance string   Instance host (e.g. dev.interloom.com)
      --json              Output JSON
      --timeout int       Timeout in seconds
      --token string      Access token
```

For a while, the default way to build an AI agent was simple: define a set of tools, describe them with schemas, and let the model decide which one to call.

We started there too. It was explicit, easy to reason about, and matched how APIs, permissions, and workflows are usually designed.

That approach worked well until tasks stopped being neat.

Once users asked for work that was ambiguous, multi-step, or exploratory, tool-calling started to feel like the wrong abstraction. The model was spending too much effort navigating the tool menu and too little effort reasoning about the actual problem.

So we moved part of the system in a different direction: coding agents running inside sandboxes, with a CLI, files, logs, and enough runtime to investigate and act.

That improved outcomes for a whole class of problems. It also made one thing clear:

- This is not a replacement story.
- Coding agents are better for some task shapes.
- Field agents with predefined tools are better for others.

The useful question is not which paradigm is more advanced. The useful question is what kind of work the user is asking for.

<div style="display: flex; justify-content: center; padding-top: 20px; padding-bottom: 20px;">
    <img src="{{ site.baseurl }}/images/Coding_agents/tool-calling-to-coding-agents.png" alt="Comparison between tool-calling field agents and sandboxed coding agents" style="width: 100%;"/>
</div>

## Where tool-calling agents started to break

Predefined tools are still a very good fit for bounded operations.

If the user wants to create a task, assign an owner, apply a tag, send a draft reply, or trigger a known workflow, a tool is a clean contract:

- The action is visible.
- The inputs are structured.
- Success is easy to validate.

That is why tool-based field agents work so well for routine business operations:

- A support agent that can classify a ticket, create a follow-up task, and draft a response.
- A sales ops agent that can update a CRM field, add tags, and create a reminder.
- A finance agent that can fetch an invoice, mark it reviewed, and notify the account owner.

The trouble starts when the work is not one action but a chain of decisions.

```python
# Tool-based agent
create_task("Task 1")
create_note("Task 1 note")
create_task("Task 2")
create_note("Task 2 note")

# Coding agent in sandbox
for i in range(1, 51):
    create_task(f"Task {i}")
    create_note(f"Task {i} note")
```

Take a simple example: a user asks an agent to create 50 tasks and 50 matching notes.

In a pure tool-calling setup, the agent has to keep repeating the same discrete operations. In a sandbox, the agent can write a loop and execute the same pattern with much less friction.

That difference gets more important when the task is less repetitive and more ambiguous.

Consider a finance operations request like this:

> Compare this month's unpaid invoice export with payment-provider data, check whether support already promised an extension, and prepare a list of accounts that need follow-up.

There usually is no single perfect tool for that. The agent may need to inspect CSV files, query different systems, compare mismatched identifiers, derive intermediate results, and adjust its approach once it sees the real data.

You can try to model all of that as tools, but the system gets noisy quickly:

- Either you expose dozens of narrow tools.
- Or you create a few oversized tools that are hard to validate and hard for the model to use correctly.

We kept seeing the same pattern: the more exploratory the task, the worse the fit between the problem and the tool catalog.

## Why coding agents changed the game

The main change with coding agents was not that they became smarter. It was that we stopped handing the model a long tool menu and gave it a workspace instead.

Inside a sandbox, the agent can inspect files, run read-only commands, call a CLI, write a short script, recover from errors, and build intermediate structure around the task.

That makes a big difference for work where the path is not known upfront.

Three capabilities matter most:

1. **Explore before committing.** The agent does not have to pretend the plan is obvious from the first token. It can look around, gather evidence, and decide what to do next.
2. **Compose steps naturally.** Many real requests are not one business action. They are ten small actions with judgment in between. A coding agent can transform data, branch based on results, retry with a different approach, and keep going.
3. **Recover better.** When a rigid tool call fails, the interaction often stops at the error boundary. A coding agent can inspect the failure, fix the input, add a missing transformation, or choose another route.

This is why coding agents perform better for tasks that sound like:

- "Figure out why these customer imports keep failing and fix the broken rows."
- "Compare the contracts in this folder against the CRM and highlight exceptions."
- "Review the last 200 support notes, group the recurring issues, and draft an escalation summary."

Those are not just actions. They are investigations.

For example, a user asks:

> Create a reusable onboarding procedure with 3 stages. For each stage, create an agent with the appropriate instructions and assign that agent to the corresponding stage. Then show how a different operator can apply the approved procedure to a task, but cannot modify the reusable template.

```text
user asks
  -> interloom --help
  -> interloom procedures --help
  -> interloom procedures stages --help
  -> create procedure
  -> create stages
  -> create agents
  -> assign agents to stages
  -> apply approved procedure to task
  -> execution allowed, template editing denied
```

```bash
$ interloom --help
Interloom CLI

Usage:
  interloom [flags]
  interloom [command]

Available Commands:
  agents      Retrieve a list of agents.
  auth        Authentication helpers
  completion  Generate the autocompletion script for the specified shell
  documents   All files and notes that have been uploaded to the Space.
  files       Retrieve file metadata by file ids.
  help        Help about any command
  info        Show current instance and auth info
  notes       Retrieve a list of notes.
  procedures  Retrieve procedures for a space or by IDs.
  set         Set configuration values
  spaces      Retrieve all spaces.
  tasks       Retrieve a list of tasks.
  threads     Retrieve threads associated with tasks.

# The agent identifies that reusable workflow authoring lives under "procedures".

$ interloom procedures --help
Manage reusable procedures.

Usage:
  interloom procedures [command]

Available Commands:
  create      Create a reusable procedure
  list        Retrieve procedures for a space
  view        View procedure details
  update      Update a reusable procedure
  stages      Manage stages for a procedure

# The agent drills into stage management before acting.

$ interloom procedures stages --help
Manage stages for a reusable procedure.

Usage:
  interloom procedures stages [command]

Available Commands:
  create      Create a stage in a procedure
  list        List stages for a procedure
  update      Update a stage
  view        View a stage

# The workflow architect now has enough structure to author the template.

$ interloom procedures create \
  --title "Customer Onboarding" \
  --description "Reusable onboarding workflow for activating new customer teams."
Procedure created
  id: prc_01demo_proc_001
  title: Customer Onboarding

$ interloom procedures stages create \
  --procedure prc_01demo_proc_001 \
  --title "Access Provisioning" \
  --position 1
Stage created
  id: stg_01demo_stage_001
  title: Access Provisioning
```

## Why we still keep field agents with predefined tools

Once coding agents started succeeding on ambiguous work, the next lesson was just as important: users still need bounded agents.

When the user knows exactly what they want done, a field agent with predefined tools is usually the better product. It is more predictable, easier to audit, and easier to trust.

The user can see the action surface and understand what the agent is allowed to do.

That matters in day-to-day operations. If someone wants an agent to update a CRM record, append a case note, apply an approved workflow, or draft a customer reply, they usually do not want general problem-solving behavior. They want the right bounded capability with clear success criteria.

It also matters for governance. Tools are not only capabilities. They are responsibility boundaries.

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

That distinction is one of the strongest arguments for field agents. You can attach a tool to a very specific role and omit it everywhere else.

The result is not just better security. It is a cleaner product contract.

A claims operation is a good example.

One agent may be allowed to:

- add notes to a claim
- request missing documents
- apply an approved review procedure

Another agent, used by an operations lead, may be allowed to:

- create or edit the reusable procedure itself
- change escalation rules
- update who is allowed to approve exceptions

Both are useful. They should not be the same agent.

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

## The product boundary became clearer over time

The most interesting pattern came later.

Once coding agents solved more difficult tasks, we noticed that the valuable output was often not only the answer. It was the working code path the agent discovered.

That changes the problem.

If a coding agent figures out how to reconcile a messy finance export, normalize the data, and produce a clean result, we do not necessarily want to pay for that exploration every time.

Once the path is known, we can capture it, parameterize it, and turn it into something reusable.

That reusable unit may become:

- a proper tool
- a code-execution block inside a workflow
- part of a procedure another agent can run safely with structured inputs

This is the bridge between the paradigms:

1. A coding agent explores an ambiguous task.
2. It lands on a working script or execution pattern.
3. The platform turns that pattern into a bounded capability.
4. A field agent can now reuse it without rediscovering it from scratch.

In that sense, coding agents are not only workers. They are also a way to discover future product capabilities.

## What architecture made this possible

Supporting both paradigms cleanly required more than adding a sandbox next to a tool system. We needed one shared layer underneath them.

The key architectural decision was simple: UI, GraphQL, predefined tools, CLI commands, and external APIs should all reach the same business logic.

Otherwise the system drifts:

- Features appear in one interface and lag in another.
- Validation rules diverge.
- Permission checks become inconsistent.

That shared execution layer gave us three practical benefits:

1. **Shared semantics.** Field agents and coding agents operate on the same product semantics. A human can trigger an action in the UI, a field agent can call it as a tool, and a coding agent can reach it through the CLI. Each surface does not need to invent its own version of the rule.
2. **Controlled runtime.** The sandbox becomes a controlled runtime rather than a side channel. The coding agent can investigate and act, but it does so through a constrained environment with explicit permissions, visibility, and approval boundaries.
3. **Durable execution.** Coding-agent sessions are inherently multi-step. They pause, retry, recover, and sometimes wait for user input. That only works well in production if the runtime can persist state and resume cleanly.

That architecture matters because it lets us use the same platform capabilities in different ways without creating two separate products under the hood.

<pre class="mermaid">
flowchart TD
    User[People via UI/UX]
    Assistant[Assistant / AX Layer]
    ThirdParty[Third-Party Integrations]
    User --> GraphQL[GraphQL API]
    Assistant --> Tools[Predefined Tools]
    Assistant --> CLI[CLI]
    ThirdParty --> External[External API]
    GraphQL --> Internal[internal_api_layer]
    Tools --> Internal
    CLI --> Internal
    External --> Internal
    Internal --> Domain[Shared Business Logic]
    Domain --> Data[(Platform Data / Services)]
</pre>

<pre class="mermaid">
flowchart TD
    Chat[User / Assistant]
    Temporal[Temporal Workflow]
    Sandbox[E2B Sandbox]
    AppServer[Codex App Server]
    Model[Codex / OpenCode]
    CLI[CLI]
    Internal[internal_api_layer]
    Data[(Platform Data / Services)]
    Chat --> Temporal
    Temporal --> Sandbox
    Sandbox --> AppServer
    AppServer --> Model
    Model --> AppServer
    AppServer --> CLI
    CLI --> Internal
    Internal --> Data
    AppServer --> Temporal
    Temporal --> Chat
</pre>

## Conclusion

Our path from tool-calling agents to coding agents in sandboxes was a specialization story.

Tool-based field agents remain the right answer for bounded, governed, repeatable work. They are easier to debug, easier to trust, and easier to align with business roles.

Sandboxed coding agents are the better answer for ambiguous work. They can inspect, compose, recover, and discover the path to an outcome when the user cannot specify every step in advance.

The most useful systems need both.

- One mode handles execution with clear boundaries.
- The other handles exploration in a controlled environment.

And when exploration succeeds often enough, the result can be turned back into a bounded, reusable capability.

That is the real evolution we saw: not tools versus coding agents, but a platform that can choose the right operating mode for the shape of the work.

## Resources

[1] [Agentic Task Delegation]({{ site.baseurl }}/2025/05/14/agentic_task_delegation.html)

[2] [Collective Long-Term Memory of AI Agents]({{ site.baseurl }}/2024/05/29/collective_memory.html)
