# Take-home: AI Session Analyzer

## Why this exercise exists

AI agents have changed how engineers work, and most interviews no longer show how a person really builds software. We are building a tool that analyzes developers' AI coding sessions. It is similar to [Paxel](https://paxel.ycombinator.com/) ([open-source version](https://github.com/staru09/open-paxel)) -which might have some useful hints-, but it goes into more detail instead of doing a [superficial analysis](https://paxel.ycombinator.com/results/jdwmiy0x). For example the following articles describes relevant rules one could use [when working with agents](https://deepakness.com/raw/pi-agent-lessons-from-dillon/).

Our long-term goal is to tell strong engineers from less skilled ones by how they work with agents. That is hard, and **it is not the goal of this exercise**. This exercise has a smaller goal: detect and describe **behavior patterns** in AI coding sessions.

## This exercise is open on purpose

There is no single correct solution. The problem has many more decisions than you can handle in one day, so you will have to choose. Part of the exercise is deciding which decisions matter for an MVP and which ones you can postpone or skip.

We are interested in how you:

- reduce an ambiguous problem to something you can finish,
- make decisions and explain them,
- keep the solution simple,
- move forward on your own, and
- communicate in writing.

A small tool that works from start to end and has clear reasons behind it is better than a large design that is not finished.

## The task

Build an MVP that reads AI coding sessions and reports which behavior patterns appear in them.

**The MVP must be able to analyze your own sessions**, including the sessions you use to build it.

Some patterns you could detect:

- **Planning:** Does the developer write a plan before implementation? How detailed is it?
- **Plan following:** Does the agent follow the plan, or does the work drift away from it?
- **Steering:** How often does the developer correct, interrupt, or redirect the agent?
- **Context pressure:** Do sessions run into compaction or context limits?
- **Parallelism:** Does the developer run several sessions or agents at the same time?
- **Verification:** Does the developer or the agent test and check the result?

You do not need all of these. **Choose at least 2**, or define your own, and explain why you chose them. You decide how each pattern is defined and detected.

## Input

Use the session logs of any coding agent you use. Some examples:

- Claude Code: `~/.claude/projects/**/*.jsonl`
- Codex: `~/.codex/sessions/`
- Any other agent that stores session transcripts

## Decisions you will face

These are some of the engineering decisions in this problem. **You do not have to answer all of them.** For each one, you can make a decision, or skip it and say in one line why it is not important for your MVP. A clear "I skipped this because…" is as valuable as a solution.

### Sources and providers

- Do you support one agent tool or several? If several, what is the smallest piece of code you must write for each new one?
- Do you read the transcript files the tool already writes, use its hooks or plugins, or capture the traffic to the model API? Each option changes what you can see and how easily it breaks when the tool updates.
- How do you know which tool and which model produced a session?

### Normalization

- Providers represent messages, tool calls, tool results, thinking, subagents, compaction, and resumed sessions in different ways. Do you need one common format? If so, what does it keep and what does it drop?
- Do you keep the raw data next to your normalized data, so you can parse it again when your format changes?
- How do you order events? Look out for parallel subagents and sessions that resume days later.

### Sessions, work, and code

- One session can produce many commits, and one commit can come from many sessions. Do you link sessions to git at all?
- Do you need a unit above the session, an **episode**: one piece of work that spans several sessions? If so, how do you decide that two sessions belong to the same episode (branch, time, files touched, something else)? What happens when two unrelated tasks run in the same repository at the same time?
- If you link to commits, what happens after a rebase, squash, or amend?

### Analysis

- Do you detect patterns with fixed rules, an LLM, or a mix? What does each one cost, and can you get the same result twice?
- What does a result mean? For example, is a high steering count good (the developer guides the agent actively) or bad (the first prompt was weak)?
- Do you report one score, several dimensions, or specific moments in the session with a link back to the exact message?
- How do you know your detection is correct?

### Privacy

- Sessions can contain secrets, private code, and personal conversations. Do you need to handle this in an MVP that only runs locally? Does your answer change if the tool uploads sessions to a server?
- Tool output (file contents, logs, environment variables) is often the largest and most sensitive part of a session. Do you keep it?

### Scope and form

- CLI, local web page, or something else? Where does the output go?
- What do you store, if anything? Files, a database, nothing?
- What would break first if 100 developers used your tool?

## Constraints

- **Time:** Plan for about one day of work. Please do not spend more than that. We value good decisions under the limit more than full coverage.
- **Stack:** Your choice. A CLI that writes a report is enough. A UI is not necessary.
- **AI tools:** Use them as much as you want. We expect you to.

## Questions

You can ask us questions in writing at any time. If you decide to make an assumption instead of asking, write it in your README. Knowing when to ask and when to decide alone is part of the exercise.

## What to send us

1. **Plan, early.** Before starting the exercise, send us a short written plan (5 to 10 lines) that describes what you will build, which patterns you chose, and what you will leave out.
2. **Repository.** The code and a README that explains:
   - how to run it,
   - the 3 to 5 decisions that mattered most, the options you rejected, and why,
   - the decisions you skipped, with one line each on why,
   - your assumptions.
3. **Self-analysis.** Run your tool on the AI sessions you used to build the repo. Send us those sessions and the tool's output. Add 3 to 5 lines: is the result correct, and what did the tool miss or get wrong? Remove secrets and private data from the sessions before you send them.
4. **Next steps.** After finishing the exercise, one paragraph or two describing what you would build next if you had one more week, and why.

## How we will review it

We will read your plan, your code, and your README. We will also run your tool on the sessions you used to build it and compare its output with what we see in those sessions.
