# Base Project for AI Agent Driven Development

**Attention AI Agents:** Before making any changes, you **must** read and adhere to the guidelines outlined in the `AGENTS.md` file. This file contains critical information about the project's workflow, rules, and architectural standards.

## About this Project

I created this project to construct my personal AI agent-driven base workflow, then use it as start point for other projects.
It may work with any AI model and tool. However I'm testing it ONLY with Kilo Code plugin for VSCode.

I recommend you to ask the AI agent to review the workflow and give you details about "what is does".

## About the Workflow

The base idea of the workflow is to create a structured and efficient process for AI agents to follow when working on projects. It ensures that all tasks are completed systematically, from analysis and planning to implementation, code review, and documentation, alongside with git version control.

With this workflow you can just ask the ai agent to work on whatever you want, and then let it work. The usual configuration of the agent is to let it does "whatever" it want, so you can give it a task and return when it finish.

## What to Expect

Clearly, this is not magic. Don't think to just give work to the AI Agent and expect a result without errors, problems and/or top quality implementations.

That depends on the models you will use, the requirements you are asking for, and how you write down yours requests.
The workflow is just a structured process to try to prevent the AI agent to broke all. Its a guardrails to restrict the AI agent to follow the steps that should improve the final result.

## Prerequisites

- Kilo Code has multiple configurations, and one of them is the option to use multiple AI agents types. The defined workflow force the ai agent to use them. If you are not using Kilo Code, or have not set up the different agents, you may need to adapt the workflow to your specific needs and tools.
- Memory Bank is another Kilo Code feature that is being used in the project. Not in the main workflow itself, it has his own workflow. However, this memory bank should improve the ai agent behaviour. Lear more about it in the Kilo Code documentation.
- The main workflow includes the execution of specific git cmds. You may read the file [How To Set Up Git](docs/how-to-set-up-git.md).

## How to Use This Project

There are 2 options: one is directly ask the work in the chat, and the other is to use a TODO file.

### Using a TODO File (Recommended)

1- **Create a TODO File**: Create a new file named `<YYYYMMDD>-todo-<number>.md` in the `todos` directory. Replace `<YYYYMMDD>` with the current date and `<number>` with a unique identifier.

2- **Define Tasks**: List all the tasks you need to complete in the TODO file. Use clear and concise language to describe each task.

3- **Ask AI to Work with it**: Write down next text in the kilo code chat box:

```text
follow @/.kilocode/workflows/critical-workflow.md and full read @/AGENTS.md 
do: @/.ai-agent/todos/<YYYYMMDD>/<YYYYMMDD>-todo-<number>.md
```

Note: replace the `<YYYYMMDD>` with the current date and `<number>` with a unique identifier.

### Directly Asking the Workflow in the Chat

1- **Ask for Changes**: Directly ask the AI agent for the changes you need in the chat. Write down next text in the kilo code chat box:
  
  ```text
  follow @/.kilocode/workflows/critical-workflow.md and full read @/AGENTS.md 
  do: your specific task or request here
  ```

2- **TODO File Creation**: following the workflow, the AI agent will create a new TODO file in the `todos` directory with your specific task or request.

## Workflow Changes

I will keep updating the workflow while I'm using it, to fix potential problems I may see.
I will also add some features after the fundamental roots of the workflow goes smoothly and without many errors.
