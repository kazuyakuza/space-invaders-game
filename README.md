# Base Project for AI Agent Driven Development

**Attention AI Agents:** Before making any changes, you **must** read and adhere to the guidelines outlined in the `AGENTS.md` file. This file contains critical information about the project's workflow, rules, and architectural standards.

## About this Project

I created this project to construct my personal AI agent-driven base workflow, then use it as start for other projects.
It may work with any AI model and tool. However I'm testing it ONLY with Kilo Code plugin for VSCode.

I recommend you to ask the AI agent to review the workflow and give you details about "what is does".

## How to Use This Project

There are 2 options, one is directly ask the work in the chat, and the other is to use a TODO file.

### Using a TODO File

1- **Create a TODO File**: Create a new file named `<YYYYMMDD>-todo-<number>.md` in the `todos` directory. Replace `<YYYYMMDD>` with the current date and `<number>` with a unique identifier.

2- **Define Tasks**: List all the tasks you need to complete in the TODO file. Use clear and concise language to describe each task.

3- **Ask AI to Work with it**: Write down next in the kilo code chat box:

```text
follow @/.kilocode/workflows/critical-workflow.md and full read @/AGENTS.md 
do: @/.ai-agent/todos/<YYYYMMDD>/<YYYYMMDD>-todo-<number>.md
```

Note: replace the `<YYYYMMDD>` with the current date and `<number>` with a unique identifier.

### Directly Asking the Workflow in the Chat

1- **Ask for Changes**: Directly ask the AI agent for the changes you need in the chat. Write down next in the kilo code chat box:
  
  ```text
  follow @/.kilocode/workflows/critical-workflow.md and full read @/AGENTS.md 
  do: your specific task or request here
  ```
  
2- **TODO File Creation**: following the workflow, the AI agent will create a new TODO file in the `todos` directory with your specific task or request.
